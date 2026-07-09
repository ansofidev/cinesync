'use server'

import { createClient } from '@/lib/supabase-server';

// Interface for TMDB movie data
export interface TMDBMovie {
  id: number;
  title: string;
  release_date: string;
  poster_path: string | null;
}

// Fetch movies from TMDB API
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

// Save a movie to Supabase
export async function addMovieToDB(movie: TMDBMovie) {
  const releaseYear = movie.release_date ? parseInt(movie.release_date.substring(0, 4)) : null;
  const posterUrl = movie.poster_path ? `https://image.tmdb.org/t/p/w500${movie.poster_path}` : null;

  try {
    const supabaseServer = await createClient();

    const { error } = await supabaseServer
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
      console.error("Error saving movie:", error.message);
      return { success: false };
    }

    return { success: true };
  } catch (err) {
  console.error("Critical actions error:", err);
  return { success: false };
}
}

// Delete a movie from Supabase by ID
export async function deleteMovie(id: number) {
  try {
    const supabaseServer = await createClient();

    const { error } = await supabaseServer
      .from('movies')
      .delete()
      .eq('id', id);

    if (error) {
      console.error("Error deleting movie:", error.message);
      return { success: false };
    }

    return { success: true };
  } catch (err) {
  console.error("Critical actions error:", err);
  return { success: false };
}
}

// Update movie status
export async function updateMovieStatus(id: number, status: string) {
  try {
    const supabaseServer = await createClient();

    const { error } = await supabaseServer
      .from('movies')
      .update({ status })
      .eq('id', id);

    if (error) {
      console.error("Error updating status:", error.message);
      return { success: false };
    }

    return { success: true };
  } catch (err) {
  console.error("Critical actions error:", err);
  return { success: false };
}
}