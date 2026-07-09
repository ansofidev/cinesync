'use client'

import { useState } from 'react';
import { useRouter } from 'next/navigation'; 
import { searchMovies, addMovieToDB, type TMDBMovie } from '@/app/actions';

export default function SearchBox() {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<TMDBMovie[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const router = useRouter();

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
    
    const res = await addMovieToDB(movie);
    
    if (res.success) {
      setQuery('');
      setResults([]);
      router.refresh(); 
    }
    
    setIsSearching(false);
  };

  return (
    <div className="relative">
      <input
        type="text"
        value={query}
        onChange={handleSearch}
        disabled={isSearching}
        placeholder={isSearching ? "Adding..." : "Search movies..."}
        className="bg-zinc-900 text-white text-sm rounded-full px-4 py-1.5 focus:outline-none focus:ring-2 focus:ring-purple-500 w-64 border border-zinc-700 placeholder-zinc-500 disabled:opacity-50"
      />
      
      {results.length > 0 && (
        <div className="absolute top-full mt-2 w-full bg-zinc-900 rounded-lg shadow-lg border border-zinc-800 overflow-hidden z-50">
          {results.map((movie) => (
            <div 
              key={movie.id} 
              onClick={() => handleSelect(movie)}
              className="p-3 hover:bg-zinc-800 cursor-pointer text-sm flex flex-col border-b border-zinc-800/50 last:border-0"
            >
              <span className="font-medium truncate text-zinc-200">{movie.title}</span>
              <span className="text-xs text-zinc-500">
                {movie.release_date?.slice(0, 4) || 'N/A'}
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}