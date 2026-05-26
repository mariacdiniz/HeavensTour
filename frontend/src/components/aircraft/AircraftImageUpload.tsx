import { useEffect, useRef, useState } from 'react'
import { ImagePlus, Loader2, X } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'

interface AircraftImageUploadProps {
  currentUrl?: string
  /** Upload imediato (edição / API) */
  onUpload?: (file: File) => Promise<void>
  /** Apenas seleciona arquivo (criação — envia no submit) */
  onFileSelect?: (file: File | null) => void
  disabled?: boolean
}

export function AircraftImageUpload({
  currentUrl,
  onUpload,
  onFileSelect,
  disabled,
}: AircraftImageUploadProps) {
  const inputRef = useRef<HTMLInputElement>(null)
  const [preview, setPreview] = useState<string | undefined>(currentUrl)
  const [uploading, setUploading] = useState(false)
  const deferred = Boolean(onFileSelect) && !onUpload

  useEffect(() => {
    setPreview(currentUrl)
  }, [currentUrl])

  const displayUrl = preview ?? currentUrl

  const handleFile = async (file: File) => {
    if (!file.type.startsWith('image/')) return
    const localPreview = URL.createObjectURL(file)
    setPreview(localPreview)

    if (deferred) {
      onFileSelect?.(file)
      return
    }

    if (!onUpload) return

    setUploading(true)
    try {
      await onUpload(file)
    } catch {
      setPreview(currentUrl)
      URL.revokeObjectURL(localPreview)
    } finally {
      setUploading(false)
    }
  }

  const clearSelection = () => {
    setPreview(undefined)
    if (inputRef.current) inputRef.current.value = ''
    onFileSelect?.(null)
  }

  return (
    <div className="space-y-3">
      <p className="text-sm font-medium text-foreground">Imagem da aeronave</p>
      <div
        className={cn(
          'relative aspect-video overflow-hidden rounded-xl border border-border bg-runway',
          disabled && 'opacity-60',
        )}
      >
        {displayUrl ? (
          <>
            <img src={displayUrl} alt="Preview da aeronave" className="size-full object-cover" />
            {!disabled && (
              <button
                type="button"
                className="absolute right-2 top-2 rounded-lg bg-background/90 p-1.5 text-muted"
                onClick={clearSelection}
                aria-label="Remover imagem"
              >
                <X className="size-4" />
              </button>
            )}
          </>
        ) : (
          <div className="flex size-full flex-col items-center justify-center gap-2 text-subtle">
            <ImagePlus className="size-8" strokeWidth={1.25} />
            <span className="text-xs">PNG, JPG ou WebP — máx. 5 MB</span>
          </div>
        )}
        {uploading && (
          <div className="absolute inset-0 flex items-center justify-center bg-background/80">
            <Loader2 className="size-8 animate-spin text-accent" />
          </div>
        )}
      </div>
      <input
        ref={inputRef}
        type="file"
        accept="image/png,image/jpeg,image/webp"
        className="hidden"
        disabled={disabled || uploading}
        onChange={(e) => {
          const file = e.target.files?.[0]
          if (file) void handleFile(file)
        }}
      />
      <Button
        type="button"
        variant="outline"
        size="sm"
        disabled={disabled || uploading}
        className="border-primary/30 bg-background transition-colors hover:border-primary hover:bg-primary/10 hover:text-primary"
        onClick={() => inputRef.current?.click()}
      >
        {uploading
          ? 'Enviando...'
          : displayUrl
            ? 'Substituir imagem'
            : 'Selecionar imagem'}
      </Button>
      <p className="text-[11px] text-subtle">
        {deferred
          ? 'A imagem será salva junto ao cadastro (mock local / S3 no backend).'
          : 'POST /aeronaves/:id/upload → AWS S3 ou LocalStack.'}
      </p>
    </div>
  )
}
