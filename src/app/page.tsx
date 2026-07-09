import { createClient } from '@/lib/supabase-server';
import Image from 'next/image';
import DeleteButton from '@/components/DeleteButton';
import StatusToggle from '@/components/StatusToggle';

export default async function Home() {
  const supabaseServer = await createClient();

  const { data: { user } } = await supabaseServer.auth.getUser();
  const isAuthenticated = !!user;

  const { data: movies, error } = await supabaseServer
    .from('movies')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Error fetching movies:', JSON.stringify(error, null, 2));
  }

  return (
    <div className="min-h-screen bg-[#0a0a0a]">
      <main className="max-w-6xl mx-auto px-8 py-12">
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-6">
          {movies?.map((movie, index) => (
            <div key={movie.id} className="relative bg-zinc-900 rounded-xl overflow-hidden border border-zinc-800 transition-transform hover:scale-105 group">

              {isAuthenticated && <DeleteButton id={movie.id} />}

              {movie.poster_url ? (
                <Image
                  src={movie.poster_url}
                  alt={movie.title}
                  width={500}
                  height={750}
                  priority={index < 5}
                  className="w-full h-auto aspect-2/3 object-cover"
                />
              ) : (
                <div className="w-full aspect-2/3 bg-zinc-800 flex items-center justify-center text-zinc-500 text-sm text-center p-4">
                  No poster available
                </div>
              )}
              
              <div className="absolute bottom-0 w-full p-4 bg-linear-to-t from-black/90 to-transparent">
                <div className="flex items-center justify-between mt-2">
                  <span className="text-xs text-zinc-400">{movie.year}</span>

                  {isAuthenticated ? (
                    <StatusToggle id={movie.id} initialStatus={movie.status} />
                  ) : (
                    <span className={`text-xs font-medium px-2 py-1 rounded-full backdrop-blur-md ${
                      movie.status === 'watched' ? 'bg-green-500/20 text-green-400' : 'bg-white/10 text-white'
                    }`}>
                      {movie.status}
                    </span>
                  )}
                  
                </div>
              </div>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}