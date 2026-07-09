import Image from 'next/image';
import { supabase } from '@/lib/supabase';

export interface Movie {
  id: string;
  title: string;
  poster_url: string;
  year: number;
  status: string;
}

export default async function Home() {
  const { data: movies, error } = await supabase
    .from('movies')
    .select('*');

  if (error) {
    console.error('Error fetching movies:', JSON.stringify(error, null, 2));
    console.log('Current Supabase URL:', process.env.NEXT_PUBLIC_SUPABASE_URL);
  }

  return (
    <div className="max-w-6xl mx-auto p-8">
      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-6">
        {movies?.map((movie: Movie) => (
          <div 
            key={movie.id} 
            className="bg-zinc-900 rounded-xl overflow-hidden border border-zinc-800 transition-transform hover:scale-105"
          >
            <Image 
              src={movie.poster_url} 
              alt={movie.title} 
              width={500}
              height={750}
              className="w-full h-auto aspect-2/3 object-cover"
            />
            
            <div className="p-4">
              <h2 className="font-semibold text-lg leading-tight mb-1 truncate">
                {movie.title}
              </h2>
              <div className="flex items-center justify-between text-zinc-400 text-sm">
                <span>{movie.year}</span>
                <span className="px-2 py-1 bg-zinc-800 rounded-md text-xs">
                  {movie.status === 'planned' ? 'Planned' : 'Watched'}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
