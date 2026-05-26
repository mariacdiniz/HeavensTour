import { Moon, Sun } from 'lucide-react'
import { useTheme } from '@/contexts/ThemeContext'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'

export function ThemeToggle({ className }: { className?: string }) {
  const { theme, toggleTheme } = useTheme()

  return (
    <Button
      type="button"
      variant="ghost"
      size="icon"
      onClick={toggleTheme}
      className={cn('relative rounded-lg', className)}
      aria-label={theme === 'light' ? 'Ativar tema escuro' : 'Ativar tema claro'}
    >
      <Sun className="size-5 scale-100 transition-all dark:scale-0 dark:opacity-0" />
      <Moon className="absolute size-5 scale-0 opacity-0 transition-all dark:scale-100 dark:opacity-100" />
    </Button>
  )
}
