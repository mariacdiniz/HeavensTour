import { Link } from 'react-router-dom'
import { Pencil, Plane } from 'lucide-react'
import { motion } from 'framer-motion'
import type { Aircraft } from '@/types/aircraft'
import { AutonomyBadge, StatusBadge } from '@/components/aircraft/AircraftBadges'
import { Button } from '@/components/ui/button'
import { formatDate, formatKm } from '@/utils/format'

interface AircraftCardProps {
  aircraft: Aircraft
  index?: number
  onDelete?: (aircraft: Aircraft) => void
  showDelete?: boolean
}

export function AircraftCard({
  aircraft,
  index = 0,
  onDelete,
  showDelete,
}: AircraftCardProps) {
  return (
    <motion.article
      initial={{ opacity: 0, y: 10 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.4, delay: index * 0.05 }}
      className="glass-panel overflow-hidden"
    >
      <div className="relative aspect-[16/10] bg-runway">
        {aircraft.imagemUrl ? (
          <img
            src={aircraft.imagemUrl}
            alt={aircraft.nome}
            className="size-full object-cover"
          />
        ) : (
          <div className="flex size-full flex-col items-center justify-center gap-2 text-subtle">
            <Plane className="size-10" strokeWidth={1} />
            <span className="text-xs">Sem imagem</span>
          </div>
        )}
        <span className="absolute left-3 top-3 rounded bg-background/80 px-2 py-0.5 font-mono text-xs text-foreground">
          {aircraft.icaoCode}
        </span>
      </div>

      <div className="p-5">
        <div className="flex items-start justify-between gap-2">
          <div>
            <h3 className="font-semibold text-foreground">{aircraft.nome}</h3>
            <p className="text-sm text-muted">
              {aircraft.marca} · {aircraft.ano}
            </p>
          </div>
          <StatusBadge vendido={aircraft.vendido} />
        </div>

        <p className="mt-3 line-clamp-2 text-sm text-muted">{aircraft.descricao}</p>

        <div className="mt-4 flex flex-wrap items-center gap-2">
          <span className="text-xs text-muted">{formatKm(aircraft.autonomiaKm)}</span>
          <AutonomyBadge category={aircraft.categoriaAutonomia} />
        </div>

        <p className="mt-3 text-[11px] text-subtle">
          Cadastro {formatDate(aircraft.createdAt)}
        </p>

        <div className="mt-4 flex gap-2">
          <Button variant="secondary" size="sm" asChild>
            <Link to={`/app/aeronaves/${aircraft.id}/editar`}>
              <Pencil className="size-3.5" />
              Editar
            </Link>
          </Button>
          {showDelete && onDelete && (
            <Button
              variant="ghost"
              size="sm"
              className="text-rose-500"
              onClick={() => onDelete(aircraft)}
            >
              Excluir
            </Button>
          )}
        </div>
      </div>
    </motion.article>
  )
}
