'use client'

import { Trash2 } from 'lucide-react'
import { deleteMovie, updateMovieStatus } from '@/app/actions'
import { useState, useTransition } from 'react'

interface Movie {
  id: number
  title: string
  poster_url: string | null
  year: number | null
  status: 'planned' | 'watched'
}

export default function MovieCard({ movie }: { movie: Movie }) {
  const [, startTransition] = useTransition()
  const [status, setStatus] = useState(movie.status || 'planned')
  const [isDeleted, setIsDeleted] = useState(false)

  const handleDelete = async () => {
    setIsDeleted(true)
    await deleteMovie(movie.id)
  }

  const toggleStatus = async () => {
    const newStatus = status === 'planned' ? 'watched' : 'planned'
    setStatus(newStatus)
    
    startTransition(async () => {
      await updateMovieStatus(movie.id, newStatus)
    })
  }

  if (isDeleted) return null

  return (
    <div 
      data-title={movie.title} 
      className="relative group rounded-xl overflow-hidden border border-zinc-800 bg-zinc-900 transition-all hover:border-zinc-700"
    >
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img 
        src={movie.poster_url || 'https://via.placeholder.com/500x750?text=No+Poster'} 
        alt={movie.title} 
        className={`w-full aspect-2/3 object-cover transition-all ${status === 'watched' ? 'opacity-50 grayscale' : ''}`}
      />
      
      <button 
        onClick={handleDelete}
        className="absolute top-2 right-2 p-2 bg-black/80 hover:bg-red-600 text-white rounded-full opacity-100 md:opacity-0 md:group-hover:opacity-100 transition-all cursor-pointer shadow-md"
      >
        <Trash2 className="w-4 h-4" />
      </button>

      <div className="p-3">
        <h4 className="font-bold truncate text-sm text-white" title={movie.title}>
          {movie.title}
        </h4>
        <div className="flex justify-between items-center mt-1">
          <span className="text-xs text-zinc-500">{movie.year || 'Unknown'}</span>

          <button 
            onClick={toggleStatus}
            className={`px-2 py-0.5 rounded-md text-[10px] font-bold uppercase cursor-pointer transition-colors ${
              status === 'watched' 
                ? 'bg-green-500/10 text-green-400 hover:bg-green-500/20' 
                : 'bg-pink-500/10 text-pink-400 hover:bg-pink-500/20'
            }`}
          >
            {status}
          </button>
        </div>
      </div>
    </div>
  )
}