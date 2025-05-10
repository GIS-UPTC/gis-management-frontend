import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { HiMenu, HiX } from 'react-icons/hi';
import { FaUser, FaChevronDown } from 'react-icons/fa';
import { User } from '@/types/models/GeneralModels';

interface HeaderProps {
  moduleName: string;
}

// Mapeo de rutas a accesos requeridos
const routeAccessMap: Record<string, string[]> = {
  '/usuarios': ['Usuarios'],
  '/lineas': ['Lineas de Investigacion'],
  '/roles': ['Roles'],
  '/proyectos': ['Proyectos'],
  '/productos': ['Productos'],
  '/avances': ['Avances'],
  '/': ['Informacion de grupo'],
  '/inventario-equipos': ['Inventario de equipos'],
  '/reportes': ['Reportes de todos los proyectos'],
  '/reportes/proyectos': ['Reportes de todos los proyectos'],
  '/reportes/proyectos-linea': ['Reportes de proyectos por linea de investigacion'],
  '/reportes/productos': ['Reportes de todos los productos'],
  '/reportes/productos-proyecto': ['Reportes de productos por proyecto'],
  '/reportes/avances': ['Reportes de todos los avances'],
  '/reportes/avances-proyecto': ['Reportes de avances por proyecto'],
  '/reportes/avances-usuario': ['Reportes de avances por usuario'],
  '/reportes/avances-proyecto-usuario': ['Reportes de avances por proyecto y usuario'],
};

const isSubRoute = (mainRoute: string, currentRoute: string): boolean => {
  if (mainRoute === '/') return false;
  
  return currentRoute === mainRoute || 
         (currentRoute.startsWith(mainRoute) && 
          (currentRoute.charAt(mainRoute.length) === '/' || mainRoute.endsWith('/')));
};

const hasAccessToRoute = (path: string, user: User | null): boolean => {
  if (!user) return false;
  
  if (user.is_group_leader) return true;
  
  const userAccesses = user.role_granting_list.flatMap(granting => 
    granting.role.accesses.map(access => access.name)
  );
  
  if (routeAccessMap[path]) {
    return routeAccessMap[path].some(access => userAccesses.includes(access));
  }
  
  for (const [route, accesses] of Object.entries(routeAccessMap)) {
    if (isSubRoute(route, path)) {
      return accesses.some(access => userAccesses.includes(access));
    }
  }
  
  return true;
};

