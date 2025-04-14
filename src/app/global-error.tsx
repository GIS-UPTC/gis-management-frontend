'use client';

import React from 'react';

interface GlobalErrorProps {
  error: Error;
  reset: () => void;
}

export default function GlobalError({ error, reset }: GlobalErrorProps) {
  return (
    <html>
      <body>
        <div className="min-h-screen flex items-center justify-center bg-gray-50">
          <div className="max-w-md w-full space-y-8 p-8 bg-white rounded-lg shadow-lg">
            <div className="text-center">
              <h1 className="text-9xl font-bold text-red-500">Error</h1>
              <h2 className="mt-4 text-3xl font-bold text-gray-900">Error crítico</h2>
              <p className="mt-2 text-gray-600">
                Ha ocurrido un error crítico en la aplicación. Por favor, recarga la página o contacta al administrador.
              </p>
            </div>

            <div className="mt-8">
              <button
                onClick={reset}
                className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-red-500 hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
              >
                Recargar página
              </button>
            </div>
          </div>
        </div>
      </body>
    </html>
  );
} 