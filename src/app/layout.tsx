import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Sidebar from "@/components/Sidebar";
import Header from "@/components/Header";
import { createClient } from '@/lib/supabase-server';
import { getUserRooms } from '@/app/actions/rooms';

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "CineSync",
  description: "Your movie and book tracker",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const supabaseServer = await createClient();
  const { data: { user } } = await supabaseServer.auth.getUser();
  const isAuthenticated = !!user;

  const rooms = isAuthenticated ? await getUserRooms() : [];

  return (
    <html lang="en" className="bg-[#0a0a0a]">
      <body className={`${inter.className} bg-[#0a0a0a] text-white min-h-screen flex flex-col antialiased m-0 p-0 overflow-x-hidden`}>
        <Header />

        <div className="flex flex-1 overflow-hidden relative bg-[#0a0a0a] w-full">
          <main className="flex-1 overflow-y-auto p-4 md:p-8 w-full max-w-full">
            {children}
          </main>

          <Sidebar isAuthenticated={isAuthenticated} initialRooms={rooms} />
        </div>
      </body>
    </html>
  );
}