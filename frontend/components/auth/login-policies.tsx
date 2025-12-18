import { type ReactNode } from "react"

export const LAST_UPDATED = "2025-12-16"

export type PolicySection = {
  value: string
  title: string
  content: ReactNode
}

/**
 * ------------------------------------------------------------------
 * 服务条款 (TERMS OF SERVICE)
 * ------------------------------------------------------------------
 */
export const termsSections: PolicySection[] = [
  {
    value: "contract-establishment",
    title: "1. 缔约申明与服务综述",
    content: (
      <div className="space-y-4 text-sm leading-relaxed">
        <p><strong>1.1 缔约主体：</strong>本《服务协议》（以下简称“本协议”）是您（以下亦称“社区用户”、“开发者”、“消费方”或“服务方”）与 LINUX DO Credit 平台运营团队（以下简称“平台”、“我们”）之间关于使用平台服务所订立的具有法律约束力的契约。</p>
        <p><strong>1.2 审慎阅读：</strong>请您务必审慎阅读、充分理解各条款内容，特别是<strong>免除或者限制责任的条款、争议解决和法律适用条款</strong>。各免责或限责条款将以粗体标识，您应重点阅读。如您不同意本协议的任何内容，请立即停止注册或使用本服务。</p>
        <p><strong>1.3 协议构成：</strong>本协议内容包括协议正文及所有我们已经发布或将来可能发布的各类规则、声明、说明。所有规则为本协议不可分割的组成部分，与协议正文具有同等法律效力。</p>
      </div>
    ),
  },
  {
    value: "service-definition",
    title: "2. 服务定义与性质界定",
    content: (
      <div className="space-y-4 text-sm leading-relaxed">
        <p><strong>2.1 社区技术服务：</strong>LINUX DO Credit 是基于 LINUX DO 社区生态构建的独立价值交换协议与技术系统。我们仅提供 API 接口调用、数据路由、账单管理等<strong>纯技术服务</strong>。</p>
        <p><strong>2.2 非金融机构申明：</strong></p>
        <ul className="list-disc pl-5 space-y-2">
          <li><strong>非银行机构：</strong>我们不是商业银行、持牌支付机构（如支付宝、微信支付、银联）或清算机构。</li>
          <li><strong>不提供资金沉淀：</strong>平台不设立资金池，不提供真实法币存取款、转账汇款或支付结算服务。所有涉及资金流转的行为均发生于社区用户与社区支付渠道之间，不涉及真实货币。</li>
          <li><strong>不提供金融服务：</strong>平台不提供任何金融服务，包括但不限于贷款、融资、投资、理财、保险等金融服务。</li>
          <li><strong>不提供积分兑现：</strong>平台不提供任何积分兑换服务，包括但不限于积分兑换为真实货币、积分兑换为实物商品、积分兑换为服务等。</li>
          <li><strong>不提供真实货币交易：</strong>平台不提供任何真实货币交易服务，包括但不限于真实货币交易为积分、真实货币交易为虚拟资产、真实货币交易为服务等。</li>
        </ul>
        <p><strong>2.3 服务限定：</strong>本平台建议用于仅支持虚拟商品、软件授权、技术咨询、会员订阅等<strong>无实物交付</strong>的场景。关于实物电商、物流发货或涉及线下履约的商业场景造成的任何后果我们概不负责，请妥善保管好自己的个人财产，谨防上当受骗。</p>
      </div>
    ),
  },
  {
    value: "account-specifications",
    title: "3. 账号注册与使用规范",
    content: (
      <div className="space-y-4 text-sm leading-relaxed">
        <p><strong>3.1 账号体系：</strong>本平台采用 LINUX DO Connect (OAuth) 授权登录体系。您必须拥有合法、有效的 LINUX DO 社区账号方可使用本服务。您的平台账号权益（包括但不限于信誉分、等级）与社区账号严格绑定。</p>
        <p><strong>3.2 匿名性与真实性：</strong></p>
        <ul className="list-disc pl-5 space-y-2">
          <li><strong>无需实名：</strong>我们尊重您的隐私，不强制要求您提供居民身份证、护照或营业执照进行实名认证。</li>
          <li><strong>操作真实性：</strong>您承诺注册和使用的账号是您本人操作。严禁恶意注册、挂机脚本、自动化程序注册等破坏平台公平性的行为。</li>
        </ul>
        <p><strong>3.3 账号安全责任：</strong>您应妥善保管您账号的支付密码、Client ID 和 Client Secret。<strong>因您保管不善可能导致账号被他人非法使用、资金损失或数据泄露的责任，由您自行承担。</strong>如发现账号异常，请立即通知我们进行冻结。</p>
      </div>
    ),
  },
  {
    value: "user-conduct",
    title: "4. 用户行为准则（负面清单）",
    content: (
      <div className="space-y-4 text-sm leading-relaxed">
        <p>您在使用本服务时，必须严格遵守《中华人民共和国网络安全法》、《计算机信息网络国际联网安全保护管理办法》等法律法规。<strong>严禁利用本平台从事以下活动（“红线条款”）：</strong></p>
        <div className="bg-red-500/5 border border-red-500/20 rounded-lg p-4 space-y-3">
          <ul className="list-disc pl-5 space-y-2 text-red-600 dark:text-red-400 font-medium">
            <li><strong>危害国家安全：</strong>反对宪法所确定的基本原则、危害国家安全、泄露国家秘密、颠覆国家政权、破坏国家统一的；</li>
            <li><strong>非法信息服务：</strong>黑客攻击工具、DDoS 攻击服务、服务器爆破等其他非法信息服务平台；</li>
            <li><strong>黄赌毒关联：</strong>制作、复制、发布、传播淫秽、色情、赌博、暴力、凶杀、恐怖或者教唆犯罪的；</li>
            <li><strong>侵犯知识产权：</strong>销售盗版软件、盗版影视资源、非法游戏外挂、私服、黑号、社工库数据等；</li>
            <li><strong>欺诈与虚假：</strong>进行电信诈骗、金融诈骗、传销、虚假广告虚假交易等；</li>
            <li><strong>其他违法信息：</strong>涉及散布谣言、宣扬邪教/封建迷信、侮辱/诽谤他人、侵害他人合法权益的。</li>
          </ul>
        </div>
        <p><strong>违约处理：</strong>一旦发现您违反上述规定，平台有权不经通知<strong>立即永久封禁您的账号、拦截所有 API 请求、冻结账户内所有关联价值，并依法向公安机关、网安部门移交相关线索。</strong></p>
      </div>
    ),
  },
  {
    value: "virtual-assets",
    title: "5. 虚拟资产与交易规则",
    content: (
      <div className="space-y-4 text-sm leading-relaxed">
        <p><strong>5.1 资产性质：</strong>平台内流转的“余额”、“积分”等均为社区虚拟资产，仅代表您在社区生态内的技术贡献或权益凭证，不具有法定货币等同的法律地位，原则上不支持反向兑换为法定货币。</p>
        <p><strong>5.2 交易不可逆：</strong>鉴于区块链及网络技术的特性，<strong>一旦虚拟资产转移指令被执行，该操作即不可撤销。</strong>请您在确认支付或转账前，务必仔细核对收款方信息。</p>
        <p><strong>5.3 费用说明：</strong>为营造良好的交易环境和货币系统，平台有权向商户收取服务费、手续费（均为虚拟资产，不涉及真实货币），具体费率以控制台公示为准。平台保留根据金融审计结果调整费率的权利。</p>
      </div>
    ),
  },
  {
    value: "liability-limitation",
    title: "6. 免责声明与不可抗力",
    content: (
      <div className="space-y-4 text-sm leading-relaxed">
        <p><strong>6.1 基础免责：</strong>本平台服务按“现状”（As-Is）及“现有”（As-Available）状态提供。我们不保证服务一定能满足您的要求，也不保证服务不会中断，对服务的及时性、安全性、准确性都不作担保。</p>
        <p><strong>6.2 不可抗力：</strong>对于因以下原因导致的服务中断、数据丢失或账号损失，平台不承担赔偿责任：</p>
        <ul className="list-disc pl-5 space-y-1 text-muted-foreground">
          <li>自然灾害（台风、地震、海啸、洪水等）；</li>
          <li>政府行为、法律法规或政策调整、行政命令；</li>
          <li>电信部门技术调整、通讯线路中断、海底光缆故障；</li>
          <li>黑客攻击、计算机病毒侵入或发作、技术性故障；</li>
          <li>社区维护、系统升级（我们将尽可能提前公告）。</li>
        </ul>
        <p><strong>6.3 责任上限：</strong>在任何情况下，平台对您所承担的违约赔偿责任总额不超过您在违约行为发生前 1 个月内向平台支付的费用总额。</p>
      </div>
    ),
  },
  {
    value: "governing-law",
    title: "7. 法律适用与争议解决",
    content: (
      <div className="space-y-4 text-sm leading-relaxed">
        <p><strong>7.1 法律适用：</strong>本协议的订立、执行、解释及争议的解决均适用<strong>中华人民共和国法律</strong>（不包括港澳台地区法律及冲突法）。</p>
        <p><strong>7.2 争议解决：</strong>若您和平台发生任何争议或纠纷，首先应友好协商解决；协商不成的，您同意将纠纷或争议提交至<strong>平台运营团队所在地有管辖权的人民法院</strong>管辖。</p>
        <p><strong>7.3 协议变更：</strong>我们有权根据法律法规变化或业务发展需要修改本协议。变更后的协议将在平台公示，自公示之日起生效。若您继续使用服务，视为您已接受修订后的协议。</p>
      </div>
    ),
  },
]

