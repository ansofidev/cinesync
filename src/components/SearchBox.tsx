'use client'

import { useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { searchMovies, addMovieToDB, type TMDBMovie } from '@/app/actions';

export default function SearchBox() {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<TMDBMovie[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [toastMsg, setToastMsg] = useState<string | null>(null);
  
  const router = useRouter();
  const pathname = usePathname();

  const currentRoomId = pathname.startsWith('/room/') ? pathname.split('/')[2] : undefined;

  const handleSearch = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setQuery(val);

    if (val.length > 2) {
      const movies = await searchMovies(val);
      setResults(movies.slice(0, 5));
    } else {
      setResults([]);
    }
  };

  const handleSelect = async (movie: TMDBMovie) => {
    setIsSearching(true);

    const res = await addMovieToDB(movie, currentRoomId);

    if (res?.duplicate) {
      setToastMsg(`"${movie.title}" is already in your library!`);
      setTimeout(() => setToastMsg(null), 3000);

      const movieCard = document.querySelector(`[data-title="${movie.title}"]`);
      if (movieCard) {
        movieCard.scrollIntoView({ behavior: 'smooth', block: 'center' });

        movieCard.classList.add('animate-bounce', 'ring-4', 'ring-pink-500', 'shadow-2xl', 'shadow-pink-500/50', 'z-10');

        setTimeout(() => {
          movieCard.classList.remove('animate-bounce', 'ring-4', 'ring-pink-500', 'shadow-2xl', 'shadow-pink-500/50', 'z-10');
        }, 2000);
      }

      setQuery('');
      setResults([]);
      setIsSearching(false);
      return;
    }

    if (res?.success) {
      setQuery('');
      setResults([]);
      router.refresh();
    }
    
    setIsSearching(false);
  };

  return (
    <>
      {toastMsg && (
        <div className="fixed top-4 left-1/2 -translate-x-1/2 bg-zinc-900 border border-pink-500 text-white px-6 py-3 rounded-full shadow-[0_0_20px_rgba(236,72,153,0.3)] z-[100] transition-all animate-in fade-in slide-in-from-top-4 font-medium text-sm flex items-center gap-2">
          <span>🤗</span>
          {toastMsg}
        </div>
      )}

      <div className="relative z-50">
        <input
          type="text"
          value={query}
          onChange={handleSearch}
          disabled={isSearching}
          placeholder={isSearching ? "Adding..." : "Search movies..."}
          className="bg-zinc-900 text-white text-sm rounded-full px-4 py-1.5 focus:outline-none focus:ring-2 focus:ring-pink-500 w-64 border border-zinc-700 placeholder-zinc-500 disabled:opacity-50 transition-all"
        />
        {results.length > 0 && (
          <div className="absolute top-full mt-2 w-full bg-zinc-900 rounded-lg shadow-2xl border border-zinc-800 overflow-hidden z-50">
            {results.map((movie) => (
              <div
                key={movie.id}
                onClick={() => !isSearching && handleSelect(movie)}
                className={`p-3 text-sm flex flex-col border-b border-zinc-800/50 last:border-0 transition-colors ${
                  isSearching ? 'opacity-50 cursor-not-allowed' : 'hover:bg-zinc-800 cursor-pointer'
                }`}
              >
                <span className="font-bold truncate text-white">{movie.title}</span>
                <span className="text-xs text-zinc-500 mt-0.5">
                  {movie.release_date?.slice(0, 4) || 'N/A'}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>
    </>
  );
}