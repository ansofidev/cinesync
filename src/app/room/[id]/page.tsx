import { createClient } from '@/lib/supabase-server'
import { notFound } from 'next/navigation'
import { Users, Copy } from 'lucide-react'

export default async function RoomPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = await params;
  const roomId = resolvedParams.id;

  const supabase = await createClient()
  
  const { data: room, error } = await supabase
    .from('rooms')
    .select('*')
    .eq('id', roomId)
    .single()

  if (error || !room) {
    return notFound()
  }

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

      <div className="flex flex-col items-center justify-center text-center min-h-[40vh] border border-dashed border-zinc-800 rounded-2xl p-8 bg-zinc-900/10">
        <h2 className="text-xl font-bold mb-2 text-white">This room is empty</h2>
        <p className="text-zinc-500 max-w-sm mb-6 text-sm">
          Start adding {room.type} to this sync room so everyone can track them together!
        </p>
      </div>
    </div>
  )
}