/**
 * ------------------------------------------------------------------
 * 隐私政策 (PRIVACY POLICY) - 增强版
 * ------------------------------------------------------------------
 */
export const privacySections: PolicySection[] = [
  {
    value: "collection-details",
    title: "1. 详细信息收集说明",
    content: (
      <div className="space-y-4 text-sm leading-relaxed">
        <p>我们仅遵循合法、正当、必要的原则，收集为您提供服务所必需的信息。我们的数据收集范围严格限制如下：</p>
        <div className="space-y-3">
          <div>
            <span className="font-semibold text-foreground">1.1 身份鉴权信息：</span>
            <p className="mt-1 text-muted-foreground">当您通过 LINUX DO Connect 登录时，我们会获取您的社区 OpenID（唯一标识符）、加密后的用户名及头像 URL。<strong>我们不收集您的手机号、真实姓名或身份证件信息。</strong></p>
          </div>
          <div>
            <span className="font-semibold text-foreground">1.2 服务日志信息：</span>
            <p className="mt-1 text-muted-foreground">为保障系统运行安全及满足法律合规要求，我们会自动收集您的操作日志，包括 IP 地址、访问日期和时间、API 调用记录、User-Agent（浏览器/设备类型）。</p>
          </div>
          <div>
            <span className="font-semibold text-foreground">1.3 交易与资产信息：</span>
            <p className="mt-1 text-muted-foreground">若您使用支付或转账功能，我们将记录您的商户订单号、交易金额、交易时间、交易状态摘要。这些信息是账务核对的必要依据。</p>
          </div>
        </div>
      </div>
    ),
  },
  {
    value: "storage-security",
    title: "2. 数据存储与安全保护",
    content: (
      <div className="space-y-4 text-sm leading-relaxed">
        <p>我们深知数据安全的重要性，并采取业界领先的技术措施保护您的数据：</p>
        <ul className="list-disc pl-5 space-y-2">
          <li><strong>存储地点：</strong>依照法规要求，我们收集和产生的用户个人信息，<strong>存储在独立</strong>的服务器上。我们不会将您的数据传输至境外管辖区。</li>
          <li><strong>加密技术：</strong>敏感数据（如 支付密码）在数据库中均采用高强度加密算法存储。数据传输全链路采用 SSL/TLS 1.3 协议进行加密，防止网络嗅探。</li>
          <li><strong>隔离机制：</strong>本平台数据与外部网络物理隔离，且独立于 LINUX DO 社区论坛主数据库，确保单一系统故障不会波及全局数据安全。</li>
          <li><strong>访问控制：</strong>我们实行严格的最小权限原则（Least Privilege），仅有核心运维人员经授权后方可访问必要的维护数据，且所有操作均有审计日志留存。</li>
        </ul>
      </div>
    ),
  },
  {
    value: "usage-rules",
    title: "3. 信息使用规范",
    content: (
      <div className="space-y-4 text-sm leading-relaxed">
        <p>我们收集的信息将仅用于以下目的：</p>
        <ul className="list-disc pl-5 space-y-1">
          <li><strong>身份识别：</strong>用于确认您的社区身份，展示您的个人中心数据。</li>
          <li><strong>业务功能：</strong>处理您的支付指令、API 请求、回调通知及账单生成。</li>
          <li><strong>安全风控：</strong>利用 IP 及行为日志进行反作弊、反欺诈分析，识别恶意攻击行为，保护平台及其他用户的安全。</li>
          <li><strong>客户支持：</strong>在您发起工单或申诉时，查询相关日志以协助您解决问题。</li>
        </ul>
        <p><strong>禁止用途：</strong>我们承诺<strong>绝不</strong>利用您的数据进行用户画像分析、个性化广告推送或商业营销。</p>
      </div>
    ),
  },
  {
    value: "sharing-disclosure",
    title: "4. 信息共享与对外披露",
    content: (
      <div className="space-y-4 text-sm leading-relaxed">
        <p><strong>4.1 共享原则：</strong>我们坚持<strong>数据零共享</strong>策略。除以下极端情况外，我们不会向任何第三方（包括且不限于关联公司、支付宝、微信、银行、广告商）共享您的个人信息：</p>
        <ul className="list-disc pl-5 space-y-1 text-muted-foreground">
          <li>事先获得您的明确授权或同意；</li>
          <li>根据适用的法律法规、法律程序的要求、强制性的行政或司法要求所必须的情况下进行提供。</li>
        </ul>
        <p><strong>4.2 转让与公开披露：</strong>我们不会将您的个人信息转让给任何公司、组织和个人。我们仅在法律法规强制要求，或为了保护平台及用户与公众的人身财产安全免受侵害时，才会公开披露您的信息。</p>
      </div>
    ),
  },
  {
    value: "user-rights",
    title: "5. 您的权利与数据管理",
    content: (
      <div className="space-y-4 text-sm leading-relaxed">
        <p>依照《中华人民共和国个人信息保护法》，您对您的个人信息享有完整的控制权：</p>
        <div className="space-y-3">
          <div>
            <span className="font-semibold text-foreground">5.1 查阅与复制权：</span>
            <p className="mt-1 text-muted-foreground">您可以随时登录开发者后台，查阅您的概览信息、API Key 状态及历史交易账单。您可以通过“导出账单”功能获取您的数据副本。</p>
          </div>
          <div>
            <span className="font-semibold text-foreground">5.2 删除与遗忘权：</span>
            <p className="mt-1 text-muted-foreground">若您决定停止使用本服务，在结清所有应付费用及余额后，您可以申请<strong>注销账户</strong>。注销后，我们将立即删除您的所有敏感信息或进行匿名化处理，法律法规规定需保留的日志除外。</p>
          </div>
          <div>
            <span className="font-semibold text-foreground">5.3 纠正与更正权：</span>
            <p className="mt-1 text-muted-foreground">若您发现您的信息有误，您有权要求我们更正或补充。您可以在设置页面直接修改您的信息，或通过客服提交工单。</p>
          </div>
        </div>
      </div>
    ),
  },
  {
    value: "policy-update",
    title: "6. 政策更新与通知",
    content: (
      <div className="space-y-4 text-sm leading-relaxed">
        <p>随着业务的发展或法律法规的变动，我们可能会适时修订本《隐私政策》。</p>
        <p>当条款发生重大变更时（例如收集范围扩大、使用目的改变），我们会通过站内信、公告或弹窗等显著方式通知您。若您在政策更新后继续使用本服务，即表示您同意接受更新后的隐私政策约束。</p>
      </div>
    ),
  },
]
