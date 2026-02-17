'use client'

import { useAuth } from '@/lib/auth-context'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import { BookmarkForm } from '@/components/BookmarkForm'
import { BookmarkList } from '@/components/BookmarkList'

export default function Dashboard() {
  const { user, loading, signOut } = useAuth()
  const router = useRouter()
  const [refreshTrigger, setRefreshTrigger] = useState(0)
  const [signingOut, setSigningOut] = useState(false)

  useEffect(() => {
    if (!loading && !user) {
      router.push('/')
    }
  }, [user, loading, router])

  const handleSignOut = async () => {
    setSigningOut(true)
    try {
      await signOut()
      router.push('/')
    } catch (error) {
      console.error('Sign out error:', error)
      setSigningOut(false)
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p>Loading...</p>
      </div>
    )
  }

  if (!user) {
    return null
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 py-8 px-4">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-4xl font-bold text-gray-900">Smart Bookmarks</h1>
            <p className="text-gray-600 mt-1">{user.email}</p>
          </div>
          <button
            onClick={handleSignOut}
            disabled={signingOut}
            className="bg-red-600 hover:bg-red-700 disabled:bg-gray-400 text-white px-4 py-2 rounded-lg transition"
          >
            {signingOut ? 'Signing out...' : 'Sign Out'}
          </button>
        </div>

        {/* Add Bookmark Form */}
        <div className="mb-8">
          <BookmarkForm onBookmarkAdded={() => setRefreshTrigger((prev) => prev + 1)} />
        </div>

        {/* Bookmarks List */}
        <div>
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Your Bookmarks</h2>
          <BookmarkList refreshTrigger={refreshTrigger} />
        </div>
      </div>
    </div>
  )
}
