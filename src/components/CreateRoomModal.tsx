'use client'

import { useState } from 'react'
import { createRoom } from '@/app/actions/rooms'
import { X } from 'lucide-react'

export default function CreateRoomModal({ 
  type, 
  onClose 
}: { 
  type: 'movies' | 'books'
  onClose: () => void 
}) {
  const [roomName, setRoomName] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!roomName.trim()) return

    setIsLoading(true)
    setError(null)

    try {
      await createRoom(roomName.trim(), type)
      onClose()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong')
    } finally {
      setIsLoading(false)
    }
  }

return (
  <div className="fixed inset-0 bg-black/80 backdrop-blur-xs z-50 flex items-center justify-center p-4">
    <div className="bg-zinc-900 border border-zinc-800 rounded-2xl w-full max-w-sm p-6 relative shadow-2xl">
      <button
        onClick={onClose}
        className="absolute top-4 right-4 text-zinc-500 hover:text-white transition-colors cursor-pointer"
      >
        <X className="w-5 h-5" />
      </button>

      <h3 className="text-xl font-bold mb-4 text-white">
        Create New {type === "movies" ? "Movie" : "Book"} Room
      </h3>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-xs font-medium text-zinc-400 mb-1">
            Room Name
          </label>
          <input
            type="text"
            required
            value={roomName}
            onChange={(e) => setRoomName(e.target.value)}
            placeholder={
              type === "movies"
                ? "e.g., Marvel Marathon"
                : "e.g., Book Club 2026"
            }
            className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-4 py-2.5 text-white focus:outline-none focus:ring-2 focus:ring-pink-500 text-sm"
          />
        </div>

        {error && <p className="text-sm text-pink-500 text-center">{error}</p>}

        <button
          type="submit"
          disabled={isLoading || !roomName.trim()}
          className="w-full py-2.5 bg-pink-600 hover:bg-pink-500 text-white font-bold rounded-xl transition-all disabled:opacity-50 cursor-pointer text-sm"
        >
          {isLoading ? "Creating..." : "Create Room"}
        </button>
      </form>
    </div>
  </div>
);
}