import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Cloud } from 'lucide-react'
import { SkyBackground } from '@/three/AircraftScene'
import { Button } from '@/components/ui/button'
import { ThemeToggle } from '@/components/ui/ThemeToggle'

export function NotFoundPage() {
  return (
    <div className="relative flex min-h-screen flex-col items-center justify-center px-6 text-center">
      <SkyBackground />
      <div className="absolute right-4 top-4">
        <ThemeToggle />
      </div>
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative z-10"
      >
        <div className="mx-auto mb-6 flex size-20 items-center justify-center rounded-full border border-border bg-surface">
          <Cloud className="size-10 text-accent/70" strokeWidth={1} />
        </div>
        <p className="text-6xl font-semibold text-subtle">404</p>
        <h1 className="mt-2 text-xl font-semibold text-foreground">Página não encontrada</h1>
        <p className="mx-auto mt-2 max-w-sm text-sm text-muted">
          A rota solicitada não existe. Volte ao site ou ao painel.
        </p>
        <div className="mt-8 flex flex-wrap justify-center gap-3">
          <Button asChild>
            <Link to="/">Início</Link>
          </Button>
          <Button variant="secondary" asChild>
            <Link to="/app/dashboard">Dashboard</Link>
          </Button>
        </div>
      </motion.div>
    </div>
  )
}
