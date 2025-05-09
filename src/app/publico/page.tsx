'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function PublicoPage() {
  const router = useRouter();

  useEffect(() => {
    // Redirigir a la página de publicaciones por defecto
    router.push('/publico/publicaciones');
  }, [router]);

  return (
    <div className="flex justify-center items-center h-64">
      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-600"></div>
    </div>
  );
}
