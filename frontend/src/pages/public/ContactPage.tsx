import { useState } from 'react'
import { MapPin, Mail, Phone } from 'lucide-react'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { useToast } from '@/contexts/ToastContext'

export function ContactPage() {
  const { toast } = useToast()
  const [sending, setSending] = useState(false)

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setSending(true)
    setTimeout(() => {
      setSending(false)
      toast({
        title: 'Mensagem enviada',
        description: 'Retornaremos em breve.',
        variant: 'success',
      })
    }, 800)
  }

  return (
    <div className="bg-muted py-16 lg:py-24">
      <div className="container-narrow">
        <div className="mb-12 text-center">
          <h1 className="text-3xl font-medium">Contato</h1>
          <p className="mt-3 text-muted-foreground">
            Dúvidas sobre a plataforma, integração ou demonstração — estamos à disposição.
          </p>
        </div>

        <Card className="p-8">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="nome" className="mb-2 block text-sm">
                Nome
              </label>
              <Input
                id="nome"
                name="nome"
                required
                className="h-11 rounded-lg"
                placeholder="Seu nome"
              />
            </div>
            <div>
              <label htmlFor="email" className="mb-2 block text-sm">
                E-mail
              </label>
              <Input
                id="email"
                name="email"
                type="email"
                required
                className="h-11 rounded-lg"
                placeholder="seu@email.com"
              />
            </div>
            <div>
              <label htmlFor="mensagem" className="mb-2 block text-sm">
                Mensagem
              </label>
              <textarea
                id="mensagem"
                name="mensagem"
                rows={4}
                required
                placeholder="Conte-nos sobre sua necessidade..."
                className="min-h-[120px] w-full rounded-lg border border-input bg-[var(--input-background)] px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
              />
            </div>
            <Button type="submit" disabled={sending} className="h-11 w-full rounded-lg">
              {sending ? 'Enviando...' : 'Enviar mensagem'}
            </Button>
          </form>
        </Card>

        <div className="mt-12 flex flex-col justify-center gap-6 text-sm md:flex-row">
          <span className="flex items-center gap-2">
            <MapPin className="size-4 text-primary" />
            São Paulo, Brasil
          </span>
          <span className="flex items-center gap-2">
            <Mail className="size-4 text-primary" />
            contato@heavenstour.com
          </span>
          <span className="flex items-center gap-2">
            <Phone className="size-4 text-primary" />
            +55 (11) 4000-0000
          </span>
        </div>
      </div>
    </div>
  )
}
