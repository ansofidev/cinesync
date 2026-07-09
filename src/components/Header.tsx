import Link from 'next/link';
import SearchBox from './SearchBox';

export default function Header() {
  return (
    <header className="border-b border-zinc-800 bg-[#0a0a0a]/80 backdrop-blur-md sticky top-0 z-50">
      <div className="max-w-6xl mx-auto px-8 h-16 flex items-center justify-between">
        <div className="flex items-center gap-8">
          <Link href="/" className="text-xl font-bold tracking-tight text-white">
            Cine<span className="text-purple-500">Sync</span>
          </Link>
          
          <nav className="flex gap-6 text-sm font-medium text-zinc-400">
            <Link href="/" className="hover:text-white transition-colors">
              Movies
            </Link>
            <Link href="/books" className="hover:text-white transition-colors">
              Books
            </Link>
          </nav>
        </div>

        <div className="flex items-center gap-6">
          <SearchBox />
          
          {/* Placeholder for future Google Avatar */}
          <div className="w-8 h-8 rounded-full bg-zinc-800 border border-zinc-700"></div>
        </div>
      </div>
    </header>
  );
}