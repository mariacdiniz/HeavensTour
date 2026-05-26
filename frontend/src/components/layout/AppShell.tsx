import { Outlet, useLocation } from 'react-router-dom'
import { PlatformSidebar } from '@/components/layout/PlatformSidebar'
import { PlatformHeader } from '@/components/layout/PlatformHeader'

const titles: Record<string, string> = {
  '/app/dashboard': 'Painel operacional',
  '/app/aeronaves': 'Aeronaves',
  '/app/aeronaves/nova': 'Nova aeronave',
}

function getTitle(pathname: string) {
  if (pathname.includes('/editar')) return 'Editar aeronave'
  return titles[pathname] ?? 'Painel operacional'
}

export function AppShell() {
  const location = useLocation()
  const title = getTitle(location.pathname)

  return (
    <div className="flex h-screen bg-background">
      <PlatformSidebar />
      <div className="flex flex-1 flex-col overflow-hidden">
        <PlatformHeader title={title} />
        <main className="flex-1 overflow-y-auto">
          <Outlet />
        </main>
      </div>
    </div>
  )
}
