'use client';

import React, { useState } from 'react';
import Link from 'next/link';
// No necesitamos importar Image de Next.js
import { usePathname } from 'next/navigation';
import { HiMenu, HiX } from 'react-icons/hi';

export default function PublicoLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header similar al principal */}
      <header className="bg-[#F9E27D] shadow-md">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between h-30">
            <div className="flex items-center space-x-1">
              <Link href="/" title='Inicio'>
                <img
                  src="/images/logo-gis.png"
                  alt="GIS Logo"
                  width={160}
                  height={160}
                  className="object-contain cursor-pointer"
                />
              </Link>
              <h1 className="text-2xl font-semibold text-gray-800 hidden sm:block">Información Pública</h1>
            </div>

            {/* Menú hamburguesa para móviles */}
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="md:hidden p-2 text-gray-600 hover:text-gray-900"
              aria-label="Toggle menu"
            >
              {isMenuOpen ? <HiX size={24} /> : <HiMenu size={24} />}
            </button>

            {/* Navegación para desktop */}
            <nav className="hidden md:block">
              <ul className="flex space-x-6 items-center">
                <li>
                  <Link
                    href="/publico/publicaciones"
                    className={`text-lg transition-colors hover:text-primary-600 ${
                      pathname === '/publico/publicaciones'
                        ? 'text-primary-600 border-b-2 border-primary-600'
                        : 'text-black'
                    }`}
                  >
                    Publicaciones
                  </Link>
                </li>
                <li>
                  <Link
                    href="/publico/colaboradores"
                    className={`text-lg transition-colors hover:text-primary-600 ${
                      pathname === '/publico/colaboradores'
                        ? 'text-primary-600 border-b-2 border-primary-600'
                        : 'text-black'
                    }`}
                  >
                    Colaboradores
                  </Link>
                </li>
                <li className="ml-auto">
                  <Link
                    href="/auth/login"
                    className="bg-primary-600 hover:bg-primary-700 text-white px-4 py-2 rounded-lg transition-colors"
                  >
                    Acceder
                  </Link>
                </li>
              </ul>
            </nav>
          </div>

          {/* Menú móvil */}
          {isMenuOpen && (
            <nav className="md:hidden pb-4">
              <ul className="space-y-2">
                <li>
                  <Link
                    href="/publico/publicaciones"
                    onClick={() => setIsMenuOpen(false)}
                    className={`block py-2 px-4 rounded-lg transition-colors ${
                      pathname === '/publico/publicaciones'
                        ? 'bg-primary-50 text-primary-600'
                        : 'text-gray-600 hover:bg-gray-50'
                    }`}
                  >
                    Publicaciones
                  </Link>
                </li>
                <li>
                  <Link
                    href="/publico/colaboradores"
                    onClick={() => setIsMenuOpen(false)}
                    className={`block py-2 px-4 rounded-lg transition-colors ${
                      pathname === '/publico/colaboradores'
                        ? 'bg-primary-50 text-primary-600'
                        : 'text-gray-600 hover:bg-gray-50'
                    }`}
                  >
                    Colaboradores
                  </Link>
                </li>
                <li className="border-t border-gray-200 mt-2 pt-2">
                  <Link
                    href="/auth/login"
                    onClick={() => setIsMenuOpen(false)}
                    className="block py-2 px-4 bg-primary-600 text-white rounded-lg transition-colors hover:bg-primary-700"
                  >
                    Acceder
                  </Link>
                </li>
              </ul>
            </nav>
          )}
        </div>
      </header>

      <main className="container mx-auto px-4 py-6">
        {children}
      </main>
    </div>
  );
}
