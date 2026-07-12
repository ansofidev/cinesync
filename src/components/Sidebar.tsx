'use client'

import { Popcorn, BookOpen, Plus, LogIn, Film } from 'lucide-react'
import { useState, useEffect } from 'react'
import Link from 'next/link'

export default function Sidebar({ isAuthenticated }: { isAuthenticated: boolean }) {
  const [isOpen, setIsOpen] = useState(false)

  useEffect(() => {
    const handleToggle = () => setIsOpen(prev => !prev)
    window.addEventListener('toggle-sidebar', handleToggle)
    return () => window.removeEventListener('toggle-sidebar', handleToggle)
  }, [])

  return (
    <>
      {isOpen && (
        <div onClick={() => setIsOpen(false)} className="fixed inset-0 bg-black/60 backdrop-blur-xs z-30 transition-opacity" />
      )}

      <aside className={`fixed top-0 right-0 h-full w-full sm:w-80 flex flex-col justify-between border-l border-zinc-800 bg-[#0a0a0a] p-6 z-40 transition-transform duration-500 ease-[cubic-bezier(0.34,1.56,0.64,1)] ${isOpen ? 'translate-x-0 shadow-2xl' : 'translate-x-full'}`}>
        
        {isAuthenticated ? (
          <>
            <div className="mt-20">
              <h1 className="text-4xl font-black mb-10 tracking-tighter text-transparent bg-clip-text bg-linear-to-r from-pink-500 to-violet-500 uppercase">
                CINESYNC
              </h1>
              
              <nav className="space-y-3 mb-8">
                <div className="md:hidden border-b border-zinc-800 pb-3 mb-3 space-y-2">
                  <Link href="/" onClick={() => setIsOpen(false)} className="flex items-center gap-4 w-full p-3 rounded-xl hover:bg-zinc-900 text-zinc-400 hover:text-white font-medium transition-all">
                    <Film className="w-5 h-5" />
                    <span>Browse Movies</span>
                  </Link>
                  <Link href="/books" onClick={() => setIsOpen(false)} className="flex items-center gap-4 w-full p-3 rounded-xl hover:bg-zinc-900 text-zinc-400 hover:text-white font-medium transition-all">
                    <BookOpen className="w-5 h-5" />
                    <span>Browse Books</span>
                  </Link>
                </div>

                <button className="flex items-center gap-4 w-full p-4 rounded-xl bg-pink-500/10 text-pink-500 font-bold transition-all border border-pink-500/20 hover:bg-pink-500/20 cursor-pointer">
                  <Popcorn className="w-6 h-6" />
                  <span className="text-lg">Movie Syncs</span>
                </button>
                
                <button className="flex items-center gap-4 w-full p-4 rounded-xl hover:bg-zinc-900 font-medium transition-all text-zinc-500 hover:text-zinc-200 cursor-pointer">
                  <BookOpen className="w-6 h-6" />
                  <span className="text-lg">Book Syncs</span>
                </button>
              </nav>

              <button className="flex items-center justify-center gap-2 w-full p-4 rounded-xl bg-pink-600 text-white font-bold hover:bg-pink-500 transition-all hover:scale-105 active:scale-95 text-lg cursor-pointer">
                <Plus className="w-6 h-6" />
                Create Sync
              </button>
            </div>

            <div className="mb-4">
              <div className="flex items-center gap-4 p-4 rounded-xl bg-zinc-900/50 border border-zinc-800 cursor-pointer hover:bg-zinc-800 transition-all group">
                <div className="w-12 h-12 rounded-full bg-linear-to-tr from-pink-500 to-violet-500 flex items-center justify-center text-white font-black text-xl shadow-lg">
                  U
                </div>
                <div className="flex-1 overflow-hidden">
                  <p className="text-base font-bold truncate text-white group-hover:text-pink-400 transition-colors">My Profile</p>
                  <p className="text-sm text-zinc-500 truncate">Settings & Log out</p>
                </div>
              </div>
            </div>
          </>
        ) : (
          <div className="h-full flex flex-col justify-between pt-20 pb-4">
            <div className="w-full space-y-3">
              <h1 className="text-3xl font-black mb-6 tracking-tighter text-transparent bg-clip-text bg-linear-to-r from-pink-500 to-violet-500 uppercase">
                CINESYNC
              </h1>
              <div className="md:hidden space-y-2 border-b border-zinc-800 pb-4 mb-4">
                <Link href="/" onClick={() => setIsOpen(false)} className="flex items-center gap-4 w-full p-3 rounded-xl hover:bg-zinc-900 text-zinc-400 hover:text-white font-medium transition-all">
                  <Film className="w-5 h-5" />
                  <span>Movies</span>
                </Link>
                <Link href="/books" onClick={() => setIsOpen(false)} className="flex items-center gap-4 w-full p-3 rounded-xl hover:bg-zinc-900 text-zinc-400 hover:text-white font-medium transition-all">
                  <BookOpen className="w-5 h-5" />
                  <span>Books</span>
                </Link>
              </div>
            </div>

            <div className="flex flex-col items-center text-center px-4 w-full">
              <div className="w-16 h-16 rounded-full bg-zinc-900 border border-zinc-800 flex items-center justify-center mb-6 text-zinc-400">
                <LogIn className="w-8 h-8" />
              </div>
              <h3 className="text-xl font-bold mb-2">Welcome to CineSync</h3>
              <p className="text-sm text-zinc-500 mb-8">Log in to create private sync rooms and track your history.</p>
              
              <Link 
                href="/login"
                onClick={() => setIsOpen(false)}
                className="flex items-center justify-center gap-2 w-full p-4 rounded-xl bg-pink-600 text-white font-bold hover:bg-pink-500 transition-all text-lg shadow-lg cursor-pointer"
              >
                Log In
              </Link>
            </div>
            <div />
          </div>
        )}

      </aside>
    </>
  )
}