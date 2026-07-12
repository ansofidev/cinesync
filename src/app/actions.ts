'use server'

import { createClient } from '@/lib/supabase-server';
import { revalidatePath } from 'next/cache';

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
export async function addMovieToDB(movie: TMDBMovie, roomId?: string) {
  const releaseYear = movie.release_date ? parseInt(movie.release_date.substring(0, 4)) : null;
  const posterUrl = movie.poster_path ? `https://image.tmdb.org/t/p/w500${movie.poster_path}` : null;

  try {
    const supabaseServer = await createClient();
    const { data: { user } } = await supabaseServer.auth.getUser();
    
    if (!user) {
      console.error("User not authenticated");
      return { success: false };
    }

    let query = supabaseServer.from('movies').select('id').eq('title', movie.title);
    
    if (roomId) {
      query = query.eq('room_id', roomId);
    } else {
      query = query.eq('user_id', user.id).is('room_id', null);
    }

    const { data: existingMovie } = await query.maybeSingle();

    if (existingMovie) {
      return { success: false, duplicate: true };
    }

    const { error } = await supabaseServer
      .from('movies')
      .insert([
        {
          title: movie.title,
          year: releaseYear,
          poster_url: posterUrl,
          status: 'planned',
          user_id: user.id,
          room_id: roomId || null
        }
      ]);

    if (error) {
      console.error("Error saving movie:", error.message);
      return { success: false };
    }

    if (roomId) {
      revalidatePath(`/room/${roomId}`);
    } else {
      revalidatePath('/');
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
// Get all rooms for the current user
export async function getUserRooms() {
  try {
    const supabaseServer = await createClient();
    const { data: { user } } = await supabaseServer.auth.getUser();
    if (!user) return [];

    // Fetch rooms by joining with room_members table
    const { data, error } = await supabaseServer
      .from('rooms')
      .select('*, room_members!inner(user_id)')
      .eq('room_members.user_id', user.id)
      .order('created_at', { ascending: true });

    if (error) {
      console.error("Error fetching rooms:", error.message);
      return [];
    }

    return data || [];
  } catch {
    return [];
  }
}

// Create a new room and automatically add the creator as a member
export async function createRoom(name: string) {
  try {
    const supabaseServer = await createClient();
    const { data: { user } } = await supabaseServer.auth.getUser();
    if (!user) return { success: false, error: "Not logged in" };

    // 1. Create the room itself
    const { data: room, error: roomError } = await supabaseServer
      .from('rooms')
      .insert([{ name, created_by: user.id }])
      .select()
      .single();

    if (roomError) return { success: false, error: roomError.message };

    // 2. Add the creator to the room_members table
    const { error: memberError } = await supabaseServer
      .from('room_members')
      .insert([{ room_id: room.id, user_id: user.id }]);

    if (memberError) return { success: false, error: memberError.message };

    return { success: true, room };
  } catch {
    return { success: false, error: "Server error" };
  }
}