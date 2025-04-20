import React, { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { HiMenu, HiX } from 'react-icons/hi';
import { FaUser } from 'react-icons/fa'; // Importamos el icono de usuario

interface HeaderProps {
  moduleName: string;
  userName?: string; // Nombre completo del usuario actual
}

const Header: React.FC<HeaderProps> = ({ moduleName, userName = '' }) => {
  const pathname = usePathname();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  
  // Codificar el nombre de usuario para que sea seguro usarlo en una URL
  const encodedUserName = encodeURIComponent(userName);

  const navItems = [
    { name: 'Inicio', path: '/' },
    { name: 'Usuarios', path: '/usuarios' },
    { name: 'Roles', path: '/roles' },
    { name: 'Lineas', path: '/lineas' },
    { name: 'Proyectos', path: '/proyectos' },
  ];

  return (
    <header className="bg-[#F9E27D] shadow-md">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center space-x-4">
            <Image
              src="/images/logo-gis.png"
              alt="GIS Logo"
              width={120}
              height={120}
              className="object-contain"
            />
            <h1 className="text-xl font-semibold text-gray-800 hidden sm:block">{moduleName}</h1>
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
              {navItems.map((item) => (
                <li key={item.path}>
                  <Link
                    href={item.path}
                    className={`text-base font-medium transition-colors hover:text-primary-600 ${
                      pathname === item.path
                        ? 'text-primary-600 border-b-2 border-primary-600'
                        : 'text-black'
                    }`}
                  >
                    {item.name}
                  </Link>
                </li>
              ))}
              {/* Icono de usuario */}
              <li>
                <Link 
                  href={`/profile`}
                  className="ml-4 p-2 rounded-full hover:bg-yellow-200 transition-colors flex items-center justify-center"
                  aria-label="Perfil de usuario"
                >
                  <FaUser className="text-gray-800" size={20} />
                </Link>
              </li>
            </ul>
          </nav>
        </div>

        {/* Menú móvil */}
        {isMenuOpen && (
          <nav className="md:hidden pb-4">
            <ul className="space-y-2">
              {navItems.map((item) => (
                <li key={item.path}>
                  <Link
                    href={item.path}
                    onClick={() => setIsMenuOpen(false)}
                    className={`block py-2 px-4 rounded-lg transition-colors ${
                      pathname === item.path
                        ? 'bg-primary-50 text-primary-600'
                        : 'text-gray-600 hover:bg-gray-50'
                    }`}
                  >
                    {item.name}
                  </Link>
                </li>
              ))}
              {/* Icono de usuario en menú móvil */}
              <li>
                <Link
                  href={`/perfil?nombre=${encodedUserName}`}
                  onClick={() => setIsMenuOpen(false)}
                  className={`flex items-center py-2 px-4 rounded-lg transition-colors text-gray-600 hover:bg-gray-50`}
                >
                  <FaUser className="mr-2" size={18} />
                  <span>Perfil</span>
                </Link>
              </li>
            </ul>
          </nav>
        )}
      </div>
    </header>
  );
};

export default Header;