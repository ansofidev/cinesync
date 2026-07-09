'use server'

import { supabase } from '@/lib/supabase';

export interface TMDBMovie {
  id: number;
  title: string;
  release_date: string;
  poster_path: string | null;
}

export async function searchMovies(query: string) {
  if (!query) return [];
  
  const apiKey = process.env.TMDB_API_KEY;
  const url = `https://api.themoviedb.org/3/search/movie?api_key=${apiKey}&query=${encodeURIComponent(query)}&language=en-US&page=1`;

  try {
    const res = await fetch(url);
    const data = await res.json();
    return data.results || [];
  } catch (error) {
    console.error("Error fetching from TMDB:", error);
    return [];
  }
}

export async function addMovieToDB(movie: TMDBMovie) {
  const releaseYear = movie.release_date ? parseInt(movie.release_date.substring(0, 4)) : null;
  const posterUrl = movie.poster_path ? `https://image.tmdb.org/t/p/w500${movie.poster_path}` : null;

  const { error } = await supabase
    .from('movies')
    .insert([
      {
        title: movie.title,
        year: releaseYear,
        poster_url: posterUrl,
        status: 'planned' 
      }
    ]);

  if (error) {
    console.error("Error saving movie:", error);
    return { success: false };
  }

  return { success: true };
}