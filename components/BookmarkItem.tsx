'use client'

import { useState } from 'react'
import { supabase } from '@/lib/supabase'

interface Bookmark {
  id: string
  title: string
  url: string
  created_at: string
}

interface BookmarkItemProps {
  bookmark: Bookmark
  onDeleted: () => void
}

export function BookmarkItem({ bookmark, onDeleted }: BookmarkItemProps) {
  const [deleting, setDeleting] = useState(false)
  const [error, setError] = useState('')

  const handleDelete = async () => {
    if (!confirm('Are you sure you want to delete this bookmark?')) return

    setDeleting(true)
    setError('')

    try {
      const { error: deleteError } = await supabase
        .from('bookmarks')
        .delete()
        .eq('id', bookmark.id)

      if (deleteError) throw deleteError
      onDeleted()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete bookmark')
    } finally {
      setDeleting(false)
    }
  }

  return (
    <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200 flex justify-between items-start">
      <div className="flex-1">
        <a
          href={bookmark.url}
          target="_blank"
          rel="noopener noreferrer"
          className="text-blue-600 hover:text-blue-800 font-semibold break-all"
        >
          {bookmark.title}
        </a>
        <p className="text-gray-600 text-sm mt-1 break-all">{bookmark.url}</p>
        <p className="text-gray-400 text-xs mt-2">
          {new Date(bookmark.created_at).toLocaleString()}
        </p>
      </div>
      
      <div className="ml-4">
        <button
          onClick={handleDelete}
          disabled={deleting}
          className="bg-red-600 hover:bg-red-700 disabled:bg-gray-400 text-white px-3 py-1 rounded text-sm transition"
        >
          {deleting ? '...' : 'Delete'}
        </button>
        {error && <p className="text-red-600 text-xs mt-2">{error}</p>}
      </div>
    </div>
  )
}
