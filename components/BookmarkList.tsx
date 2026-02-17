'use client'

import { useEffect, useState } from 'react'
import { RealtimeChannel } from '@supabase/supabase-js'
import { supabase } from '@/lib/supabase'
import { useAuth } from '@/lib/auth-context'
import { BookmarkItem } from './BookmarkItem'

interface Bookmark {
  id: string
  title: string
  url: string
  created_at: string
  user_id: string
}

interface BookmarkListProps {
  refreshTrigger: number
}

export function BookmarkList({ refreshTrigger }: BookmarkListProps) {
  const { user } = useAuth()
  const [bookmarks, setBookmarks] = useState<Bookmark[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchBookmarks()
  }, [user, refreshTrigger])

  useEffect(() => {
    if (!user) return

    // Subscribe to realtime changes
    const channel: RealtimeChannel = supabase
      .channel(`bookmarks:user_id.eq.${user.id}`)
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'bookmarks',
          filter: `user_id=eq.${user.id}`,
        },
        (payload) => {
          if (payload.eventType === 'INSERT') {
            setBookmarks((prev) => [payload.new as Bookmark, ...prev])
          } else if (payload.eventType === 'DELETE') {
            setBookmarks((prev) => prev.filter((b) => b.id !== payload.old.id))
          } else if (payload.eventType === 'UPDATE') {
            setBookmarks((prev) =>
              prev.map((b) => (b.id === payload.new.id ? (payload.new as Bookmark) : b))
            )
          }
        }
      )
      .subscribe()

    return () => {
      channel.unsubscribe()
    }
  }, [user])

  const fetchBookmarks = async () => {
    if (!user) return

    setLoading(true)
    try {
      const { data, error } = await supabase
        .from('bookmarks')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })

      if (error) throw error
      setBookmarks(data || [])
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : JSON.stringify(err)
      console.error('Failed to fetch bookmarks:', errorMessage, err)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return <div className="text-center py-8 text-gray-600">Loading bookmarks...</div>
  }

  if (bookmarks.length === 0) {
    return <div className="text-center py-8 text-gray-600">No bookmarks yet. Add one to get started!</div>
  }

  return (
    <div className="space-y-3">
      {bookmarks.map((bookmark) => (
        <BookmarkItem
          key={bookmark.id}
          bookmark={bookmark}
          onDeleted={fetchBookmarks}
        />
      ))}
    </div>
  )
}
