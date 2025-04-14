'use client';

import React from 'react';
import Link from 'next/link';

export default function NewUserPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Agregar Nuevo Usuario</h1>
        <Link
          href="/usuarios"
          className="bg-gray-100 hover:bg-gray-200 text-gray-800 font-semibold py-2 px-4 rounded-lg transition-colors"
        >
          Volver
        </Link>
      </div>
      
      <div className="bg-white rounded-lg shadow p-6">
        <p className="text-gray-600">Formulario en construcción...</p>
      </div>
    </div>
  );
} 