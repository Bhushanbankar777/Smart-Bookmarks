'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase'

export default function AuthCallback() {
  const router = useRouter()
  const [isProcessing, setIsProcessing] = useState(true)

  useEffect(() => {
    let mounted = true

    const handleAuthCallback = async () => {
      try {
        // Wait for Supabase to process the OAuth callback from the URL
        const { data: { session }, error: sessionError } = await supabase.auth.getSession()
        
        if (!mounted) return

        if (sessionError) {
          console.error('Session error:', sessionError)
          setIsProcessing(false)
          router.push('/')
          return
        }

        if (session) {
          // Session exists, redirect to dashboard
          console.log('Session found, redirecting to dashboard')
          setIsProcessing(false)
          router.push('/dashboard')
          return
        }

        // If no session yet, listen for auth state changes
        // This handles the case where OAuth callback is still being processed
        const { data: { subscription } } = supabase.auth.onAuthStateChange(
          async (event, newSession) => {
            if (!mounted) return

            console.log('Auth state changed:', event)
            if (event === 'SIGNED_IN' && newSession) {
              console.log('User signed in, redirecting to dashboard')
              setIsProcessing(false)
              router.push('/dashboard')
            }
          }
        )

        // Timeout after 10 seconds to prevent infinite waiting
        const timeoutId = setTimeout(() => {
          if (mounted) {
            console.error('Auth callback timeout')
            setIsProcessing(false)
            router.push('/')
          }
        }, 10000)

        return () => {
          clearTimeout(timeoutId)
          subscription?.unsubscribe()
        }
      } catch (error) {
        console.error('Auth callback error:', error)
        if (mounted) {
          setIsProcessing(false)
          router.push('/')
        }
      }
    }

    const cleanup = handleAuthCallback()
    
    return () => {
      mounted = false
      cleanup?.then((unsub) => unsub?.())
    }
  }, [router])

  return (
    <div className="flex items-center justify-center min-h-screen">
      <p>Redirecting...</p>
    </div>
  )
}
