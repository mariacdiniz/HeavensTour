import { Link, useLocation, useNavigate } from 'react-router-dom'
import {
  LayoutDashboard,
  Plane,
  FileBarChart,
  LogOut,
  ExternalLink,
  Plus,
} from 'lucide-react'
import { AircraftIcon } from '@/components/brand/AircraftIcon'
import { Badge } from '@/components/ui/badge'
import { APP_NAME } from '@/data/constants'
import { useAuth } from '@/contexts/AuthContext'
import { cn } from '@/lib/utils'

const nav = [
  { name: 'Painel', href: '/app/dashboard', icon: LayoutDashboard },
  { name: 'Aeronaves', href: '/app/aeronaves', icon: Plane },
  { name: 'Relatórios', href: '/app/dashboard#relatorios', icon: FileBarChart },
]

export function PlatformSidebar() {
  const location = useLocation()
  const navigate = useNavigate()
  const { user, logout, hasRole } = useAuth()

  const initials = user?.nome
    ?.split(' ')
    .map((n) => n[0])
    .join('')
    .slice(0, 2)
    .toUpperCase()

  return (
    <aside className="flex h-screen w-60 flex-col border-r border-sidebar-border bg-sidebar">
      <div className="border-b border-sidebar-border p-6">
        <div className="flex items-center gap-2">
          <AircraftIcon className="text-primary" />
          <span className="text-lg font-medium">{APP_NAME}</span>
        </div>
      </div>

      <nav className="flex-1 space-y-1 p-4">
        {nav.map((item) => {
          const isDashboard = item.href.startsWith('/app/dashboard')
          const isAeronaves = item.name === 'Aeronaves'
          const isActive = isDashboard
            ? location.pathname === '/app/dashboard'
            : isAeronaves
              ? location.pathname.startsWith('/app/aeronaves')
              : false
          return (
            <Link
              key={item.name}
              to={item.href}
              className={cn(
                'relative flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition-colors',
                isActive
                  ? 'bg-primary/10 text-primary before:absolute before:inset-y-1 before:left-0 before:w-0.5 before:rounded-r before:bg-primary'
                  : 'text-sidebar-foreground hover:bg-sidebar-accent',
              )}
            >
              <item.icon className="size-4 shrink-0" />
              {item.name}
            </Link>
          )
        })}
        <Link
          to="/app/aeronaves/nova"
          className="mt-2 flex items-center gap-3 rounded-lg px-3 py-2 text-sm text-primary hover:bg-primary/5"
        >
          <Plus className="size-4" />
          Nova aeronave
        </Link>
      </nav>

      <div className="border-t border-sidebar-border p-4">
        <div className="mb-4 flex items-center gap-3">
          <div className="flex size-9 items-center justify-center rounded-full bg-primary/10 text-sm font-medium text-primary">
            {initials}
          </div>
          <div className="min-w-0 flex-1">
            <p className="truncate text-sm font-medium">{user?.nome}</p>
            {hasRole('admin') && (
              <Badge variant="outline" className="mt-1 h-5 text-[10px]">
                Administrador
              </Badge>
            )}
            {!hasRole('admin') && (
              <Badge variant="outline" className="mt-1 h-5 text-[10px]">
                Operador
              </Badge>
            )}
          </div>
        </div>
        <a
          href="/"
          className="mb-1 flex w-full items-center gap-2 rounded-lg px-3 py-2 text-sm text-muted-foreground hover:bg-sidebar-accent hover:text-foreground"
        >
          <ExternalLink className="size-4" />
          Site institucional
        </a>
        <button
          type="button"
          onClick={() => {
            logout()
            navigate('/login')
          }}
          className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-sm text-muted-foreground hover:bg-sidebar-accent hover:text-foreground"
        >
          <LogOut className="size-4" />
          Sair
        </button>
      </div>
    </aside>
  )
}
