import Link from 'next/link';
import SearchBox from './SearchBox';
import SignOutButton from './SignOutButton';
import { createClient } from '@/lib/supabase-server';

export default async function Header() {
  const supabaseServer = await createClient();
  const { data: { user } } = await supabaseServer.auth.getUser();
  const isAuthenticated = !!user;

  return (
    <header className="border-b border-zinc-800 bg-[#0a0a0a]/80 backdrop-blur-md sticky top-0 z-50">
      <div className="max-w-6xl mx-auto px-8 h-16 flex items-center justify-between">
        <div className="flex items-center gap-8">
          <Link href="/" className="text-xl font-bold bg-linear-to-r from-purple-400 to-pink-500 bg-clip-text text-transparent">
            CineSync
          </Link>
          <nav className="flex items-center gap-6">
            <Link href="/" className="text-sm font-medium text-zinc-400 hover:text-white transition-colors">
              Movies
            </Link>
            <Link href="/books" className="text-sm font-medium text-zinc-400 hover:text-white transition-colors">
              Books
            </Link>
          </nav>
        </div>

        <div className="flex items-center gap-4">
          {isAuthenticated && <SearchBox />}

          {isAuthenticated ? (
            <SignOutButton />
          ) : (
            <Link href="/login" className="text-sm font-medium text-zinc-400 hover:text-white transition-colors">
              Log In
            </Link>
          )}
        </div>
      </div>
    </header>
  );
}