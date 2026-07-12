import { createClient } from '@/lib/supabase-server'
import Link from 'next/link'
import { Film, Clapperboard } from 'lucide-react'
import MovieCard from '@/components/MovieCard'

export default async function HomePage(props: { searchParams: Promise<{ status?: string }> }) {
  const searchParams = await props.searchParams
  const statusFilter = searchParams?.status

  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    return (
      <div className="max-w-6xl mx-auto px-4 py-12 flex flex-col items-center justify-center min-h-[70vh] text-center">
        <div className="w-20 h-20 bg-linear-to-tr from-pink-500 to-violet-500 rounded-3xl flex items-center justify-center mb-8 shadow-2xl shadow-pink-500/20 rotate-12">
          <Clapperboard className="w-10 h-10 text-white -rotate-12" />
        </div>
        <h1 className="text-4xl md:text-6xl font-black uppercase tracking-tighter mb-6">
          Track your media <br/>
          <span className="text-transparent bg-clip-text bg-linear-to-r from-pink-500 to-violet-500">with friends</span>
        </h1>
        <p className="text-zinc-400 text-lg md:text-xl max-w-2xl mb-10">
          CineSync is your premium hub for movies and books. Create private sync rooms, track what you&apos;ve watched, and share your library.
        </p>
        <Link href="/login" className="px-8 py-4 bg-pink-600 hover:bg-pink-500 text-white font-bold rounded-xl transition-all hover:scale-105 shadow-lg shadow-pink-600/20">
          Get Started
        </Link>
      </div>
    )
  }

  let query = supabase.from('movies').select('*').eq('user_id', user.id).is('room_id', null)
  
  if (statusFilter === 'planned' || statusFilter === 'watched') {
    query = query.eq('status', statusFilter)
  }
  
  const { data: movies, error } = await query.order('created_at', { ascending: false })

  if (error) {
    return <div className="text-pink-500 text-center mt-10">Error loading movies...</div>
  }

  return (
    <div className="max-w-6xl mx-auto px-4 py-6">

      <div className="flex items-center gap-2 mb-8 border-b border-zinc-800 pb-4">
        <Link 
          href="/" 
          className={`px-4 py-2 rounded-lg text-sm font-bold transition-all ${!statusFilter ? 'bg-zinc-800 text-white' : 'text-zinc-500 hover:bg-zinc-900'}`}
        >
          All Movies
        </Link>
        <Link 
          href="/?status=planned" 
          className={`px-4 py-2 rounded-lg text-sm font-bold transition-all ${statusFilter === 'planned' ? 'bg-pink-500/20 text-pink-400' : 'text-zinc-500 hover:bg-zinc-900'}`}
        >
          Planned
        </Link>
        <Link 
          href="/?status=watched" 
          className={`px-4 py-2 rounded-lg text-sm font-bold transition-all ${statusFilter === 'watched' ? 'bg-green-500/20 text-green-400' : 'text-zinc-500 hover:bg-zinc-900'}`}
        >
          Watched
        </Link>
      </div>

      {movies.length === 0 ? (
        <div className="flex flex-col items-center justify-center text-center min-h-[40vh] border border-dashed border-zinc-800 rounded-2xl p-8 bg-zinc-900/10 group">
          <div className="relative mb-6 mt-4">
            <div className="absolute inset-0 bg-pink-500/20 blur-xl rounded-full animate-pulse"></div>
            <div className="relative w-20 h-20 rounded-full bg-zinc-900 border border-zinc-800 flex items-center justify-center text-zinc-500 group-hover:text-pink-500 transition-colors shadow-xl">
              <Film className="w-10 h-10 animate-bounce [animation-duration:3s]" />
            </div>
          </div>
          <h2 className="text-2xl font-bold mb-2 text-white">Nothing found here</h2>
          <p className="text-zinc-500 max-w-sm mb-6 text-sm">
            {statusFilter ? `You don't have any ${statusFilter} movies yet.` : "Your media library is empty. Use the search box above to add your first movie!"}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
          {movies.map((movie) => (
            <MovieCard key={movie.id} movie={movie} />
          ))}
        </div>
      )}
    </div>
  )
}