import { useState, useEffect } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth'
import { isSupabaseConfigured } from '../lib/supabase'
import { Button } from '../components/ui/Button'

export default function AuthPage() {
  const [searchParams] = useSearchParams()
  const [isLogin, setIsLogin] = useState(true)
  const [isForgotPassword, setIsForgotPassword] = useState(false)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [name, setName] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [forgotSuccess, setForgotSuccess] = useState(false)

  const isConfigured = isSupabaseConfigured()
  const { signIn, signUp, resetPassword } = useAuth()
  const navigate = useNavigate()

  const resetSuccess = searchParams.get('reset') === 'success'

  useEffect(() => {
    if (resetSuccess) {
      setError(null)
    }
  }, [resetSuccess])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    if (!isConfigured) return

    if (isForgotPassword) {
      setLoading(true)
      try {
        await resetPassword(email)
        setForgotSuccess(true)
      } catch (err: any) {
        setError(err.message || 'Não foi possível enviar o link. Tente novamente.')
      } finally {
        setLoading(false)
      }
      return
    }

    if (!isLogin && password !== confirmPassword) {
      setError('As senhas não coincidem. Digite a mesma senha nos dois campos.')
      return
    }

    setLoading(true)
    try {
      if (isLogin) {
        await signIn(email, password)
      } else {
        await signUp(email, password, name)
      }
      navigate('/')
    } catch (err: any) {
      const msg = err?.message ?? ''
      const friendlyMessage =
        msg.toLowerCase().includes('invalid login credentials')
          ? 'e-mail ou login inválidos'
          : msg || 'Ocorreu um erro durante a autenticação'
      setError(friendlyMessage)
    } finally {
      setLoading(false)
    }
  }

  const handleBackToLogin = () => {
    setIsForgotPassword(false)
    setForgotSuccess(false)
    setError(null)
  }

  return (
    <div className="min-h-screen bg-neutral-100 flex items-center justify-center px-4 py-12">
      <div className="max-w-md w-full bg-white rounded-[18px] shadow-xl overflow-hidden border border-[var(--color-border-card)]">
        {/* Content: padding-top 32px (token); spacing entre blocos via flex + gap */}
        <div
          className="px-16 pb-8 h-fit"
          style={{ paddingTop: 'var(--space-32)' }}
        >
          <div className="flex justify-center mb-8">
            <svg
              width="112"
              height="30"
              viewBox="0 0 275 73"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              className="block"
              aria-label="MoWi"
            >
              <path
                d="M257.284 12.6493L260.369 0H274.04L270.96 12.6493H257.284ZM242.986 71.3226L255.501 19.6551H269.172L256.657 71.3226H242.986Z"
                fill="#0023AF"
              />
              <path
                d="M170.176 71.3226L153.148 0H167.89L178.642 48.9917L191.68 0H208.805L221.309 49.8188L232.255 0H246.753L229.433 71.3226H214.157L199.951 18.0009L185.793 71.3226H170.176Z"
                fill="#0023AF"
              />
              <path
                d="M97.6738 44.7591C97.6738 40.2183 98.7928 35.8235 101.031 31.5746C103.269 27.3257 106.431 24.0823 110.518 21.8444C114.637 19.6064 119.226 18.4874 124.286 18.4874C132.103 18.4874 138.508 21.0335 143.503 26.1257C148.498 31.1854 150.996 37.5911 150.996 45.3429C150.996 53.1595 148.466 59.6463 143.406 64.8033C138.379 69.9279 132.038 72.4902 124.383 72.4902C119.648 72.4902 115.123 71.4199 110.81 69.2792C106.528 67.1386 103.269 64.0087 101.031 59.8896C98.7928 55.738 97.6738 50.6945 97.6738 44.7591ZM111.685 45.4888C111.685 50.6134 112.902 54.5379 115.334 57.2624C117.767 59.9869 120.767 61.3491 124.335 61.3491C127.902 61.3491 130.886 59.9869 133.286 57.2624C135.719 54.5379 136.935 50.581 136.935 45.3915C136.935 40.3318 135.719 36.4397 133.286 33.7152C130.886 30.9908 127.902 29.6285 124.335 29.6285C120.767 29.6285 117.767 30.9908 115.334 33.7152C112.902 36.4397 111.685 40.3642 111.685 45.4888Z"
                fill="#0023AF"
              />
              <path
                d="M76.5776 0.00222629L93.6055 71.3248L78.8642 71.3248L68.1123 22.3331L55.0737 71.3248L37.9485 71.3248L25.4452 21.506L14.4987 71.3248L0.00062561 71.3248L17.3204 0.00222111L32.5969 0.00222245L46.8031 53.3239L60.9605 0.00222493L76.5776 0.00222629Z"
                fill="#0023AF"
              />
            </svg>
          </div>
          
          {resetSuccess && (
            <div className="mb-6 p-4 rounded-xl bg-green-50 text-green-800 text-sm text-center">
              Senha redefinida com sucesso. Entre com sua nova senha abaixo.
            </div>
          )}

          <h2 className="text-2xl font-bold text-center text-neutral-900 mb-2">
            {isForgotPassword
              ? 'Esqueceu a senha?'
              : isLogin
                ? 'Bem-vindo de volta'
                : 'Crie sua conta'}
          </h2>
          <p className="text-center text-neutral-500 mb-8">
            {isForgotPassword
              ? 'Informe seu e-mail e enviaremos um link para redefinir sua senha.'
              : isLogin
                ? 'Acesse sua conta para gerenciar suas finanças'
                : 'Comece a organizar sua vida financeira hoje'}
          </p>

          {!isConfigured ? (
            <div className="flex flex-col gap-16 pt-4 pb-0">
              <div
                className="p-4 rounded-xl text-sm text-center"
                style={{
                  backgroundColor: 'var(--color-background-secondary)',
                  color: 'var(--color-text-primary)',
                }}
              >
                O serviço está temporariamente indisponível. Tente novamente em alguns minutos.
              </div>
              <p className="text-center text-sm" style={{ color: 'var(--color-text-secondary)' }}>
                Se o problema continuar, entre em contato com o suporte.
              </p>
            </div>
          ) : forgotSuccess ? (
            <div className="flex flex-col gap-16 pt-4 pb-0">
              <div className="p-4 rounded-xl bg-green-50 text-green-800 text-sm text-center">
                Se existir uma conta com esse e-mail, você receberá um link para redefinir sua senha. Verifique sua caixa de entrada e o spam.
              </div>
              <button
                type="button"
                onClick={handleBackToLogin}
                className="text-sm text-primary-600 font-medium hover:text-primary-700 transition-colors text-center"
              >
                Voltar ao login
              </button>
            </div>
          ) : (
            <form
              onSubmit={handleSubmit}
              className="flex flex-col gap-16 mt-0 h-fit pt-4 pb-0"
            >
              {!isLogin && !isForgotPassword && (
                <div className="pt-4 pb-2">
                  <label className="block text-sm font-medium text-neutral-700 mb-1">
                    Nome Completo
                  </label>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full px-16 py-8 rounded-xl border border-neutral-200 focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 transition-all min-h-[48px]"
                    placeholder="Seu nome"
                    required={!isLogin}
                  />
                </div>
              )}

              <div className={!isLogin && !isForgotPassword ? 'pt-4 pb-2' : 'pt-4 pb-2'}>
                <label className="block text-sm font-medium text-neutral-700 mb-1">
                  E-mail
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-16 py-8 rounded-xl border border-neutral-200 focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 transition-all min-h-[48px]"
                  placeholder="seu@email.com"
                  required
                />
              </div>

              {!isForgotPassword && (
                <>
                  <div className="pt-2 pb-2 h-fit">
                    <label className="block text-sm font-medium text-neutral-700 mb-1">
                      Senha
                    </label>
                    <input
                      type="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="w-full px-16 py-8 rounded-xl border border-neutral-200 focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 transition-all min-h-[48px]"
                      placeholder="••••••••"
                      required={!isForgotPassword}
                    />
                  </div>

                  {isLogin && (
                    <div className="flex justify-start items-start -mt-2">
                      <button
                        type="button"
                        onClick={() => {
                          setIsForgotPassword(true)
                          setError(null)
                        }}
                        className="text-sm text-primary-600 font-medium hover:text-primary-700 transition-colors"
                      >
                        Esqueci a senha
                      </button>
                    </div>
                  )}

                  {!isLogin && (
                    <div className="pt-2 pb-2 h-fit">
                      <label className="block text-sm font-medium text-neutral-700 mb-1">
                        Confirmar senha
                      </label>
                      <input
                        type="password"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        className="w-full px-16 py-8 rounded-xl border border-neutral-200 focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 transition-all min-h-[48px]"
                        placeholder="••••••••"
                        required={!isLogin}
                        autoComplete="new-password"
                      />
                    </div>
                  )}
                </>
              )}

              {error && (
                <div className="p-3 rounded-lg bg-red-50 text-red-600 text-sm">
                  {error}
                </div>
              )}

              <div className="w-full">
                <Button
                  type="submit"
                  fullWidth
                  className="w-full rounded-xl"
                  disabled={loading || !isConfigured}
                >
                  {loading
                    ? 'Processando...'
                    : isForgotPassword
                      ? 'Enviar link'
                      : isLogin
                        ? 'Entrar'
                        : 'Cadastrar'}
                </Button>
              </div>

              {isForgotPassword && (
                <button
                  type="button"
                  onClick={handleBackToLogin}
                  className="text-sm text-primary-600 font-medium hover:text-primary-700 transition-colors text-center"
                >
                  Voltar ao login
                </button>
              )}
            </form>
          )}
        </div>

        <div className="px-8 pt-8 pb-16 bg-[var(--color-background-card)] flex justify-center">
          {!forgotSuccess && isConfigured && (
            <button
              type="button"
              onClick={() => {
                setIsLogin(!isLogin)
                setIsForgotPassword(false)
                setError(null)
                if (isLogin) setConfirmPassword('')
              }}
              className="text-sm text-primary-600 font-medium hover:text-primary-700 transition-colors"
            >
              {isLogin 
                ? 'Não tem uma conta? Cadastre-se' 
                : 'Já tem uma conta? Entre agora'}
            </button>
          )}
        </div>
      </div>
    </div>
  )
}
