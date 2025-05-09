import React, { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { HiMenu, HiX } from 'react-icons/hi';
import { FaUser, FaChevronDown } from 'react-icons/fa'; // Icono para el dropdown

interface HeaderProps {
  moduleName: string;
}

const Header: React.FC<HeaderProps> = ({ moduleName}) => {
  const pathname = usePathname();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  // Menú principal (reorganizado según especificaciones)
  const navItems = [
    { name: 'Proyectos', path: '/proyectos' },
    { name: 'Avances', path: '/avances' },
    { name: 'Productos', path: '/productos' },
    { name: 'Reportes', path: '/reportes' },
  ];

  // Submenú para "Gestión Grupo" (antes "Más opciones")
  const dropdownItems = [
    { name: 'Lineas', path: '/lineas' },
    { name: 'Usuarios', path: '/usuarios' },
    { name: 'Roles', path: '/roles' },
  ];

  return (
    <header className="bg-[#F9E27D] shadow-md">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-30">
          <div className="flex items-center space-x-1">
            <Link href="/" title='Inicio'>
              <Image
                src="/images/logo-gis.png"
                alt="GIS Logo"
                width={160}
                height={160}
                className="object-contain cursor-pointer"
              />
            </Link>
            <h1 className="text-2xl font-semibold text-gray-800 hidden sm:block">{moduleName}</h1>
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
                    className={`text-lg transition-colors hover:text-primary-600 ${
                      pathname === item.path
                        ? 'text-primary-600 border-b-2 border-primary-600'
                        : 'text-black'
                    }`}
                  >
                    {item.name}
                  </Link>
                </li>
              ))}
              
              {/* Menú desplegable "Gestión Grupo" (antes "Más opciones") */}
              <li className="relative group">
                <button 
                  className={`text-lg flex items-center transition-colors hover:text-primary-600 ${
                    dropdownItems.some(item => pathname === item.path)
                      ? 'text-primary-600 border-b-2 border-primary-600'
                      : 'text-black'
                  }`}
                >
                  Gestión Grupo
                  <FaChevronDown className="ml-1" size={12} />
                </button>
                
                {/* Área invisible para asegurar que hay espacio entre el botón y el menú */}
                <div className="absolute w-full h-4 top-full left-0"></div>
                
                {/* Submenú desplegable - con hover mediante Tailwind group */}
                <div className="hidden group-hover:block absolute left-0 top-full pt-4 z-10">
                  <div className="w-48 rounded-md shadow-lg bg-customMiddleYellow ring-1 ring-black ring-opacity-5 py-1">
                    {dropdownItems.map((item) => (
                      <Link
                        key={item.path}
                        href={item.path}
                        className={`block px-4 py-2 text-lg hover:bg-gray-100 ${
                          pathname === item.path ? 'bg-gray-50 text-primary-600' : 'text-black'
                        }`}
                      >
                        {item.name}
                      </Link>
                    ))}
                  </div>
                </div>
              </li>
              
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
              
              {/* Sección "Gestión Grupo" en móvil */}
              <li>
                <div className="py-2 px-4 text-gray-600 font-medium">Gestión Grupo:</div>
              </li>
              
              {/* Mostrar las opciones adicionales directamente en el menú móvil */}
              {dropdownItems.map((item) => (
                <li key={item.path}>
                  <Link
                    href={item.path}
                    onClick={() => setIsMenuOpen(false)}
                    className={`block py-2 px-4 ml-4 rounded-lg transition-colors ${
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
                  href={`/profile`}
                  onClick={() => setIsMenuOpen(false)}
                  className={`flex items-center rounded-lg transition-colors text-gray-600 hover:bg-gray-50`}
                >
                  <FaUser size={25} />
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