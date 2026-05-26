import { Link } from 'react-router-dom'
import {
  Check,
  Plane,
  BarChart3,
  Shield,
  Upload,
  Search,
  Compass,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { APP_NAME } from '@/data/constants'

const modules = [
  {
    icon: Plane,
    title: 'Catálogo de aeronaves',
    text: 'Registre e organize toda a sua frota com informações técnicas completas: código ICAO, autonomia de voo, status comercial e histórico de alterações.',
  },
  {
    icon: BarChart3,
    title: 'Análises e relatórios',
    text: 'Visualize a distribuição da frota por fabricante, década de fabricação e classificação de alcance. Tome decisões com base em dados consolidados.',
  },
  {
    icon: Shield,
    title: 'Controle de acesso',
    text: 'Defina o que cada membro da equipe pode visualizar ou modificar. Operadores gerenciam o catálogo; gestores têm controle total da plataforma.',
  },
  {
    icon: Upload,
    title: 'Armazenamento de imagens',
    text: 'Associe fotografias a cada aeronave do seu catálogo. As imagens ficam armazenadas em nuvem, seguras e acessíveis a qualquer momento.',
  },
  {
    icon: Search,
    title: 'Busca inteligente',
    text: 'Encontre qualquer aeronave por nome, fabricante, ano ou período de fabricação. Filtros combinados entregam o resultado certo em segundos.',
  },
  {
    icon: Compass,
    title: 'Classificação por alcance',
    text: 'Cada aeronave é automaticamente classificada por sua autonomia de voo: Curta, Média ou Longa distância — com base em dados técnicos reais.',
  },
]

const checklist = [
  'Cadastro completo com validação de código ICAO',
  'Cálculo automático de autonomia: Curta, Média e Longa distância',
  'Relatórios por fabricante, década e disponibilidade',
  'Cada operador gerencia apenas a frota que cadastrou',
]

export function PlatformPage() {
  return (
    <div className="py-16 lg:py-24">
      <div className="container-app">
        <div className="mx-auto max-w-2xl text-center">
          <h1 className="text-3xl font-medium md:text-4xl">A plataforma {APP_NAME}</h1>
          <p className="mt-4 text-muted-foreground">
            O núcleo operacional da sua frota — cadastro, busca, relatórios e controle de
            acesso em um só lugar.
          </p>
        </div>

        <div className="mt-14 grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          {modules.map(({ icon: Icon, title, text }) => (
            <Card key={title} className="p-8">
              <Icon className="mb-4 size-7 text-primary" />
              <h2 className="text-lg font-medium">{title}</h2>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{text}</p>
            </Card>
          ))}
        </div>

        <div className="mt-14 grid gap-8 lg:grid-cols-2">
          <Card className="p-8">
            <h2 className="text-xl font-medium">Recursos principais</h2>
            <ul className="mt-6 space-y-4">
              {checklist.map((item) => (
                <li key={item} className="flex gap-3 text-sm text-muted-foreground">
                  <Check className="mt-0.5 size-4 shrink-0 text-primary" />
                  {item}
                </li>
              ))}
            </ul>
          </Card>

          <Card className="flex flex-col justify-between p-8">
            <div>
              <h2 className="text-xl font-medium">Área logada</h2>
              <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
                Painel com métricas, lista de aeronaves em tabela, formulários de cadastro
                e edição com upload de imagem.
              </p>
            </div>
            <Button className="mt-8 w-fit" asChild>
              <Link to="/login">Acessar plataforma</Link>
            </Button>
          </Card>
        </div>
      </div>
    </div>
  )
}
