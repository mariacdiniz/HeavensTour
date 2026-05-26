/** Torna URLs de imagem acessíveis no navegador (LocalStack, uploads locais, API). */
export function resolveAircraftImageUrl(url?: string): string | undefined {
  if (!url) return undefined
  if (url.startsWith('data:')) return url

  let resolved = url.replace(/:\/\/localstack:/gi, '://localhost:')

  const s3Public = import.meta.env.VITE_S3_PUBLIC_URL?.replace(/\/$/, '')
  if (s3Public && resolved.includes('localhost:4566')) {
    resolved = resolved.replace(/https?:\/\/localhost:4566/g, s3Public)
  }

  if (resolved.startsWith('http')) return resolved

  const apiBase = (import.meta.env.VITE_API_URL ?? 'http://localhost:3333').replace(
    /\/$/,
    '',
  )
  return `${apiBase}${resolved.startsWith('/') ? resolved : `/${resolved}`}`
}
