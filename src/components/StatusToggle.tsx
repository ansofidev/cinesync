'use client'

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { updateMovieStatus } from '@/app/actions';

interface StatusToggleProps {
  id: number;
  initialStatus: string;
}

export default function StatusToggle({ id, initialStatus }: StatusToggleProps) {
  const router = useRouter();
  const [isUpdating, setIsUpdating] = useState(false);

  const handleToggle = async () => {
    setIsUpdating(true);
    
    const newStatus = initialStatus === 'planned' ? 'watched' : 'planned';
    const res = await updateMovieStatus(id, newStatus);

    setIsUpdating(false);
    
    if (res.success) {
      router.refresh();
    }
  };

  return (
    <button
      onClick={handleToggle}
      disabled={isUpdating}
      className={`text-xs font-medium px-2 py-1 rounded-full backdrop-blur-md transition-colors z-10 relative ${
        initialStatus === 'watched' 
          ? 'bg-green-500/20 text-green-400 hover:bg-green-500/30' 
          : 'bg-white/10 text-white hover:bg-white/20'
      } disabled:opacity-50`}
    >
      {isUpdating ? '...' : initialStatus}
    </button>
  );
}