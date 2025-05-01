'use client';

import React from 'react';
import Header from '@/components/layout/Header';
import ProgressForm from '@/components/progresses/ProgressForm';
import { ArrowLeftIcon } from '@heroicons/react/24/outline';
import Link from 'next/link';

export default function NewProgressPage() {
  return (
    <>
      <Header moduleName="Avances" />
      <div className="w-full max-w-4xl mx-auto px-4 py-8">
        <div className="mb-6 flex items-center">
          <Link href="/avances" className="mr-4">
            <ArrowLeftIcon className="h-8 w-8 text-black hover:text-orange-600" />
          </Link>
          <h1 className="text-2xl font-bold">Nuevo Avance</h1>
        </div>
        <ProgressForm />
      </div>
    </>
  );
}