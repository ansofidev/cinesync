'use client'

import { deleteMovie } from '@/app/actions';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

export default function DeleteButton({ id }: { id: number }) {
  const router = useRouter();
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDelete = async () => {
    setIsDeleting(true);
    const res = await deleteMovie(id);
    
    if (res.success) {
      router.refresh();
    } else {
      setIsDeleting(false);
    }
  };

  return (
    <button
      onClick={handleDelete}
      disabled={isDeleting}
      className="absolute top-2 right-2 bg-black/60 backdrop-blur-md text-white rounded-full w-8 h-8 flex items-center justify-center hover:bg-red-500 transition-colors disabled:opacity-50 z-10"
      title="Delete movie"
    >
      {isDeleting ? '...' : '✕'}
    </button>
  );
}