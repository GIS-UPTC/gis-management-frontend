'use client';

import React, { useEffect, useState } from 'react';
import { useParams, useSearchParams } from 'next/navigation';
import Header from '@/components/layout/Header';
import { User } from '@/types/models/GeneralModels';
import { userService, UserServiceError } from '@/services/userService';
import { toast, Toaster } from 'react-hot-toast';
import Link from 'next/link';
import ArrowLeftIcon from '@heroicons/react/24/outline/ArrowLeftIcon';

export default function UserDetailsPage() {
  const params = useParams();
  const searchParams = useSearchParams();
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const userName = decodeURIComponent(params.name as string);
        const userDni = searchParams.get('dni');

        if (!userDni) {
          toast.error('DNI no proporcionado');
          return;
        }

        const searchResults = await userService.searchUsersByName(userName);

        if (searchResults.length === 0) {
          toast.error('Usuario no encontrado');
          return;
        }

        const foundUser = searchResults.find(u => u.dni === userDni);

        if (!foundUser) {
          toast.error('No se encontró coincidencia entre el nombre y el DNI');
          return;
        }

        setUser(foundUser);

      } catch (error) {
        if (error instanceof UserServiceError) {
          toast.error(error.message);
        } else {
          const errorMessage = 'Ocurrió un error inesperado. Por favor, intente nuevamente.';
          toast.error(errorMessage);
        }
      } finally {
        setIsLoading(false);
      }
    };

    fetchUser();
  }, [params.name, searchParams]);

  if (isLoading) {
    return (
      <>
        <Header moduleName="Usuarios" />
        <div className="container mx-auto px-4 py-8">
          <div className="flex justify-center items-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-500"></div>
          </div>
        </div>
      </>
    );
  }

  if (!user) {
    return (
      <>
        <Header moduleName="Usuarios" />
        <div className="container mx-auto px-4 py-8">
          <div className="text-center py-8 text-gray-500">
            Usuario no encontrado
          </div>
        </div>
      </>
    );
  }

  return (
    <>
    <Toaster position="top-center" />
      <Header moduleName="Usuarios" />
      <div className="w-full max-w-4xl mx-auto px-4 py-8">
        <div className="mb-6 flex justify-between items-center">
          <Link href="/usuarios" className="mr-4">
            <ArrowLeftIcon className="h-8 w-8 text-black hover:text-orange-600" />
          </Link>
          <h1 className="text-2xl font-bold">Detalles del Usuario</h1>
          <button
            onClick={() => window.location.href = `/usuarios/nuevo?edit=${encodeURIComponent(user.first_name + ' ' + user.surname)}`}
            className="bg-orange-500 hover:bg-orange-600 text-white px-4 py-2 rounded-lg transition-colors"
          >
            Editar Usuario
          </button>
        </div>
  
        <div className="bg-white rounded-lg shadow p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Imagen del usuario y badges */}
            <div className="md:col-span-2 flex flex-col md:flex-row items-center mb-6">
              <div className="w-40 h-40 rounded-full overflow-hidden mb-4 md:mb-0 md:mr-6">
                <img
                  src={user.photo_url || "https://cdn-icons-png.flaticon.com/512/149/149071.png"}
                  alt={`${user.first_name} ${user.surname}`}
                  width={150}
                  height={150}
                  className="object-cover w-full h-full"
                />
              </div>
              <div className="flex flex-col items-center md:items-start">
                <h2 className="text-xl font-bold">{user.first_name} {user.surname}</h2>
                <div className="flex flex-wrap gap-2 mt-2">
                  {user.is_group_leader && (
                    <span className="inline-block px-3 py-1 text-sm font-semibold text-blue-800 bg-blue-100 rounded-full">
                      Líder de Grupo
                    </span>
                  )}
                  {user.is_main_researcher && (
                    <span className="inline-block px-3 py-1 text-sm font-semibold text-purple-800 bg-purple-100 rounded-full">
                      Investigador Principal
                    </span>
                  )}
                  <span className={`inline-block px-3 py-1 text-sm font-semibold rounded-full ${user.is_Active ? 'bg-green-100 text-green-800' : 'bg-gray-200 text-gray-800'}`}>
                    {user.is_Active ? 'Activo' : 'Inactivo'}
                  </span>
                </div>
              </div>
            </div>
  
            <div>
              <h2 className="text-lg font-semibold mb-4">Información Personal</h2>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">Nombres</label>
                  <p className="mt-1">{user.first_name} {user.other_name || ''}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Apellidos</label>
                  <p className="mt-1">{user.surname} {user.other_surname || ''}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">DNI</label>
                  <p className="mt-1">{user.dni}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Correo Electrónico</label>
                  <p className="mt-1">{user.email}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Fecha de Nacimiento</label>
                  <p className="mt-1">{user.birthdate ? new Date(user.birthdate).toLocaleDateString() : 'No especificada'}</p>
                </div>
                {user.entry_date && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Fecha de Ingreso</label>
                    <p className="mt-1">{new Date(user.entry_date).toLocaleDateString()}</p>
                  </div>
                )}
                {user.deparure_date && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Fecha de Salida</label>
                    <p className="mt-1">{new Date(user.deparure_date).toLocaleDateString()}</p>
                  </div>
                )}
              </div>
            </div>
  
            <div>
              <h2 className="text-lg font-semibold mb-4">Información Académica</h2>
              <div className="space-y-4">
                {user.program && (
                  <>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Programa</label>
                      <p className="mt-1">{user.program.name}</p>
                    </div>
                    {user.program.faculty && (
                      <>
                        <div>
                          <label className="block text-sm font-medium text-gray-700">Facultad</label>
                          <p className="mt-1">{user.program.faculty.name}</p>
                        </div>
                        {user.program.faculty.university && (
                          <div>
                            <label className="block text-sm font-medium text-gray-700">Universidad</label>
                            <p className="mt-1">{user.program.faculty.university.name}</p>
                          </div>
                        )}
                      </>
                    )}
                  </>
                )}
              </div>
            </div>
  
             {/* Sección de intereses */}
          <div className="md:col-span-2">
            <h2 className="text-lg font-semibold mb-4">Temas de Interés</h2>
            {user.interest_topics && user.interest_topics.length > 0 ? (
              <div className="flex flex-wrap gap-2">
                {user.interest_topics.map((interest, index) => (
                  <span
                    key={index}
                    className="inline-block px-3 py-1 text-sm font-semibold text-gray-700 bg-blue-100 rounded-full"
                  >
                    {/* Verificamos si interest es un objeto o un string */}
                    {typeof interest === 'object' ? 
                      (interest.description || 'Tema sin nombre') : 
                      interest}
                  </span>
                ))}
              </div>
            ) : (
              <p className="text-gray-500 italic">No se han especificado temas de interés</p>
            )}
          </div>
  
            {/* Enlaces o links */}
            {user.links && user.links.length > 0 && (
              <div className="md:col-span-2">
                <h2 className="text-lg font-semibold mb-4">Enlaces</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {user.links.map((link, index) => (
                    <a 
                      key={index}
                      href={link.link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-600 hover:underline flex items-center"
                    >
                      {link.name || link.link}
                    </a>
                  ))}
                </div>
              </div>
            )}
  
            {/* Roles y permisos */}
            <div className="md:col-span-2">
              <h2 className="text-lg font-semibold mb-4">Roles y Permisos</h2>
              {user.role_granting_list && user.role_granting_list.length > 0 ? (
                <div className="space-y-4">
                  {user.role_granting_list.map((roleGrant) => (
                    <div key={roleGrant.id} className="bg-gray-50 p-4 rounded-lg">
                      <h3 className="font-medium text-gray-900">{roleGrant.role?.name || 'Rol sin nombre'}</h3>
                      <div className="mt-2">
                        <h4 className="text-sm font-medium text-gray-700">Permisos:</h4>
                        <div className="flex flex-wrap gap-2 mt-1">
                          {roleGrant.permissions?.map((permission) => (
                            <span
                              key={permission.id}
                              className="inline-block px-2 py-1 text-xs font-semibold text-gray-700 bg-yellow-100 rounded-full"
                            >
                              {permission.name}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-gray-500 italic">Este usuario no tiene roles asignados</p>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
} 