import { site } from "@/lib/site";

export function SocialLinks({ className = "" }: { className?: string }) {
  const items = [
    { href: site.socials.youtube, label: "YouTube" },
    { href: site.socials.instagram, label: "Instagram" },
    { href: site.socials.facebook, label: "Facebook" },
    { href: site.socials.linkedin, label: "LinkedIn" }
  ];

  return (
    <div className={`flex items-center gap-3 ${className}`}>
      {items.map((item) => (
        <a
          key={item.label}
          href={item.href}
          target="_blank"
          rel="noreferrer"
          aria-label={item.label}
          className="flex h-9 w-9 items-center justify-center rounded-full border border-white/20 text-xs hover:border-[var(--coral)] hover:text-[var(--coral)]"
        >
          {item.label.slice(0, 1)}
        </a>
      ))}
    </div>
  );
}
