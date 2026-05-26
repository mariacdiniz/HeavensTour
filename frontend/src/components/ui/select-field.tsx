import { cn } from '@/lib/utils'

interface SelectFieldProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label?: string
  error?: string
}

export function SelectField({
  label,
  error,
  className,
  children,
  id,
  ...props
}: SelectFieldProps) {
  return (
    <div className="space-y-2">
      {label && (
        <label htmlFor={id} className="text-sm font-medium text-foreground">
          {label}
        </label>
      )}
      <select
        id={id}
        className={cn(
          'flex h-10 w-full appearance-none rounded-lg border border-border bg-surface px-4 text-sm text-foreground focus-visible:border-[var(--accent)]/50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent)]/20',
          error && 'border-rose-500/50',
          className,
        )}
        {...props}
      >
        {children}
      </select>
      {error && <p className="text-xs text-rose-500">{error}</p>}
    </div>
  )
}
