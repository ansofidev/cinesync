'use client'

import { supabase } from '@/lib/supabase';
import { useRouter } from 'next/navigation';

export default function SignOutButton() {
  const router = useRouter();

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    router.refresh();
  };

  return (
    <button
      onClick={handleSignOut}
      className="text-sm font-medium text-zinc-400 hover:text-white transition-colors cursor-pointer"
    >
      Log Out
    </button>
  );
}