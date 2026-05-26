export function formatNumber(value: number): string {
  return new Intl.NumberFormat('pt-BR').format(value)
}

export function formatKm(value: number): string {
  return `${formatNumber(Math.round(value))} km`
}

export function formatDecade(year: number): string {
  const decade = Math.floor(year / 10) * 10
  return `${decade}s`
}

export function formatDate(iso: string): string {
  return new Intl.DateTimeFormat('pt-BR', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  }).format(new Date(iso))
}
