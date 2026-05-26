import { Link } from 'react-router-dom'
import { CheckCircle2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { APP_NAME } from '@/data/constants'
import { MEDIA } from '@/data/media'

const features = [
  {
    title: 'Código ICAO validado',
    text: 'Cada aeronave recebe um código de 4 dígitos seguindo o padrão ICAO, com validação automática da inicial do fabricante.',
  },
  {
    title: 'Autonomia calculada automaticamente',
    text: 'Informe a capacidade de combustível e o consumo médio — a plataforma calcula a autonomia e classifica o alcance da aeronave.',
  },
  {
    title: 'Acesso por nível de perfil',
    text: 'Operadores gerenciam o catálogo. Gestores têm acesso completo, incluindo relatórios, usuários e configurações avançadas.',
  },
]

export function AboutPage() {
  return (
    <div className="py-16 lg:py-24">
      <div className="container-app grid items-start gap-16 lg:grid-cols-2">
        <div>
          <h1 className="text-3xl font-medium md:text-4xl">
            Uma plataforma construída para quem vive a aviação
          </h1>
          <p className="mt-6 leading-relaxed text-muted-foreground">
            O {APP_NAME} foi desenvolvido para operadores, gestores de frota e entusiastas
            da aviação que precisam de um sistema confiável, organizado e de fácil uso.
            Cada detalhe foi pensado para refletir a seriedade que o setor exige.
          </p>
          <p className="mt-4 leading-relaxed text-muted-foreground">
            Da validação de códigos ICAO ao cálculo automático de autonomia de voo, a
            plataforma fala a língua da aviação. Não é uma ferramenta genérica adaptada —
            é um sistema feito especificamente para gestão de aeronaves.
          </p>
          <p className="mt-4 leading-relaxed text-muted-foreground">
            Com controle de acesso por perfil, histórico de alterações e relatórios
            consolidados por fabricante e década, o {APP_NAME} dá à sua equipe a
            visibilidade que ela precisa para tomar boas decisões.
          </p>
          <Button className="mt-8" asChild>
            <Link to="/contato">Fale conosco</Link>
          </Button>
        </div>
        <Card className="overflow-hidden p-0">
          <img
            src={MEDIA.aboutHangar}
            alt="Interior de hangar com aeronave"
            className="h-[320px] w-full object-cover md:h-[360px]"
          />
        </Card>
      </div>

      <div className="container-app mt-20">
        <div className="grid gap-6 md:grid-cols-3">
          {features.map((f) => (
            <Card key={f.title} className="p-8">
              <CheckCircle2 className="mb-4 size-6 text-primary" />
              <h2 className="text-lg font-medium">{f.title}</h2>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{f.text}</p>
            </Card>
          ))}
        </div>
      </div>
    </div>
  )
}
