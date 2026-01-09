import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

/* ==================== 速率限制配置 ==================== */
/* 
 * 限流原理：
 * 利用前端服务层机制实现限流，从而避免后端承受过载请求
 * 
 */

interface RateLimitEntry {
  count: number      // 当前窗口内请求数
  windowStart: number // 窗口开始时间
}

/**
 * 速率限制存储
 */
const rateLimitStore = new Map<string, RateLimitEntry>()

/**
 * 不需要速率限制的路径前缀
 */
const EXCLUDED_PREFIXES = [
  '/api/v1/config',     // 配置接口（公开）
  '/epay/',             // 易支付接口
  '/lpay/',             // lpay接口
]

/**
 * 速率限制规则: [每窗口最大请求数, 窗口时长(毫秒)]
 * 
 * 所有接口最快 1秒1次，敏感接口更严格
 */
const RATE_LIMITS: Record<string, [number, number]> = {
  '/api/v1/oauth/login': [1, 5000],
  '/api/v1/oauth/callback': [1, 5000],
  '/api/v1/redenvelope': [30, 60000],
}

/**
 * 默认速率限制: 60秒内最多60次（平均1秒1次，允许突发）
 */
const DEFAULT_RATE_LIMIT: [number, number] = [60, 60000]

/**
 * 获取端点的速率限制规则
 */
function getRateLimit(pathname: string): [number, number] {
  if (RATE_LIMITS[pathname]) {
    return RATE_LIMITS[pathname]
  }

  const sortedPrefixes = Object.keys(RATE_LIMITS)
    .filter(prefix => pathname.startsWith(prefix))
    .sort((a, b) => b.length - a.length)

  if (sortedPrefixes.length > 0) {
    return RATE_LIMITS[sortedPrefixes[0]]
  }

  return DEFAULT_RATE_LIMIT
}

/**
 * 检查是否需要速率限制
 */
function shouldRateLimit(pathname: string): boolean {
  return !EXCLUDED_PREFIXES.some(prefix => pathname.startsWith(prefix))
}

/**
 * 检查速率限制
 * @returns [是否允许, 剩余等待秒数]
 */
function checkRateLimit(identifier: string, pathname: string): [boolean, number] {
  const [maxRequests, windowMs] = getRateLimit(pathname)
  const key = `${ identifier }:${ pathname }`
  const now = Date.now()

  const entry = rateLimitStore.get(key)

  if (!entry || now - entry.windowStart >= windowMs) {
    rateLimitStore.set(key, { count: 1, windowStart: now })
    return [true, 0]
  }

  entry.count++

  if (entry.count > maxRequests) {
    const waitTime = Math.ceil((windowMs - (now - entry.windowStart)) / 1000)
    return [false, waitTime]
  }

  return [true, 0]
}

/**
 * 定期清理过期记录
 */
if (typeof setInterval !== 'undefined') {
  setInterval(() => {
    const now = Date.now()
    for (const [key, entry] of rateLimitStore.entries()) {
      if (now - entry.windowStart > 120000) {
        rateLimitStore.delete(key)
      }
    }
  }, 60000)
}

// ==================== 代理主函数 ====================

export function proxy(request: NextRequest) {
  const { pathname, search } = request.nextUrl
  const sessionCookieName = process.env.LINUX_DO_CREDIT_SESSION_COOKIE_NAME || 'linux_do_credit_session_id'
  const sessionCookie = request.cookies.get(sessionCookieName)

  if (pathname.startsWith('/api/') && shouldRateLimit(pathname)) {
    const identifier = sessionCookie?.value ||
      request.headers.get('x-forwarded-for')?.split(',')[0].trim() ||
      request.headers.get('x-real-ip') ||
      'anonymous'

    const [allowed, waitTime] = checkRateLimit(identifier, pathname)

    if (!allowed) {
      return NextResponse.json(
        {
          error_code: 'RATE_LIMITED',
          error_msg: `请求过于频繁，请 ${ waitTime } 秒后重试`,
        },
        {
          status: 429,
          headers: { 'Retry-After': String(waitTime) },
        }
      )
    }
  }

  const publicRoutes = ['/', '/login', '/callback', '/privacy', '/terms']
  const publicPrefixes = ['/docs/', '/epay/']

  const isPublicRoute = publicRoutes.includes(pathname) ||
    publicPrefixes.some(prefix => pathname.startsWith(prefix))

  if (isPublicRoute) {
    return NextResponse.next()
  }

  if (!sessionCookie) {
    const loginUrl = new URL('/login', request.url)
    loginUrl.searchParams.set('callbackUrl', pathname + search)
    return NextResponse.redirect(loginUrl)
  }

  return NextResponse.next()
}

export const config = {
  matcher: [
    '/api/:path*',
    '/((?!_next|favicon.ico|robots.txt|sitemap.xml|.*\\.(?:jpg|jpeg|gif|png|svg|ico|webp)).*)',
  ],
}
