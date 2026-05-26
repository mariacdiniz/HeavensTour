import { cn } from '@/lib/utils'

export function AircraftIcon({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={cn('size-6', className)}
      aria-hidden
    >
      <path d="M10.5 4.5L12 3l1.5 1.5" />
      <path d="M12 3v5" />
      <path d="M3 11h8l-2-3h-2a2 2 0 0 0-2 2v1z" />
      <path d="M13 11h8l2-3h2a2 2 0 0 1 2 2v1z" />
      <path d="M12 8l-2 3h4l-2-3z" />
      <path d="M12 11v8" />
      <path d="M9 16l3 3 3-3" />
    </svg>
  )
}

export function AircraftDivider({ className }: { className?: string }) {
  return (
    <div className={cn('w-full', className)}>
      <svg
        viewBox="0 0 120 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="0.5"
        className="h-6 w-full text-muted-foreground/25"
        aria-hidden
      >
        <path d="M40 12h10l5-4h2l3 4h2l-3-4h-2l-5 4h-10M52 12l2 4M56 12l2 4" />
        <line x1="0" y1="12" x2="40" y2="12" />
        <line x1="62" y1="12" x2="120" y2="12" />
      </svg>
    </div>
  )
}
