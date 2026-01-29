import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { supabase } from '../lib/supabase'
import { useAuth } from '../hooks/useAuth'
import { Button } from '../components/ui/Button'

export default function ResetPasswordPage() {
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [showInvalidLink, setShowInvalidLink] = useState(false)

  const { session, loading: authLoading } = useAuth()
  const navigate = useNavigate()

  useEffect(() => {
    if (authLoading) return
    if (session) return
    const timer = setTimeout(() => setShowInvalidLink(true), 1200)
    return () => clearTimeout(timer)
  }, [authLoading, session])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)

    if (password !== confirmPassword) {
      setError('As senhas não coincidem. Digite a mesma senha nos dois campos.')
      return
    }

    if (password.length < 6) {
      setError('A senha deve ter no mínimo 6 caracteres.')
      return
    }

    setLoading(true)
    try {
      const { error: updateError } = await supabase.auth.updateUser({ password })
      if (updateError) throw updateError
      await supabase.auth.signOut()
      navigate('/login?reset=success', { replace: true })
    } catch (err: any) {
      setError(err.message || 'Não foi possível redefinir a senha. Tente novamente.')
    } finally {
      setLoading(false)
    }
  }

  if (authLoading || (session === null && !showInvalidLink)) {
    return (
      <div className="min-h-screen bg-neutral-100 flex items-center justify-center px-4 py-12">
        <div className="max-w-md w-full bg-white rounded-[18px] shadow-xl overflow-hidden border border-[var(--color-border-card)] p-12 flex justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600" />
        </div>
      </div>
    )
  }

  if (!session && showInvalidLink) {
    return (
      <div className="min-h-screen bg-neutral-100 flex items-center justify-center px-4 py-12">
        <div className="max-w-md w-full bg-white rounded-[18px] shadow-xl overflow-hidden border border-[var(--color-border-card)]">
          <div
            className="px-16 pb-8 pt-12 h-fit"
            style={{ paddingTop: 'var(--space-32)' }}
          >
            <h2 className="text-2xl font-bold text-center text-neutral-900 mb-2">
              Link inválido ou expirado
            </h2>
            <p className="text-center text-neutral-500 mb-8">
              O link de redefinição de senha expirou ou já foi utilizado. Solicite um novo link na tela de login.
            </p>
            <Button
              type="button"
              fullWidth
              className="w-full rounded-xl"
              onClick={() => navigate('/login', { replace: true })}
            >
              Voltar ao login
            </Button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-neutral-100 flex items-center justify-center px-4 py-12">
      <div className="max-w-md w-full bg-white rounded-[18px] shadow-xl overflow-hidden border border-[var(--color-border-card)]">
        <div
          className="px-16 pb-8 h-fit"
          style={{ paddingTop: 'var(--space-32)' }}
        >
          <h2 className="text-2xl font-bold text-center text-neutral-900 mb-2">
            Nova senha
          </h2>
          <p className="text-center text-neutral-500 mb-8">
            Digite e confirme sua nova senha abaixo.
          </p>

          <form
            onSubmit={handleSubmit}
            className="flex flex-col gap-16 mt-0 h-fit pt-4 pb-0"
          >
            <div className="pt-2 pb-2 h-fit">
              <label className="block text-sm font-medium text-neutral-700 mb-1">
                Nova senha
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-16 py-8 rounded-xl border border-neutral-200 focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 transition-all min-h-[48px]"
                placeholder="••••••••"
                required
                minLength={6}
                autoComplete="new-password"
              />
            </div>

            <div className="pt-2 pb-2 h-fit">
              <label className="block text-sm font-medium text-neutral-700 mb-1">
                Confirmar nova senha
              </label>
              <input
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="w-full px-16 py-8 rounded-xl border border-neutral-200 focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 transition-all min-h-[48px]"
                placeholder="••••••••"
                required
                minLength={6}
                autoComplete="new-password"
              />
            </div>

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
                disabled={loading}
              >
                {loading ? 'Redefinindo...' : 'Redefinir senha'}
              </Button>
            </div>

            <button
              type="button"
              onClick={() => navigate('/login', { replace: true })}
              className="text-sm text-primary-600 font-medium hover:text-primary-700 transition-colors text-center"
            >
              Voltar ao login
            </button>
          </form>
        </div>
      </div>
    </div>
  )
}
