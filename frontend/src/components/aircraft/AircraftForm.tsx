import { useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import {
  aircraftFormSchema,
  type AircraftFormValues,
} from '@/validations/aircraft.schema'
import { MANUFACTURERS } from '@/data/constants'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Button } from '@/components/ui/button'
import { SelectField } from '@/components/ui/select-field'
import {
  calculateAutonomyKm,
  getAutonomyCategory,
} from '@/utils/autonomy'
import { formatKm } from '@/utils/format'
import { AutonomyBadge } from '@/components/aircraft/AutonomyBadge'
import type { Aircraft } from '@/types/aircraft'

interface AircraftFormProps {
  defaultValues?: Partial<Aircraft>
  onSubmit: (values: AircraftFormValues) => Promise<void>
  isSubmitting?: boolean
  submitLabel?: string
}

const emptyDefaults: AircraftFormValues = {
  nome: '',
  marca: 'Boeing',
  ano: new Date().getFullYear(),
  descricao: '',
  vendido: false,
  icaoCode: '',
  capacidadeCombustivel: 10000,
  consumoMedio: 0.15,
}

export function AircraftForm({
  defaultValues,
  onSubmit,
  isSubmitting,
  submitLabel = 'Salvar aeronave',
}: AircraftFormProps) {
  const {
    register,
    handleSubmit,
    watch,
    reset,
    formState: { errors },
  } = useForm<AircraftFormValues>({
    resolver: zodResolver(aircraftFormSchema),
    defaultValues: emptyDefaults,
  })

  useEffect(() => {
    if (defaultValues) {
      reset({
        nome: defaultValues.nome ?? '',
        marca: (defaultValues.marca as AircraftFormValues['marca']) ?? 'Boeing',
        ano: defaultValues.ano ?? new Date().getFullYear(),
        descricao: defaultValues.descricao ?? '',
        vendido: defaultValues.vendido ?? false,
        icaoCode: defaultValues.icaoCode ?? '',
        capacidadeCombustivel: defaultValues.capacidadeCombustivel ?? 10000,
        consumoMedio: defaultValues.consumoMedio ?? 0.15,
      })
    }
  }, [defaultValues, reset])

  const fuel = watch('capacidadeCombustivel')
  const consumption = watch('consumoMedio')
  const previewKm =
    fuel > 0 && consumption > 0
      ? calculateAutonomyKm(Number(fuel), Number(consumption))
      : 0
  const previewCategory =
    previewKm > 0 ? getAutonomyCategory(previewKm) : null

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <div className="grid gap-6 md:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="nome">Nome do modelo</Label>
          <Input id="nome" {...register('nome')} placeholder="737-800" />
          {errors.nome && (
            <p className="text-xs text-rose-400">{errors.nome.message}</p>
          )}
        </div>
        <div className="space-y-2">
          <SelectField
            label="Fabricante"
            id="marca"
            {...register('marca')}
            error={errors.marca?.message}
          >
            {MANUFACTURERS.map((m) => (
              <option key={m} value={m}>
                {m}
              </option>
            ))}
          </SelectField>
        </div>
        <div className="space-y-2">
          <Label htmlFor="icaoCode">ICAO (4 caracteres)</Label>
          <Input
            id="icaoCode"
            {...register('icaoCode')}
            placeholder="B738"
            className="font-mono uppercase"
            maxLength={4}
          />
          {errors.icaoCode && (
            <p className="text-xs text-rose-400">{errors.icaoCode.message}</p>
          )}
        </div>
        <div className="space-y-2">
          <Label htmlFor="ano">Ano de fabricação</Label>
          <Input id="ano" type="number" {...register('ano', { valueAsNumber: true })} />
          {errors.ano && (
            <p className="text-xs text-rose-400">{errors.ano.message}</p>
          )}
        </div>
        <div className="space-y-2">
          <Label htmlFor="capacidadeCombustivel">Capacidade combustível (L)</Label>
          <Input
            id="capacidadeCombustivel"
            type="number"
            step="1"
            {...register('capacidadeCombustivel', { valueAsNumber: true })}
          />
          {errors.capacidadeCombustivel && (
            <p className="text-xs text-rose-400">
              {errors.capacidadeCombustivel.message}
            </p>
          )}
        </div>
        <div className="space-y-2">
          <Label htmlFor="consumoMedio">Consumo médio (km/L)</Label>
          <Input
            id="consumoMedio"
            type="number"
            step="0.01"
            {...register('consumoMedio', { valueAsNumber: true })}
          />
          {errors.consumoMedio && (
            <p className="text-xs text-rose-400">{errors.consumoMedio.message}</p>
          )}
        </div>
      </div>

      {previewCategory && (
        <div className="flex items-center gap-4 rounded-xl border border-border bg-[var(--accent-soft)] px-4 py-3">
          <div>
            <p className="text-xs text-muted">Autonomia calculada</p>
            <p className="text-lg font-semibold text-foreground">{formatKm(previewKm)}</p>
          </div>
          <AutonomyBadge category={previewCategory} />
        </div>
      )}

      <div className="space-y-2">
        <Label htmlFor="descricao">Descrição</Label>
        <textarea
          id="descricao"
          rows={4}
          className="flex w-full rounded-lg border border-border bg-surface px-4 py-3 text-sm text-foreground placeholder:text-subtle focus-visible:border-[var(--accent)]/50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent)]/20"
          {...register('descricao')}
        />
        {errors.descricao && (
          <p className="text-xs text-rose-400">{errors.descricao.message}</p>
        )}
      </div>

      <label className="flex cursor-pointer items-center gap-3 rounded-lg border-2 border-primary/30 bg-primary/5 px-4 py-3 transition-colors hover:border-primary/50 hover:bg-primary/10 has-[:checked]:border-primary has-[:checked]:bg-primary/15 dark:border-primary/40 dark:bg-primary/10 dark:hover:bg-primary/20">
        <input
          type="checkbox"
          className="size-5 shrink-0 rounded border-2 border-primary/50 accent-primary text-primary focus-visible:ring-2 focus-visible:ring-primary/40"
          {...register('vendido')}
        />
        <span className="text-sm font-medium text-foreground">
          Marcar como vendida
        </span>
      </label>

      <div className="flex justify-end gap-3">
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? 'Salvando...' : submitLabel}
        </Button>
      </div>
    </form>
  )
}
