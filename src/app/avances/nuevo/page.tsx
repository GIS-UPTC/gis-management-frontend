'use client';

import React from 'react';
import Header from '@/components/layout/Header';
import ProgressForm from '@/components/progresses/ProgressForm';

export default function NewProgressPage() {
  return (
    <>
      <Header moduleName="Gestión de Avances" />
      <div className="container mx-auto px-4 py-8">
        <div className="mb-6">
          <h1 className="text-2xl font-bold">Nuevo Avance</h1>
        </div>
        <ProgressForm />
      </div>
    </>
  );
}