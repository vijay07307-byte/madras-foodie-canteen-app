"use client";

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useApp } from '@/lib/store';

export default function Home() {
  const router = useRouter();
  const { user } = useApp();

  useEffect(() => {
    if (user) {
      if (user.role === 'canteen') {
        router.push('/canteen-dashboard');
      } else {
        router.push('/home');
      }
    } else {
      router.push('/auth');
    }
  }, [user, router]);

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-orange-50 via-white to-red-50">
      <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-orange-600"></div>
    </div>
  );
}