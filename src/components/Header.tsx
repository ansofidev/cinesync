import Link from 'next/link';
import SearchBox from './SearchBox';
import SidebarToggle from './SidebarToggle';
import { createClient } from '@/lib/supabase-server';

export default async function Header() {
  const supabaseServer = await createClient();
  const { data: { user } } = await supabaseServer.auth.getUser();
  const isAuthenticated = !!user;

  return (
    <header className="border-b border-zinc-800 bg-[#0a0a0a]/80 backdrop-blur-md sticky top-0 z-50 w-full select-none">
      <div className="max-w-6xl mx-auto px-4 md:px-8 h-16 flex items-center justify-between gap-4">
        
        <div className="flex items-center gap-6 md:gap-8 min-w-fit shrink-0">
          <Link href="/" className="hidden sm:block text-lg md:text-xl font-bold bg-linear-to-r from-purple-400 to-pink-500 bg-clip-text text-transparent uppercase tracking-tighter">
            CineSync
          </Link>

          <nav className="hidden lg:flex items-center gap-6">
            <Link href="/" className="text-sm font-medium text-zinc-400 hover:text-white transition-colors">
              Movies
            </Link>
            <Link href="/books" className="text-sm font-medium text-zinc-400 hover:text-white transition-colors">
              Books
            </Link>
          </nav>
        </div>

        {isAuthenticated && (
          <div className="flex-1 max-w-md mx-2 sm:mx-4">
            <SearchBox />
          </div>
        )}

        <div className="shrink-0 min-w-fit">
          <SidebarToggle />
        </div>

      </div>
    </header>
  );
}