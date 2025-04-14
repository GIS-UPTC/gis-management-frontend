'use client';

import React from 'react';
import Link from 'next/link';

interface ErrorProps {
  error: Error;
  reset: () => void;
}

export default function Error({ error, reset }: ErrorProps) {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="max-w-md w-full space-y-8 p-8 bg-white rounded-lg shadow-lg">
        <div className="text-center">
          <h1 className="text-9xl font-bold text-red-500">Error</h1>
          <h2 className="mt-4 text-3xl font-bold text-gray-900">Algo salió mal</h2>
          <p className="mt-2 text-gray-600">
            {error.message || 'Ha ocurrido un error inesperado. Por favor, inténtalo de nuevo.'}
          </p>
        </div>

        <div className="mt-8 space-y-4">
          <button
            onClick={reset}
            className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-red-500 hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
          >
            Intentar de nuevo
          </button>

          <Link
            href="/"
            className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
          >
            Ir al inicio
          </Link>
        </div>
      </div>
    </div>
  );
} 