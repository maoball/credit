"use client";

import React, { useEffect, useState } from "react";
import { cn } from "@/lib/utils";

interface TocItem {
  id: string;
  level: number;
  text: string;
}

interface TableOfContentsProps {
  content: string;
  className?: string;
}

export function TableOfContents({ content, className }: TableOfContentsProps) {
  const [toc, setToc] = useState<TocItem[]>([]);
  const [activeId, setActiveId] = useState<string>("");

  useEffect(() => {
    const lines = content.split("\n");
    const items: TocItem[] = [];

    const slugs = new Map<string, number>();
    const generateId = (text: string) => {
      const slug = text
        .toLowerCase()
        .trim()
        .replace(/\./g, "")
        .replace(/\s+/g, "-")
        .replace(/[^\p{L}\p{N}\p{M}\-_]/gu, "")
        .replace(/-+/g, "-")
        .replace(/^-+|-+$/g, "");

      const count = slugs.get(slug);
      if (count !== undefined) {
        slugs.set(slug, count + 1);
        return `${ slug }-${ count + 1 }`;
      } else {
        slugs.set(slug, 0);
        return slug;
      }
    };

    lines.forEach((line) => {
      const match = line.match(/^(#{1,4})\s+(.+)$/);
      if (match) {
        const level = match[1].length;
        const text = match[2];
        const id = generateId(text);
        items.push({ id, level, text });
      }
    });

    setToc(items);
  }, [content]);

  useEffect(() => {
    if (toc.length === 0) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveId(entry.target.id);
          }
        });
      },
      { rootMargin: "0% 0% -80% 0%" }
    );

    const headers = document.querySelectorAll("h1, h2, h3, h4");
    headers.forEach((header) => observer.observe(header));

    return () => {
      headers.forEach((header) => observer.unobserve(header));
      observer.disconnect();
    };
  }, [toc]);

  if (toc.length === 0) return null;

  return (
    <div className={cn("space-y-2", className)}>
      <p className="font-semibold text-sm text-foreground mb-4 pl-4">目录</p>
      <div className="flex flex-col text-sm space-y-1 relative">
        {toc.map((item) => (
          <a
            key={item.id}
            href={`#${ item.id }`}
            onClick={(e) => {
              e.preventDefault();
              document.getElementById(item.id)?.scrollIntoView({
                behavior: "smooth",
              });
              setActiveId(item.id);
            }}
            className={cn(
              "relative block py-1.5 transition-colors duration-200 rounded-md text-sm",
              activeId === item.id
                ? "font-medium text-primary"
                : "text-muted-foreground hover:text-foreground hover:bg-zinc-100 dark:hover:bg-zinc-800"
            )}
            style={{
              paddingLeft: `${ (item.level - 1) * 14 + 12 }px`, // Adjusted indentation step
              paddingRight: "16px"
            }}
          >
            {activeId === item.id && (
              <span className="absolute left-0 top-1/2 -translate-y-1/2 w-0.5 h-full bg-primary rounded-r-full" />
            )}
            {item.text}
          </a>
        ))}
      </div>
    </div>
  );
}
