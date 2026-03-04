'use client'

import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import Link from 'next/link'
import { useRouter } from 'next/navigation'

export default function SignupPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [fullName, setFullName] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  const router = useRouter()
  const supabase = createClient()

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          full_name: fullName,
        },
      },
    })

    if (error) {
      setError(error.message)
      setLoading(false)
    } else {
      setSuccess(true)
      setLoading(false)
      // Auto-login after signup (Supabase may require email confirmation)
      const { error: loginError } = await supabase.auth.signInWithPassword({
        email,
        password,
      })
      if (!loginError) {
        router.push('/dashboard')
        router.refresh()
      }
    }
  }

  return (
    <div className="min-h-screen bg-[var(--navy)] flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <Link href="/" className="inline-flex items-center gap-2 text-white mb-6">
            <div className="w-10 h-10 bg-[var(--blue)] rounded-lg flex items-center justify-center font-bold text-lg">S</div>
            <span className="text-xl font-bold">ScopeShield</span>
          </Link>
          <h1 className="text-2xl font-bold text-white mt-4">Create your account</h1>
          <p className="text-gray-400 mt-2">Start protecting your freelance work</p>
        </div>

        {success ? (
          <div className="bg-white rounded-xl p-8 shadow-lg text-center">
            <div className="text-4xl mb-4">✅</div>
            <h2 className="text-xl font-bold text-gray-900 mb-2">Account created!</h2>
            <p className="text-gray-600 mb-4">Check your email to confirm your account, or you may be redirected automatically.</p>
            <Link href="/auth/login" className="text-[var(--blue)] hover:underline font-medium">
              Go to login →
            </Link>
          </div>
        ) : (
          <form onSubmit={handleSignup} className="bg-white rounded-xl p-8 shadow-lg">
            {error && (
              <div className="bg-red-50 text-red-600 px-4 py-3 rounded-lg mb-4 text-sm">
                {error}
              </div>
            )}
            
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
              <input
                type="text"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[var(--blue)] focus:border-transparent outline-none"
                placeholder="Jane Doe"
                required
              />
            </div>

            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[var(--blue)] focus:border-transparent outline-none"
                placeholder="you@example.com"
                required
              />
            </div>

            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[var(--blue)] focus:border-transparent outline-none"
                placeholder="Min 6 characters"
                minLength={6}
                required
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-[var(--blue)] text-white py-2.5 rounded-lg font-medium hover:bg-[var(--blue-dark)] transition-colors disabled:opacity-50"
            >
              {loading ? 'Creating account...' : 'Create Free Account'}
            </button>

            <p className="text-center text-sm text-gray-500 mt-4">
              Already have an account?{' '}
              <Link href="/auth/login" className="text-[var(--blue)] hover:underline font-medium">
                Sign in
              </Link>
            </p>
          </form>
        )}
      </div>
    </div>
  )
}
