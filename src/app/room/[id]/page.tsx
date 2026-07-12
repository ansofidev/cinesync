import { createClient } from '@/lib/supabase-server'
import { notFound } from 'next/navigation'
import { Users, Copy, Film } from 'lucide-react'
import MovieCard from '@/components/MovieCard'

export default async function RoomPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = await params;
  const roomId = resolvedParams.id;

  const supabase = await createClient()

  const { data: room, error: roomError } = await supabase
    .from('rooms')
    .select('*')
    .eq('id', roomId)
    .single()

  if (roomError || !room) {
    return notFound()
  }

  const { data: movies, error: moviesError } = await supabase
    .from('movies')
    .select('*')
    .eq('room_id', roomId)
    .order('created_at', { ascending: false })

  if (moviesError) {
    console.error("Error fetching room movies:", moviesError.message)
  }

  const roomMovies = movies || []

  return (
    <div className="max-w-6xl mx-auto px-4 py-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-zinc-800 pb-6 mb-8">
        <div>
          <h1 className="text-3xl sm:text-4xl font-black uppercase tracking-tighter text-transparent bg-clip-text bg-linear-to-r from-pink-500 to-violet-500">
            {room.name}
          </h1>
          <div className="flex items-center gap-3 text-zinc-500 text-sm mt-2">
            <span className="capitalize bg-zinc-900 px-2 py-1 rounded-md border border-zinc-800">
              {room.type}
            </span>
            <span className="flex items-center gap-1">
              <Users className="w-4 h-4" />
              Members
            </span>
          </div>
        </div>

        <button className="flex items-center justify-center gap-2 bg-zinc-800 hover:bg-zinc-700 text-white px-4 py-2.5 rounded-xl text-sm font-bold transition-all cursor-pointer w-full sm:w-auto">
          <Copy className="w-4 h-4" />
          Invite Friends
        </button>
      </div>

      {roomMovies.length === 0 ? (
        <div className="flex flex-col items-center justify-center text-center min-h-[40vh] border border-dashed border-zinc-800 rounded-2xl p-8 bg-zinc-900/10 group">
          <div className="relative mb-6 mt-4">
            <div className="absolute inset-0 bg-pink-500/20 blur-xl rounded-full animate-pulse"></div>
            <div className="relative w-20 h-20 rounded-full bg-zinc-900 border border-zinc-800 flex items-center justify-center text-zinc-500 group-hover:text-pink-500 transition-colors shadow-xl">
              <Film className="w-10 h-10 animate-bounce [animation-duration:3s]" />
            </div>
          </div>
          <h2 className="text-xl font-bold mb-2 text-white">This room is empty</h2>
          <p className="text-zinc-500 max-w-sm mb-6 text-sm">
            Start adding {room.type} to this sync room so everyone can track them together!
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
          {roomMovies.map((movie) => (
            <MovieCard key={movie.id} movie={movie} />
          ))}
        </div>
      )}
    </div>
  )
}