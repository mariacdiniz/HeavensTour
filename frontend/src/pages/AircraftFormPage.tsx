import { useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { ArrowLeft } from 'lucide-react'
import { AircraftForm } from '@/components/aircraft/AircraftForm'
import { AircraftImageUpload } from '@/components/aircraft/AircraftImageUpload'
import { useAircraft, useAircraftMutations } from '@/hooks/useAircrafts'
import { useToast } from '@/contexts/ToastContext'
import type { AircraftFormValues } from '@/validations/aircraft.schema'
import { Card } from '@/components/ui/card'
import { Spinner } from '@/components/ui/spinner'
import { Button } from '@/components/ui/button'

export function AircraftFormPage() {
  const { id } = useParams()
  const isEdit = Boolean(id)
  const navigate = useNavigate()
  const { toast } = useToast()
  const { data: aircraft, isLoading } = useAircraft(id)
  const { create, update, uploadImage } = useAircraftMutations()
  const [pendingImage, setPendingImage] = useState<File | null>(null)

  const onSubmit = async (values: AircraftFormValues) => {
    try {
      if (isEdit && id) {
        await update.mutateAsync({ id, input: values })
        if (pendingImage) {
          await uploadImage.mutateAsync({ id, file: pendingImage })
        }
        toast({ title: 'Aeronave atualizada', variant: 'success' })
      } else {
        const created = await create.mutateAsync(values)
        if (pendingImage && created.id) {
          await uploadImage.mutateAsync({ id: created.id, file: pendingImage })
        }
        toast({ title: 'Aeronave cadastrada', variant: 'success' })
      }
      navigate('/app/aeronaves')
    } catch (e) {
      toast({
        title: 'Erro ao salvar',
        description: e instanceof Error ? e.message : 'Verifique os dados informados.',
        variant: 'error',
      })
    }
  }

  const showForm = !isEdit || (aircraft && !isLoading)

  return (
    <div className="mx-auto max-w-3xl space-y-6 p-8">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" asChild>
          <Link to="/app/aeronaves">
            <ArrowLeft className="size-4" />
          </Link>
        </Button>
        <div>
          <h2 className="text-lg font-medium">
            {isEdit ? 'Editar aeronave' : 'Nova aeronave'}
          </h2>
          <p className="text-sm text-muted-foreground">
            Preencha os dados operacionais e envie a foto da aeronave
          </p>
        </div>
      </div>

      <Card className="p-6">
        <h3 className="mb-4 font-medium">Foto da aeronave</h3>
        <AircraftImageUpload
          currentUrl={aircraft?.imagemUrl}
          disabled={create.isPending || update.isPending || uploadImage.isPending}
          onFileSelect={setPendingImage}
        />
      </Card>

      <Card className="p-6">
        <h3 className="mb-4 font-medium">Dados operacionais</h3>
        {isEdit && isLoading ? (
          <div className="flex justify-center py-12">
            <Spinner className="size-8" />
          </div>
        ) : isEdit && !aircraft ? (
          <p className="text-destructive">Aeronave não encontrada.</p>
        ) : showForm ? (
          <AircraftForm
            defaultValues={aircraft ?? undefined}
            onSubmit={onSubmit}
              isSubmitting={
                create.isPending || update.isPending || uploadImage.isPending
              }
            submitLabel={isEdit ? 'Salvar alterações' : 'Cadastrar aeronave'}
          />
        ) : null}
      </Card>
    </div>
  )
}
