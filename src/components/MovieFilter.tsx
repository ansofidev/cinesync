'use client'

import { useRouter, useSearchParams } from 'next/navigation';

export default function MovieFilter() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const currentStatus = searchParams.get('status') || 'all';

  const setFilter = (status: string) => {
    if (status === 'all') {
      router.push('/');
    } else {
      router.push(`/?status=${status}`);
    }
  };

  const tabs = [
    { id: 'all', label: 'All Movies' },
    { id: 'planned', label: 'Planned' },
    { id: 'watched', label: 'Watched' }
  ];

  return (
    <div className="flex space-x-1 mb-8 bg-zinc-900/50 p-1 rounded-xl w-fit border border-zinc-800 backdrop-blur-md">
      {tabs.map((tab) => (
        <button
          key={tab.id}
          onClick={() => setFilter(tab.id)}
          className={`px-5 py-2 text-sm font-medium rounded-lg transition-all duration-200 ${
            currentStatus === tab.id
              ? 'bg-zinc-800 text-white shadow-sm'
              : 'text-zinc-400 hover:text-white hover:bg-zinc-800/50'
          }`}
        >
          {tab.label}
        </button>
      ))}
    </div>
  );
}