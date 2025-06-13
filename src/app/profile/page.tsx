'use client';

import React, { useEffect, useState } from 'react';
import Header from '@/components/layout/Header';
import { User } from '@/types/models/GeneralModels';
import { loginService } from '@/services/loginService';
import { toast, Toaster } from 'react-hot-toast';
import { userService } from '@/services/userService';
import ArrowLeftIcon from '@heroicons/react/24/outline/ArrowLeftIcon';
import Link from 'next/link';
import { capitalizeFirstLetter, formatUserFullName, validatePassword } from '@/utils/stringUtils';
import { Eye, EyeOff } from 'lucide-react';
import { getImageUrl } from '@/utils/imageUtils';

export default function ProfilePage() {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isPasswordDialogOpen, setIsPasswordDialogOpen] = useState(false);
  const [isLogoutDialogOpen, setIsLogoutDialogOpen] = useState(false);
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  useEffect(() => {
    const loadUser = () => {
      try {
        // Usar el servicio de login actualizado que prioriza cookies
        const currentUser = loginService.getUser();
        if (!currentUser) {
          toast.error('No se encontró información del usuario');
          return;
        }
        setUser(currentUser);
      } catch (error) {
        console.error('Error al cargar el perfil:', error);
        toast.error('Error al cargar el perfil del usuario');
      } finally {
        setIsLoading(false);
      }
    };

    loadUser();
  }, []);

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (newPassword !== confirmPassword) {
      toast.error('Las contraseñas no coinciden');
      return;
    }

    // Validar la contraseña con los nuevos requisitos
    const passwordValidation = validatePassword(newPassword);
    if (!passwordValidation.isValid) {
      toast.error(passwordValidation.message || 'La contraseña no cumple con los requisitos de seguridad');
      return;
    }

    if (!user) return;

    setIsSubmitting(true);
    try {
      await userService.changePassword(user.id, newPassword);
      toast.success('Contraseña actualizada correctamente');
      setIsPasswordDialogOpen(false);
      setNewPassword('');
      setConfirmPassword('');
      
      // Cerrar sesión y redirigir al login
      setTimeout(() => {
        loginService.logout();
      }, 500);
    } catch(error) {
      console.log(error)
      toast.error('Error al cambiar la contraseña');
    } finally {
      setIsSubmitting(false);
    }
  }

  const handleLogout = () => {
    setIsLogoutDialogOpen(true);
  };

  const confirmLogout = () => {
    loginService.logout();
    toast.success('Sesión cerrada correctamente');
  };

  if (isLoading) {
    return (
      <>
        <Header moduleName="Perfil" />
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
        <Header moduleName="Perfil" />
        <div className="container mx-auto px-4 py-8">
          <div className="text-center py-8 text-gray-500">
            No se encontró información del usuario
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <Toaster position="top-center" />
      <Header moduleName="Perfil" />
      <div className="w-full max-w-4xl mx-auto px-4 py-8">
        <div className="flex items-center mb-6">
          <Link href="/" className="mr-4">
            <ArrowLeftIcon className="h-8 w-8 text-black hover:text-orange-600" />
          </Link>
          <h1 className="text-2xl font-bold">Mi Perfil</h1>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Imagen del usuario y badges */}
            <div className="md:col-span-2 flex flex-col md:flex-row items-center justify-between mb-6">
              <div className="flex flex-col md:flex-row items-center">
                <div className="w-40 h-40 rounded-full overflow-hidden mb-4 md:mb-0 md:mr-6">
                  <img
                    src={getImageUrl(user.photo_url) || "https://cdn-icons-png.flaticon.com/512/149/149071.png"}
                    alt={`${user.first_name} ${user.surname}`}
                    width={150}
                    height={150}
                    className="object-cover w-full h-full"
                  />
                </div>
                <div className="flex flex-col items-center md:items-start">
                  <h2 className="text-xl font-bold">{formatUserFullName(user)}</h2>
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
              <div className="flex flex-col md:flex-row gap-3 mt-4 md:mt-0">
                <button
                  onClick={() => setIsPasswordDialogOpen(true)}
                  className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg transition-colors"
                >
                  Cambiar Contraseña
                </button>
                <button
                  type="button"
                  className="px-4 py-2 bg-red-100 text-red-800 rounded-lg hover:bg-red-200"
                  onClick={handleLogout}
                >
                  Cerrar Sesión
                </button>
              </div>
            </div>

            <div>
              <h2 className="text-lg font-semibold mb-4">Información Personal</h2>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">Nombres</label>
                  <p className="mt-1">{capitalizeFirstLetter(user.first_name)} {capitalizeFirstLetter(user.other_name || '')}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Apellidos</label>
                  <p className="mt-1">{capitalizeFirstLetter(user.surname)} {capitalizeFirstLetter(user.other_surname || '')}</p>
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
                      <p className="mt-1">{capitalizeFirstLetter(user.program.name)} - {user.program.is_diurn ? ('Diurno') : ('Nocturno')}</p>
                    </div>
                    {user.program.faculty && (
                      <>
                        <div>
                          <label className="block text-sm font-medium text-gray-700">Facultad</label>
                          <p className="mt-1">{capitalizeFirstLetter(user.program.faculty.name)}</p>
                        </div>
                        {user.program.faculty.university && (
                          <div>
                            <label className="block text-sm font-medium text-gray-700">Universidad</label>
                            <p className="mt-1">{capitalizeFirstLetter(user.program.faculty.university.name)} - {user.program.faculty.place ? capitalizeFirstLetter(user.program.faculty.place.name) : ''}</p>
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
                <p className="text-gray-500 italic">No tiene roles asignados</p>
              )}
            </div>
          </div>
        </div>

        {/* Diálogo de Cambio de Contraseña */}
        {isPasswordDialogOpen && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
            <div className="bg-white rounded-lg p-6 w-full max-w-md">
              <h2 className="text-xl font-bold mb-4">Cambiar Contraseña</h2>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Nueva Contraseña
                  </label>
                  <div className="relative">
                    <input
                      type={showPassword ? "text" : "password"}
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      className="w-full px-3 py-2 pr-10 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="Ingrese su nueva contraseña"
                    />
                    <div className="absolute inset-y-0 right-0 pr-3 flex items-center">
                      <button
                        type="button"
                        onClick={togglePasswordVisibility}
                        className="text-gray-400 hover:text-gray-500 focus:outline-none"
                      >
                        {showPassword ? (
                          <EyeOff className="h-5 w-5" />
                        ) : (
                          <Eye className="h-5 w-5" />
                        )}
                      </button>
                    </div>
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Confirmar Contraseña
                  </label>
                  <div className="relative">
                    <input
                      type={showPassword ? "text" : "password"}
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      className="w-full px-3 py-2 pr-10 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="Confirme su nueva contraseña"
                    />
                    <div className="absolute inset-y-0 right-0 pr-3 flex items-center">
                      <button
                        type="button"
                        onClick={togglePasswordVisibility}
                        className="text-gray-400 hover:text-gray-500 focus:outline-none"
                      >
                        {showPassword ? (
                          <EyeOff className="h-5 w-5" />
                        ) : (
                          <Eye className="h-5 w-5" />
                        )}
                      </button>
                    </div>
                  </div>
                </div>
                <div className="mt-2 text-xs text-gray-600">
                    <p className="font-medium mb-1">La contraseña debe contener:</p>
                    <ul className="list-disc pl-5 space-y-1">
                    <li>Al menos 8 caracteres</li>
                      <li>Al menos una letra mayúscula</li>
                      <li>Al menos una letra minúscula</li>
                      <li>Al menos un número</li>
                      <li>Al menos un símbolo</li>
                      <li>No más de 3 números consecutivos</li>
                      <li>No contener las palabras: gis, uptc, admin, administrador, user, usuario, estudiante, grupo, investigacion, investigación, universidad, tunja, boyaca, boyacá, colombia, software</li>
                    </ul>
                  </div>
              </div>
              <div className="mt-6 flex justify-end space-x-3">
                <button
                  onClick={() => {
                    setIsPasswordDialogOpen(false);
                    setNewPassword('');
                    setConfirmPassword('');
                  }}
                  className="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
                >
                  Cancelar
                </button>
                <button
                  onClick={handleChangePassword}
                  disabled={isSubmitting}
                  className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors disabled:opacity-50"
                >
                  {isSubmitting ? 'Guardando...' : 'Guardar'}
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Diálogo de confirmación de cierre de sesión */}
        {isLogoutDialogOpen && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 w-full max-w-md">
              <h2 className="text-xl font-bold mb-4">Cerrar Sesión</h2>
              <p className="text-gray-600 mb-6">¿Está seguro que desea cerrar su sesión?</p>
              <div className="flex justify-end space-x-3">
                <button
                  onClick={() => setIsLogoutDialogOpen(false)}
                  className="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
                >
                  Cancelar
                </button>
                <button
                  onClick={confirmLogout}
                  className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
                >
                  Cerrar Sesión
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
}