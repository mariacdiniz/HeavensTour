import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Link, Navigate } from 'react-router-dom'
import { Eye, EyeOff } from 'lucide-react'
import {
  registerSchema,
  type RegisterFormValues,
} from '@/validations/register.schema'
import { useAuth } from '@/contexts/AuthContext'
import { useToast } from '@/contexts/ToastContext'
import { authApi } from '@/api/auth.api'
import { AircraftIcon } from '@/components/brand/AircraftIcon'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card } from '@/components/ui/card'
import { ThemeToggle } from '@/components/ui/ThemeToggle'
import { APP_NAME } from '@/data/constants'
import { Spinner } from '@/components/ui/spinner'

export function RegisterPage() {
  const { isAuthenticated, setSession } = useAuth()
  const { toast } = useToast()
  const [showPassword, setShowPassword] = useState(false)

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<RegisterFormValues>({
    resolver: zodResolver(registerSchema),
    defaultValues: { nome: '', email: '', password: '' },
  })

  if (isAuthenticated) {
    return <Navigate to="/app/dashboard" replace />
  }

  const onSubmit = async (values: RegisterFormValues) => {
    try {
      const result = await authApi.register({
        nome: values.nome,
        email: values.email,
        password: values.password,
      })
      setSession(result.token, result.user)
      toast({ title: 'Conta criada com sucesso', variant: 'success' })
      window.location.href = '/app/dashboard'
    } catch (e: unknown) {
      const msg =
        e && typeof e === 'object' && 'response' in e
          ? (e as { response?: { data?: { message?: string } } }).response?.data
              ?.message
          : e instanceof Error
            ? e.message
            : 'Tente novamente'
      toast({
        title: 'Erro ao criar conta',
        description: msg,
        variant: 'error',
      })
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
            <h1 className="mb-2 text-xl font-medium">Criar sua conta</h1>
            <p className="text-sm text-muted-foreground">
              Cadastre-se para gerenciar a frota. O perfil (operador ou gestor) é
              definido automaticamente no login.
            </p>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
            <div>
              <label htmlFor="nome" className="mb-2 block text-sm">
                Nome completo
              </label>
              <Input
                id="nome"
                placeholder="Seu nome"
                className="h-11 rounded-lg"
                {...register('nome')}
              />
              {errors.nome && (
                <p className="mt-1 text-xs text-destructive">{errors.nome.message}</p>
              )}
            </div>

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
                  placeholder="Mínimo 6 caracteres"
                  className="h-11 rounded-lg pr-10"
                  {...register('password')}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
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
                <p className="mt-1 text-xs text-destructive">
                  {errors.password.message}
                </p>
              )}
            </div>

            <Button
              type="submit"
              className="h-11 w-full rounded-lg"
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <>
                  <Spinner />
                  Criando conta...
                </>
              ) : (
                'Criar conta'
              )}
            </Button>
          </form>

          <p className="mt-4 text-center text-sm text-muted-foreground">
            Já tem conta?{' '}
            <Link to="/login" className="text-primary hover:underline">
              Entrar
            </Link>
          </p>
        </div>
      </Card>

      <Link
        to="/"
        className="absolute bottom-1 text-sm text-muted-foreground hover:text-primary"
      >
        Voltar ao site
      </Link>
    </div>
  )
}
