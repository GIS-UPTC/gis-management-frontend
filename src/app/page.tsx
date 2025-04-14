'use client';

import React from 'react';
import Header from '@/components/layout/Header';

export default function HomePage() {
  return (
    <>
      <Header moduleName="Inicio" />
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-2xl font-bold mb-4">Bienvenido al Sistema de Gestión de Investigación</h1>
        {/* Contenido de la página de inicio */}
      </div>
    </>
  );
}
