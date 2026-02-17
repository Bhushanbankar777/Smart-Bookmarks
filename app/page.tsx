'use client'

import { useAuth } from '@/lib/auth-context'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'

export default function Home() {
  const { user, loading, signInWithGoogle } = useAuth()
  const router = useRouter()
  const [signingIn, setSigningIn] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    if (user && !loading) {
      router.push('/dashboard')
    }
  }, [user, loading, router])

  const handleGoogleSignIn = async () => {
    setSigningIn(true)
    setError('')
    try {
      await signInWithGoogle()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to sign in')
      setSigningIn(false)
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p>Loading...</p>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-600 to-indigo-700 flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        <div className="bg-white rounded-lg shadow-xl p-8">
          {/* Logo/Title */}
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold text-gray-900 mb-2">Smart Bookmarks</h1>
            <p className="text-gray-600">Save and organize your bookmarks. Sync across devices.</p>
          </div>

          {/* Sign In Section */}
          <div className="space-y-4">
            <div>
              <p className="text-sm text-gray-600 mb-4">
                Sign in with your Google account to get started
              </p>
            </div>

            {error && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-3 text-red-700 text-sm">
                {error}
              </div>
            )}

            <button
              onClick={handleGoogleSignIn}
              disabled={signingIn}
              className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white font-semibold py-3 rounded-lg transition flex items-center justify-center gap-2"
            >
              {signingIn ? (
                <>
                  <span className="inline-block animate-spin">⏳</span>
                  Signing in...
                </>
              ) : (
                <>
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                    <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                    <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                    <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
                  </svg>
                  Sign in with Google
                </>
              )}
            </button>
          </div>

          {/* Info Section */}
          <div className="mt-8 pt-8 border-t border-gray-200">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Features</h2>
            <ul className="space-y-3 text-sm text-gray-600">
              <li className="flex items-start gap-3">
                <span className="text-blue-600 font-bold mt-0.5">✓</span>
                <span>Save and organize bookmarks with custom titles</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-blue-600 font-bold mt-0.5">✓</span>
                <span>Real-time sync across all your devices</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-blue-600 font-bold mt-0.5">✓</span>
                <span>Private to your account - only you can see your bookmarks</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-blue-600 font-bold mt-0.5">✓</span>
                <span>Quick delete and manage your collection</span>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  )
}
