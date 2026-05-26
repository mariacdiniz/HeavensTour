import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Link, Navigate, useNavigate, useLocation } from 'react-router-dom'
import { Eye, EyeOff } from 'lucide-react'
import { loginSchema, type LoginFormValues } from '@/validations/auth.schema'
import { useAuth } from '@/contexts/AuthContext'
import { useToast } from '@/contexts/ToastContext'
import { AircraftIcon } from '@/components/brand/AircraftIcon'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card } from '@/components/ui/card'
import { ThemeToggle } from '@/components/ui/ThemeToggle'
import { APP_NAME } from '@/data/constants'
import { Spinner } from '@/components/ui/spinner'

export function LoginPage() {
  const { login, isAuthenticated, isLoading: authLoading } = useAuth()
  const { toast } = useToast()
  const navigate = useNavigate()
  const location = useLocation()
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const from =
    (location.state as { from?: { pathname: string } })?.from?.pathname ??
    '/app/dashboard'

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: '', password: '' },
  })

  if (isAuthenticated) {
    return <Navigate to={from} replace />
  }

  const onSubmit = async (data: LoginFormValues) => {
    setError(null)
    try {
      await login(data)
      toast({ title: 'Sessão iniciada', variant: 'success' })
      navigate(from, { replace: true })
    } catch {
      setError('E-mail ou senha incorretos.')
      toast({ title: 'Falha no login', variant: 'error' })
    }
  }

  return (
    <div className="relative flex min-h-screen items-center justify-center bg-background p-8">
      <div className="absolute right-8 top-8">
        <ThemeToggle />
      </div>

      <Card className="w-full max-w-[480px] overflow-hidden p-0">
        <div className="p-8">
          <div className="mb-6 flex items-center justify-center gap-2">
            <AircraftIcon className="text-primary" />
            <span className="text-xl font-medium">{APP_NAME}</span>
          </div>

          <div className="mb-8 h-px bg-border" />

          <div className="mb-8 text-center">
            <h1 className="mb-2 text-xl font-medium">Entrar na sua conta</h1>
            <p className="text-sm text-muted-foreground">
              Use suas credenciais para acessar o painel
            </p>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <div>
              <label htmlFor="email" className="mb-2 block text-sm">
                E-mail
              </label>
              <Input
                id="email"
                type="email"
                placeholder="voce@email.com"
                className="h-11 rounded-lg"
                {...register('email')}
              />
              {errors.email && (
                <p className="mt-1 text-xs text-destructive">{errors.email.message}</p>
              )}
            </div>

            <div>
              <label htmlFor="password" className="mb-2 block text-sm">
                Senha
              </label>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  placeholder="Digite sua senha"
                  className="h-11 rounded-lg pr-10"
                  {...register('password')}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground transition-colors hover:text-foreground"
                  aria-label={showPassword ? 'Ocultar senha' : 'Mostrar senha'}
                >
                  {showPassword ? (
                    <EyeOff className="size-4" />
                  ) : (
                    <Eye className="size-4" />
                  )}
                </button>
              </div>
              {errors.password && (
                <p className="mt-1 text-xs text-destructive">{errors.password.message}</p>
              )}
            </div>

            {error && (
              <p className="rounded-lg bg-destructive/10 px-3 py-2 text-sm text-destructive">
                {error}
              </p>
            )}

            <Button
              type="submit"
              className="h-11 w-full rounded-lg"
              disabled={isSubmitting || authLoading}
            >
              {(isSubmitting || authLoading) ? (
                <>
                  <Spinner />
                  Entrando...
                </>
              ) : (
                'Entrar'
              )}
            </Button>

            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-border" />
              </div>
              <div className="relative flex justify-center text-xs">
                <span className="bg-card px-2 text-muted-foreground">
                  Novo no {APP_NAME}?
                </span>
              </div>
            </div>

            <Button
              type="button"
              variant="outline"
              className="h-11 w-full rounded-lg"
              asChild
            >
              <Link to="/register">Criar conta</Link>
            </Button>
          </form>
        </div>
      </Card>

      <Link
        to="/"
        className="absolute bottom-1 text-sm text-muted-foreground transition-colors hover:text-primary"
      >
        Voltar ao site
      </Link>
    </div>
  )
}
