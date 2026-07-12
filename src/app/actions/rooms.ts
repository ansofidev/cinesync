'use server'

import { createClient } from '@/lib/supabase-server'
import { revalidatePath } from 'next/cache'

export async function getUserRooms() {
  const supabase = await createClient()
  
  const { data, error } = await supabase
    .from('rooms')
    .select(`
      id,
      name,
      type,
      invite_code,
      created_at
    `)
    .order('created_at', { ascending: false })

  if (error) {
    console.error('Error fetching rooms:', error.message)
    return []
  }
  return data
}

export async function createRoom(name: string, type: 'movies' | 'books') {
  const supabase = await createClient()
  
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error('Unauthorized')

  const { data: room, error: roomError } = await supabase
    .from('rooms')
    .insert([{ name, type, created_by: user.id }])
    .select()
    .single()

  if (roomError) throw new Error(roomError.message)

  const { error: memberError } = await supabase
    .from('room_members')
    .insert([{ room_id: room.id, user_id: user.id }])

  if (memberError) {
    await supabase.from('rooms').delete().eq('id', room.id)
    throw new Error(memberError.message)
  }

  revalidatePath('/')
  return room
}