const Header: React.FC<HeaderProps> = ({ moduleName}) => {
  const pathname = usePathname();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
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

  const navItems = [
    { name: 'Proyectos', path: '/proyectos' },
    { name: 'Avances', path: '/avances' },
    { name: 'Productos', path: '/productos' },
    { name: 'Reportes', path: '/reportes' },
  ];

  const dropdownItems = [
    { name: 'Lineas', path: '/lineas' },
    { name: 'Usuarios', path: '/usuarios' },
    { name: 'Roles', path: '/roles' },
  ];
  
  const filteredNavItems = navItems.filter(item => hasAccessToRoute(item.path, user));
  const filteredDropdownItems = dropdownItems.filter(item => hasAccessToRoute(item.path, user));
  
  const showDropdown = filteredDropdownItems.length > 0;

  return (
    <header className="bg-[#F9E27D] shadow-md">
      <div className="container mx-auto px-0"> 
        <div className="flex items-center justify-between h-30">
          <div className="flex items-center pl-2 md:pl-4"> 
            <Link href="/publico" title='Inicio'>
              <Image
                src="/images/logo-gis.png"
                alt="GIS Logo"
                width={160}
                height={160}
                className="object-contain cursor-pointer"
              />
            </Link>
            <h1 className="text-2xl font-semibold text-gray-800 hidden sm:block ml-4">{moduleName}</h1>
          </div>

          {/* Navegación para desktop */}
          {user ? (
            <>
              {/* Menú hamburguesa para móviles */}
              <button
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="md:hidden p-2 mr-2 text-gray-600 hover:text-gray-900"
                aria-label="Toggle menu"
              >
                {isMenuOpen ? <HiX size={24} /> : <HiMenu size={24} />}
              </button>

              <nav className="hidden md:block pr-4"> {/* Padding derecho añadido */}
                <ul className="flex items-center space-x-8"> {/* Aumentado el espacio entre elementos */}
                  {filteredNavItems.map((item) => (
                    <li key={item.path}>
                      <Link
                        href={item.path}
                        className={`text-lg transition-colors relative group ${
                          pathname === item.path
                            ? 'text-primary-600 font-medium'
                            : 'text-black hover:text-primary-600'
                        }`}
                      >
                        {item.name}
                        <span className={`absolute bottom-0 left-0 w-0 h-0.5 bg-primary-600 transition-all duration-300 group-hover:w-full ${
                          pathname === item.path ? 'w-full' : ''
                        }`}></span>
                      </Link>
                    </li>
                  ))}
                  
                  {/* Menú desplegable "Gestión Grupo" */}
                  {showDropdown && (
                    <li className="relative group">
                      <button 
                        className={`text-lg flex items-center transition-colors relative group ${
                          filteredDropdownItems.some(item => pathname === item.path)
                            ? 'text-primary-600 font-medium'
                            : 'text-black hover:text-primary-600'
                        }`}
                      >
                        Gestión Grupo
                        <FaChevronDown className="ml-1" size={12} />
                        <span className={`absolute bottom-0 left-0 w-0 h-0.5 bg-primary-600 transition-all duration-300 group-hover:w-full ${
                          filteredDropdownItems.some(item => pathname === item.path) ? 'w-full' : ''
                        }`}></span>
                      </button>
                      
                      <div className="absolute w-full h-4 top-full left-0"></div>
                      
                      <div className="hidden group-hover:block absolute left-0 top-full pt-4 z-10">
                        <div className="w-48 rounded-md shadow-lg bg-customMiddleYellow ring-1 ring-black ring-opacity-5 py-1 overflow-hidden">
                          {filteredDropdownItems.map((item) => (
                            <Link
                              key={item.path}
                              href={item.path}
                              className={`block px-4 py-3 text-lg transition-all hover:bg-yellow-200 hover:pl-6 ${
                                pathname === item.path ? 'bg-yellow-100 text-primary-600 border-l-4 border-primary-600' : 'text-black'
                              }`}
                            >
                              {item.name}
                            </Link>
                          ))}
                        </div>
                      </div>
                    </li>
                  )}
                  
                  {/* Icono de perfil de usuario */}
                  <li className="ml-8"> {/* Mayor margen izquierdo para separarlo */}
                    <Link 
                      href="/profile"
                      className="p-2 rounded-full bg-yellow-200 hover:bg-yellow-300 transition-all hover:scale-110 flex items-center justify-center"
                      aria-label="Perfil de usuario"
                    >
                      <FaUser className="text-gray-800" size={20} />
                    </Link>
                  </li>
                </ul>
              </nav>
            </>
          ) : (
            /* Botón de Acceder */
            <Link 
              href="/auth/login"
              className="mr-4 bg-orange-500 text-white rounded-lg hover:bg-orange-600 hover:bg-orange-700 hover:shadow-md text-lg px-6 py-2 rounded-lg transition-all hover:translate-y-[-2px]"
            >
              Acceder
            </Link>
          )}
        </div>

        {/* Menú móvil */}
        {isMenuOpen && user && (
          <nav className="md:hidden pb-4">
            <ul className="space-y-2 px-2">
              {filteredNavItems.map((item) => (
                <li key={item.path}>
                  <Link
                    href={item.path}
                    onClick={() => setIsMenuOpen(false)}
                    className={`block py-3 px-4 rounded-lg transition-colors ${
                      pathname === item.path
                        ? 'bg-yellow-200 text-primary-600 font-medium'
                        : 'text-gray-700 hover:bg-yellow-100'
                    }`}
                  >
                    {item.name}
                  </Link>
                </li>
              ))}
              
              {/* Sección "Gestión Grupo" en móvil */}
              {filteredDropdownItems.length > 0 && (
                <>
                  <li>
                    <div className="py-2 px-4 text-gray-600 font-medium">Gestión Grupo:</div>
                  </li>
                  
                  {filteredDropdownItems.map((item) => (
                    <li key={item.path}>
                      <Link
                        href={item.path}
                        onClick={() => setIsMenuOpen(false)}
                        className={`block py-3 px-4 ml-4 rounded-lg transition-colors ${
                          pathname === item.path
                            ? 'bg-yellow-200 text-primary-600 font-medium'
                            : 'text-gray-700 hover:bg-yellow-100'
                        }`}
                      >
                        {item.name}
                      </Link>
                    </li>
                  ))}
                </>
              )}
              
              {/* Icono de perfil de usuario en menú móvil */}
              <li>
                <Link
                  href="/profile"
                  onClick={() => setIsMenuOpen(false)}
                  className="flex items-center py-3 px-4 rounded-lg transition-colors text-gray-700 hover:bg-yellow-100"
                >
                  <FaUser className="mr-2" size={20} />
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