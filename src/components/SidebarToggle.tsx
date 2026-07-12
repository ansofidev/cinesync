'use client'

import React from 'react'

export default function SidebarToggle() {
  return (
    <button 
      onClick={() => window.dispatchEvent(new Event('toggle-sidebar'))}
      className="p-2.5 rounded-xl bg-zinc-900 border border-zinc-800 shadow-xl transition-transform active:scale-95 flex flex-col justify-between w-10 h-10 hover:border-pink-500/50"
    >
      <span className="h-0.5 w-full rounded-full bg-pink-500" />
      <span className="h-0.5 w-full rounded-full bg-pink-500" />
      <span className="h-0.5 w-full rounded-full bg-pink-500" />
    </button>
  )
}