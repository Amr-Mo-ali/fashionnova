type SocialLinksProps = {
  className?: string
  iconClassName?: string
}

const SOCIAL_LINKS = [
  {
    href: 'https://www.facebook.com/share/g/1EBb57FSHB/',
    label: 'Facebook',
    icon: (
      <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
        <path d="M13.5 22v-8h2.7l.4-3.2h-3.1V8.8c0-.9.2-1.6 1.5-1.6H16.7V4.3c-.3 0-1.3-.1-2.5-.1-2.5 0-4.2 1.5-4.2 4.4v2.2H7.3V14H10v8h3.5Z" />
      </svg>
    ),
  },
  {
    href: 'https://www.tiktok.com/@fashnova5',
    label: 'TikTok',
    icon: (
      <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
        <path d="M14.7 3c.4 1.6 1.3 2.9 2.7 3.7 1 .6 2.1.9 3.3.9v3.2a9 9 0 0 1-3.8-.8v5.2a5.9 5.9 0 1 1-5.9-5.9c.3 0 .6 0 .9.1v3.3a2.8 2.8 0 1 0 1.9 2.6V3h2.9Z" />
      </svg>
    ),
  },
  {
    href: 'https://www.instagram.com/fashnova33',
    label: 'Instagram',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true">
        <rect x="3.5" y="3.5" width="17" height="17" rx="4.5" />
        <circle cx="12" cy="12" r="4" />
        <circle cx="17.4" cy="6.6" r="1" fill="currentColor" stroke="none" />
      </svg>
    ),
  },
] as const

export default function SocialLinks({
  className = 'flex items-center gap-2',
  iconClassName = 'text-[#f5f2ed]',
}: SocialLinksProps) {
  return (
    <div className={className}>
      {SOCIAL_LINKS.map((link) => (
        <a
          key={link.label}
          href={link.href}
          target="_blank"
          rel="noopener noreferrer"
          aria-label={link.label}
          className={`inline-flex h-10 w-10 items-center justify-center transition-colors duration-150 hover:text-[#b8976a] ${iconClassName}`}
        >
          <span className="h-5 w-5">{link.icon}</span>
        </a>
      ))}
    </div>
  )
}
