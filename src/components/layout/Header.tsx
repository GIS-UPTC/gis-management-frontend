import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { HiMenu, HiX } from 'react-icons/hi';
import { FaUser, FaChevronDown } from 'react-icons/fa'; // Icono para el dropdown
import { User } from '@/types/models/GeneralModels';

interface HeaderProps {
  moduleName: string;
}

// Mapeo de rutas a accesos requeridos (copiado de ProtectedRoute.tsx)
const routeAccessMap: Record<string, string[]> = {
  '/usuarios': ['Usuarios'],
  '/lineas': ['Lineas de Investigacion'],
  '/roles': ['Roles'],
  '/proyectos': ['Proyectos'],
  '/productos': ['Productos'],
  '/avances': ['Avances'],
  '/': ['Informacion de grupo'],
  '/inventario-equipos': ['Inventario de equipos'],
  '/reportes': ['Reportes de todos los proyectos'], // Añadido para la ruta principal de reportes
  '/reportes/proyectos': ['Reportes de todos los proyectos'],
  '/reportes/proyectos-linea': ['Reportes de proyectos por linea de investigacion'],
  '/reportes/productos': ['Reportes de todos los productos'],
  '/reportes/productos-proyecto': ['Reportes de productos por proyecto'],
  '/reportes/avances': ['Reportes de todos los avances'],
  '/reportes/avances-proyecto': ['Reportes de avances por proyecto'],
  '/reportes/avances-usuario': ['Reportes de avances por usuario'],
  '/reportes/avances-proyecto-usuario': ['Reportes de avances por proyecto y usuario'],
};

// Función para verificar si una ruta es subruta de otra (copiado de ProtectedRoute.tsx)
const isSubRoute = (mainRoute: string, currentRoute: string): boolean => {
  // Ignoramos la ruta raíz para evitar que bloquee todo
  if (mainRoute === '/') return false;
  
  // Verificamos si la ruta actual comienza con la ruta principal seguida de una barra o es exactamente igual
  return currentRoute === mainRoute || 
         (currentRoute.startsWith(mainRoute) && 
          (currentRoute.charAt(mainRoute.length) === '/' || mainRoute.endsWith('/')));
};

// Función para verificar si el usuario tiene acceso a una ruta específica
const hasAccessToRoute = (path: string, user: User | null): boolean => {
  if (!user) return false;
  
  // Si el usuario es líder del grupo, tiene acceso a todo
  if (user.is_group_leader) return true;
  
  const userAccesses = user.role_granting_list.flatMap(granting => 
    granting.role.accesses.map(access => access.name)
  );
  
  // Verificar acceso directo
  if (routeAccessMap[path]) {
    return routeAccessMap[path].some(access => userAccesses.includes(access));
  }
  
  // Verificar si es una subruta
  for (const [route, accesses] of Object.entries(routeAccessMap)) {
    if (isSubRoute(route, path)) {
      return accesses.some(access => userAccesses.includes(access));
    }
  }
  
  // Si no encontramos restricciones, permitimos el acceso
  return true;
};

const Header: React.FC<HeaderProps> = ({ moduleName}) => {
  const pathname = usePathname();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    // Obtener el usuario del sessionStorage
    const userStr = sessionStorage.getItem('user');
    if (userStr) {
      try {
        const userData: User = JSON.parse(userStr);
        setUser(userData);
      } catch (error) {
        console.error('Error al obtener datos del usuario:', error);
      }
    }
  }, []);

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
  
  // Filtrar elementos del menú según los permisos del usuario
  const filteredNavItems = navItems.filter(item => hasAccessToRoute(item.path, user));
  const filteredDropdownItems = dropdownItems.filter(item => hasAccessToRoute(item.path, user));
  
  // Determinar si se debe mostrar el menú desplegable
  const showDropdown = filteredDropdownItems.length > 0;

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
              {filteredNavItems.map((item) => (
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
              
              {/* Menú desplegable "Gestión Grupo" (antes "Más opciones") - solo se muestra si hay elementos con acceso */}
              {showDropdown && (
                <li className="relative group">
                  <button 
                    className={`text-lg flex items-center transition-colors hover:text-primary-600 ${
                      filteredDropdownItems.some(item => pathname === item.path)
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
                      {filteredDropdownItems.map((item) => (
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
              )}
              
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
              {filteredNavItems.map((item) => (
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
              
              {/* Sección "Gestión Grupo" en móvil - solo se muestra si hay elementos con acceso */}
              {filteredDropdownItems.length > 0 && (
                <>
                  <li>
                    <div className="py-2 px-4 text-gray-600 font-medium">Gestión Grupo:</div>
                  </li>
                  
                  {/* Mostrar las opciones adicionales directamente en el menú móvil */}
                  {filteredDropdownItems.map((item) => (
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
                </>
              )}
              
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