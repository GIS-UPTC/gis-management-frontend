'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { HiMenu, HiX, HiHome, HiDocumentText, HiUserGroup } from 'react-icons/hi';
import Header from '@/components/layout/Header';

export default function PublicoLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <div className="min-h-screen bg-customBackground">
      {/* Usar el componente Header principal */}
      <Header moduleName="Información Pública" />
      
      {/* Menú de navegación mejorado debajo del header */}
      <div className="bg-white shadow-md border-b border-gray-200">
        <div className="container mx-auto px-4">
          {/* Navegación para desktop - más alta y con iconos */}
          <nav className="hidden md:block">
            <ul className="flex space-x-8 py-4">
              <li>
                <Link
                  href="/publico/inicio"
                  className={`flex items-center text-lg transition-colors hover:text-primary-600 group ${
                    pathname === '/publico/inicio'
                      ? 'text-primary-600 font-medium'
                      : 'text-gray-700'
                  }`}
                >
                  <HiHome className={`mr-2 ${
                    pathname === '/publico/inicio'
                      ? 'text-primary-600'
                      : 'text-gray-500 group-hover:text-primary-500'
                  }`} size={20} />
                  <span>Inicio</span>
                </Link>
              </li>
              <li>
                <Link
                  href="/publico/publicaciones"
                  className={`flex items-center text-lg transition-colors hover:text-primary-600 group ${
                    pathname === '/publico/publicaciones'
                      ? 'text-primary-600 font-medium'
                      : 'text-gray-700'
                  }`}
                >
                  <HiDocumentText className={`mr-2 ${
                    pathname === '/publico/publicaciones'
                      ? 'text-primary-600'
                      : 'text-gray-500 group-hover:text-primary-500'
                  }`} size={20} />
                  <span>Productos
                  </span>
                </Link>
              </li>
              <li>
                <Link
                  href="/publico/colaboradores"
                  className={`flex items-center text-lg transition-colors hover:text-primary-600 group ${
                    pathname === '/publico/colaboradores'
                      ? 'text-primary-600 font-medium'
                      : 'text-gray-700'
                  }`}
                >
                  <HiUserGroup className={`mr-2 ${
                    pathname === '/publico/colaboradores'
                      ? 'text-primary-600'
                      : 'text-gray-500 group-hover:text-primary-500'
                  }`} size={20} />
                  <span>Miembros</span>
                </Link>
              </li>
            </ul>
          </nav>

          {/* Botón de menú para móviles - mejorado */}
          <div className="md:hidden py-3 flex items-center">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="p-2 rounded-lg bg-gray-100 text-gray-700 hover:bg-gray-200 flex items-center transition-colors duration-200"
              aria-label="Toggle menu"
            >
              {isMenuOpen ? <HiX size={24} /> : <HiMenu size={24} />}
              <span className="ml-2 font-medium">Menú</span>
            </button>
          </div>

          {/* Menú móvil - mejorado */}
          {isMenuOpen && (
            <nav className="md:hidden pb-3">
              <ul className="space-y-2 border rounded-lg overflow-hidden bg-white shadow-sm">
                <li>
                  <Link
                    href="/publico/inicio"
                    onClick={() => setIsMenuOpen(false)}
                    className={`flex items-center py-3 px-4 transition-colors ${
                      pathname === '/publico/inicio'
                        ? 'bg-primary-50 text-primary-700 border-l-4 border-primary-500'
                        : 'text-gray-700 hover:bg-gray-50 border-l-4 border-transparent'
                    }`}
                  >
                    <HiHome size={20} className="mr-3" />
                    <span>Inicio</span>
                  </Link>
                </li>
                <li>
                  <Link
                    href="/publico/publicaciones"
                    onClick={() => setIsMenuOpen(false)}
                    className={`flex items-center py-3 px-4 transition-colors ${
                      pathname === '/publico/publicaciones'
                        ? 'bg-primary-50 text-primary-700 border-l-4 border-primary-500'
                        : 'text-gray-700 hover:bg-gray-50 border-l-4 border-transparent'
                    }`}
                  >
                    <HiDocumentText size={20} className="mr-3" />
                    <span>Productos</span>
                  </Link>
                </li>
                <li>
                  <Link
                    href="/publico/colaboradores"
                    onClick={() => setIsMenuOpen(false)}
                    className={`flex items-center py-3 px-4 transition-colors ${
                      pathname === '/publico/colaboradores'
                        ? 'bg-primary-50 text-primary-700 border-l-4 border-primary-500'
                        : 'text-gray-700 hover:bg-gray-50 border-l-4 border-transparent'
                    }`}
                  >
                    <HiUserGroup size={20} className="mr-3" />
                    <span>Miembros</span>
                  </Link>
                </li>
              </ul>
            </nav>
          )}
        </div>
      </div>

      <main className="container mx-auto px-4 py-6">
        {children}
      </main>
    </div>
  );
}