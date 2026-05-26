import { Link, NavLink, Outlet } from 'react-router-dom'
import { AircraftIcon } from '@/components/brand/AircraftIcon'
import { ThemeToggle } from '@/components/ui/ThemeToggle'
import { Button } from '@/components/ui/button'
import { APP_NAME } from '@/data/constants'
import { cn } from '@/lib/utils'

const links = [
  { to: '/', label: 'Início', end: true },
  { to: '/plataforma', label: 'Plataforma' },
  { to: '/sobre', label: 'Quem somos' },
  { to: '/contato', label: 'Contato' },
]

export function PublicLayout() {
  return (
    <div className="min-h-screen bg-background">
      <nav className="sticky top-0 z-50 w-full border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/80">
        <div className="container-app flex h-16 items-center justify-between">
          <Link to="/" className="flex items-center gap-2">
            <AircraftIcon className="text-primary" />
            <span className="text-lg font-medium">{APP_NAME}</span>
          </Link>
          <div className="hidden items-center gap-8 md:flex">
            {links.map(({ to, label, end }) => (
              <NavLink
                key={to}
                to={to}
                end={end}
                className={({ isActive }) =>
                  cn(
                    'text-sm transition-colors',
                    isActive ? 'text-primary font-medium' : 'text-muted-foreground hover:text-foreground',
                  )
                }
              >
                {label}
              </NavLink>
            ))}
          </div>
          <div className="flex items-center gap-2">
            <ThemeToggle />
            <Button size="sm" asChild>
              <Link to="/login">Acessar plataforma</Link>
            </Button>
          </div>
        </div>
      </nav>
      <Outlet />
    </div>
  )
}
