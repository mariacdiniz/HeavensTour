import { Link } from 'react-router-dom'
import {
  ArrowRight,
  BarChart3,
  Shield,
  Plane,
  Upload,
  Search,
  Compass,
  MapPin,
  Mail,
  Phone,
} from 'lucide-react'
import { AircraftIcon, AircraftDivider } from '@/components/brand/AircraftIcon'
import { ThemeToggle } from '@/components/ui/ThemeToggle'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card } from '@/components/ui/card'
import { APP_NAME } from '@/data/constants'
import { MEDIA } from '@/data/media'
import { useToast } from '@/contexts/ToastContext'

const services = [
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

const aboutFeatures = [
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

export function HomePage() {
  const { toast } = useToast()

  return (
    <div className="min-h-screen">
      <section className="relative flex min-h-[600px] items-center justify-center overflow-hidden">
        <img
          src={MEDIA.heroAirport}
          alt="Asa de aeronave em voo ao pôr do sol"
          className="absolute inset-0 size-full object-cover"
        />
        <div className="absolute inset-0 bg-black/45 dark:bg-black/55" />
        <div className="container-app relative z-10 text-center text-white">
          <h1 className="mx-auto mb-4 max-w-3xl text-4xl font-medium md:text-5xl">
            Gestão de frota aérea. Com a precisão que a aviação exige.
          </h1>
          <p className="mx-auto mb-8 max-w-2xl text-lg text-white/90">
            Centralize o cadastro, acompanhe a disponibilidade e analise sua frota em
            tempo real — de qualquer lugar, em qualquer dispositivo.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-4">
            <Button size="lg" className="h-11 rounded-lg" asChild>
              <Link to="/login">Começar agora</Link>
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="h-11 rounded-lg border-white/25 bg-white/10 text-white hover:bg-white/20"
              asChild
            >
              <Link to="/plataforma">Conhecer a plataforma</Link>
            </Button>
          </div>
          <div className="relative mx-auto mt-16 h-1 max-w-md rounded-full bg-primary">
            <div className="absolute right-0 top-1/2 -translate-y-1/2 text-primary">
              <AircraftIcon className="text-white" />
            </div>
          </div>
        </div>
      </section>

      <section className="bg-muted py-24">
        <div className="container-app">
          <h2 className="mb-16 text-center text-3xl font-medium">
            O que o {APP_NAME} oferece
          </h2>
          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            {services.map(({ icon: Icon, title, text }) => (
              <Card
                key={title}
                className="cursor-default p-8 transition-colors hover:border-primary"
              >
                <Icon className="mb-4 size-7 text-primary" />
                <h3 className="mb-2 text-lg font-medium">{title}</h3>
                <p className="text-sm leading-relaxed text-muted-foreground">{text}</p>
              </Card>
            ))}
          </div>
        </div>
      </section>

      <AircraftDivider className="container-app my-16" />

      <section className="bg-[var(--brand-navy)] py-16 dark:bg-[#0a0f1c]">
        <div className="container-app grid grid-cols-2 gap-8 md:grid-cols-4">
          {[
            { value: '2.400+', label: 'Aeronaves catalogadas' },
            { value: '99,9%', label: 'Disponibilidade da plataforma' },
            { value: '340+', label: 'Operadores cadastrados' },
            { value: '18', label: 'Fabricantes registrados' },
          ].map((s) => (
            <div key={s.label} className="text-center">
              <div className="text-3xl font-medium text-white md:text-4xl">{s.value}</div>
              <div className="mt-2 text-sm text-white/70">{s.label}</div>
            </div>
          ))}
        </div>
      </section>

      <section className="py-16 lg:py-20">
        <div className="container-app grid items-start gap-12 md:grid-cols-2">
          <div>
            <h2 className="mb-6 text-3xl font-medium">
              Uma plataforma construída para quem vive a aviação
            </h2>
            <p className="mb-4 leading-relaxed text-muted-foreground">
              O {APP_NAME} foi desenvolvido para operadores, gestores de frota e entusiastas
              da aviação que precisam de um sistema confiável, organizado e de fácil uso.
              Cada detalhe foi pensado para refletir a seriedade que o setor exige.
            </p>
            <p className="mb-4 leading-relaxed text-muted-foreground">
              Da validação de códigos ICAO ao cálculo automático de autonomia de voo, a
              plataforma fala a língua da aviação. Não é uma ferramenta genérica adaptada —
              é um sistema feito especificamente para gestão de aeronaves.
            </p>
            <p className="leading-relaxed text-muted-foreground">
              Com controle de acesso por perfil, histórico de alterações e relatórios
              consolidados por fabricante e década, o {APP_NAME} dá à sua equipe a
              visibilidade que ela precisa para tomar boas decisões.
            </p>
            <Button className="mt-8" asChild>
              <Link to="/sobre">
                Ler mais <ArrowRight className="ml-1 inline size-4" />
              </Link>
            </Button>
          </div>
          <div className="space-y-6">
            <div className="overflow-hidden rounded-xl">
              <img
                src={MEDIA.aboutHangar}
                alt="Fuselagem de aeronave clássica"
                className="h-[240px] w-full object-cover md:h-[280px]"
              />
            </div>
            <div className="grid gap-4">
              {aboutFeatures.map((f) => (
                <Card key={f.title} className="p-5">
                  <h3 className="font-medium">{f.title}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                    {f.text}
                  </p>
                </Card>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section id="contato" className="bg-muted py-24">
        <div className="container-narrow">
          <div className="mb-12 text-center">
            <h2 className="mb-3 text-3xl font-medium">Contato</h2>
            <p className="text-muted-foreground">
              Fale com nossa equipe sobre demonstrações ou integração com sua operação.
            </p>
          </div>
          <Card className="p-8">
            <form
              className="space-y-6"
              onSubmit={(e) => {
                e.preventDefault()
                toast({
                  title: 'Mensagem enviada',
                  description: 'Retornaremos em breve.',
                  variant: 'success',
                })
              }}
            >
              <div>
                <label className="mb-2 block text-sm">Nome</label>
                <Input placeholder="Seu nome" className="h-11 rounded-lg" />
              </div>
              <div>
                <label className="mb-2 block text-sm">E-mail</label>
                <Input
                  type="email"
                  placeholder="seu@email.com"
                  className="h-11 rounded-lg"
                />
              </div>
              <div>
                <label className="mb-2 block text-sm">Mensagem</label>
                <textarea
                  placeholder="Conte-nos sobre sua necessidade..."
                  className="min-h-[120px] w-full rounded-lg border border-input bg-[var(--input-background)] px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                />
              </div>
              <Button type="submit" className="h-11 w-full rounded-lg">
                Enviar mensagem
              </Button>
            </form>
          </Card>
          <div className="mt-12 flex flex-col justify-center gap-8 text-sm md:flex-row">
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
      </section>

      <footer className="bg-[#0a0f1c] py-12 text-white">
        <div className="container-app">
          <div className="grid gap-10 md:grid-cols-4">
            <div className="md:col-span-2">
              <div className="flex items-center gap-2">
                <AircraftIcon />
                <span className="font-medium">{APP_NAME}</span>
              </div>
              <p className="mt-4 max-w-sm text-sm text-white/70">
                Gestão de frota aérea com precisão, organização e visibilidade para sua
                operação.
              </p>
            </div>
            <div>
              <p className="mb-4 text-sm font-medium">Navegação</p>
              <div className="flex flex-col gap-2 text-sm text-white/70">
                <Link to="/" className="hover:text-primary">
                  Início
                </Link>
                <Link to="/plataforma" className="hover:text-primary">
                  Plataforma
                </Link>
                <Link to="/sobre" className="hover:text-primary">
                  Quem somos
                </Link>
                <Link to="/contato" className="hover:text-primary">
                  Contato
                </Link>
              </div>
            </div>
            <div>
              <p className="mb-4 text-sm font-medium">Recursos</p>
              <ul className="space-y-2 text-sm text-white/70">
                <li>Catálogo de frota</li>
                <li>Relatórios</li>
                <li>Busca avançada</li>
                <li>Gestão de imagens</li>
              </ul>
            </div>
          </div>
          <div className="mt-8 flex flex-col items-center justify-between gap-4 border-t border-white/10 pt-8 text-sm text-white/70 md:flex-row">
            <span>
              © {new Date().getFullYear()} {APP_NAME}. Todos os direitos reservados.
            </span>
            <div className="flex items-center gap-4">
              <Link to="/login" className="hover:text-primary">
                Acessar plataforma
              </Link>
              <ThemeToggle className="text-white hover:bg-white/10" />
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}
