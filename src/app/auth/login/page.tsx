'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { loginService } from '@/services/loginService';
import { userService } from '@/services/userService';
import { toast } from 'react-hot-toast';
// Importamos los iconos necesarios
import { AtSign, Lock, Eye, EyeOff, Home, KeyRound } from 'lucide-react';

export default function LoginPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  // Estado para controlar la visibilidad de la contraseña
  const [showPassword, setShowPassword] = useState(false);
  
  // Estados para el diálogo de recuperación de contraseña
  const [showResetDialog, setShowResetDialog] = useState(false);
  const [resetLoading, setResetLoading] = useState(false);
  const [resetFormData, setResetFormData] = useState({
    email: '',
    verificationValue: '',
  });

  // Verificar si el usuario ya está autenticado al cargar la página
  useEffect(() => {
    if (loginService.isAuthenticated()) {
      router.push('/publico/inicio');
    }
  }, [router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    
    try {
      await loginService.login(formData);
      router.push('/publico');
    } catch (error) {
      console.error('Error during login:', error);
      setError(error instanceof Error ? error.message : 'Error en la autenticación');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  // Función para alternar la visibilidad de la contraseña
  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  // Función para navegar a inicio
  const navigateToHome = () => {
    router.push('/publico/inicio');
  };

  // Función para abrir el diálogo de recuperación de contraseña
  const openResetDialog = () => {
    setShowResetDialog(true);
    // Inicializar con el email ya ingresado en el formulario de login, si existe
    if (formData.email) {
      setResetFormData(prev => ({ ...prev, email: formData.email }));
    }
  };

  // Función para cerrar el diálogo de recuperación de contraseña
  const closeResetDialog = () => {
    setShowResetDialog(false);
    // Limpiar el formulario al cerrar
    setResetFormData({ email: '', verificationValue: '' });
  };

  // Función para manejar cambios en el formulario de recuperación
  const handleResetFormChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setResetFormData({
      ...resetFormData,
      [e.target.name]: e.target.value,
    });
  };

  // Función para enviar la solicitud de recuperación de contraseña
  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setResetLoading(true);
    
    try {
      await userService.resetPassword(
        resetFormData.email,
        resetFormData.verificationValue
      );
      
      // Mostrar mensaje de éxito
      const emailParts = resetFormData.email.split('@');
      const emailDomain = emailParts[1];
      const emailUsername = emailParts[0];
      const maskedEmail = emailUsername.substring(0, 3) + '***@' + emailDomain;
      
      toast.success(`Nueva contraseña enviada al correo terminado en ${maskedEmail}`);
      
      // Cerrar el diálogo
      closeResetDialog();
    } catch (error) {
      console.error('Error al resetear contraseña:', error);
      toast.error(error instanceof Error ? error.message : 'Error al resetear contraseña');
    } finally {
      setResetLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-customBackground flex flex-col justify-center py-12 sm:px-6 lg:px-8 relative">
      {/* Botón Volver a inicio en la parte superior derecha */}
      <div className="absolute top-4 right-4 sm:top-8 sm:right-8">
        <button
          onClick={navigateToHome}
          className="flex items-center gap-2 py-2 px-4 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors shadow-sm focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-offset-2"
        >
          <Home className="h-5 w-5" />
          <span>Volver a inicio</span>
        </button>
      </div>
      
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <div className="flex justify-center">
          <Image
            src="/images/logo-gis.png"
            alt="GIS Logo"
            width={250}
            height={250}
            className="object-contain"
          />
        </div>
        <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
          Iniciar Sesión
        </h2>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
          {error && (
            <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-md">
              <p className="text-sm text-red-600">{error}</p>
            </div>
          )}
          <form className="space-y-6" onSubmit={handleSubmit}>
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                Correo Electrónico
              </label>
              <div className="mt-1 relative rounded-md shadow-sm">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <AtSign className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  value={formData.email}
                  onChange={handleChange}
                  className="appearance-none block w-full pl-10 px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-primary-500 focus:border-primary-500"
                />
              </div>
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                Contraseña
              </label>
              <div className="mt-1 relative rounded-md shadow-sm">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Lock className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  id="password"
                  name="password"
                  type={showPassword ? "text" : "password"}
                  autoComplete="current-password"
                  required
                  value={formData.password}
                  onChange={handleChange}
                  className="appearance-none block w-full pl-10 pr-10 px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-primary-500 focus:border-primary-500"
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
              <button
                type="submit"
                disabled={loading}
                className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-base font-medium bg-orange-500 text-white rounded-lg hover:bg-orange-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 disabled:opacity-50"
              >
                {loading ? 'Iniciando sesión...' : 'Iniciar Sesión'}
              </button>
            </div>
            
            {/* Enlace de Recuperar Contraseña */}
            <div className="text-center mt-4">
              <button
                type="button"
                onClick={openResetDialog}
                className="text-orange-600 hover:text-orange-700 text-sm font-medium focus:outline-none"
              >
                ¿Olvidaste tu contraseña?
              </button>
            </div>
          </form>
        </div>
      </div>

      {/* Diálogo de Recuperación de Contraseña */}
      {showResetDialog && (
        <div className="fixed inset-0 z-50 overflow-y-auto" aria-labelledby="modal-title" role="dialog" aria-modal="true">
          <div className="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
            {/* Overlay */}
            <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" aria-hidden="true" onClick={closeResetDialog}></div>

            {/* Diálogo */}
            <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
              <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                <div className="sm:flex sm:items-start">
                  <div className="mx-auto flex-shrink-0 flex items-center justify-center h-12 w-12 rounded-full bg-orange-100 sm:mx-0 sm:h-10 sm:w-10">
                    <KeyRound className="h-6 w-6 text-orange-600" />
                  </div>
                  <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left">
                    <h3 className="text-lg leading-6 font-medium text-gray-900" id="modal-title">
                      Recuperar Contraseña
                    </h3>
                    <div className="mt-2">
                      <p className="text-sm text-gray-500">
                        Ingresa tu correo electrónico y el valor de verificación para recibir una nueva contraseña.
                      </p>
                    </div>
                  </div>
                </div>

                <form className="mt-5 space-y-4" onSubmit={handleResetPassword}>
                  <div>
                    <label htmlFor="reset-email" className="block text-sm font-medium text-gray-700">
                      Correo Electrónico
                    </label>
                    <div className="mt-1 relative rounded-md shadow-sm">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <AtSign className="h-5 w-5 text-gray-400" />
                      </div>
                      <input
                        id="reset-email"
                        name="email"
                        type="email"
                        required
                        value={resetFormData.email}
                        onChange={handleResetFormChange}
                        className="appearance-none block w-full pl-10 px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-orange-500 focus:border-orange-500"
                        placeholder="correo@ejemplo.com"
                      />
                    </div>
                  </div>

                  <div>
                    <label htmlFor="verification-value" className="block text-sm font-medium text-gray-700">
                      Valor de Verificación
                    </label>
                    <div className="mt-1 relative rounded-md shadow-sm">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <Lock className="h-5 w-5 text-gray-400" />
                      </div>
                      <input
                        id="verification-value"
                        name="verificationValue"
                        type="text"
                        required
                        value={resetFormData.verificationValue}
                        onChange={handleResetFormChange}
                        className="appearance-none block w-full pl-10 px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-orange-500 focus:border-orange-500"
                        placeholder="Valor de verificación"
                      />
                    </div>
                  </div>
                  
                  <div className="mt-5 sm:mt-4 sm:flex sm:flex-row-reverse">
                    <button
                      type="submit"
                      disabled={resetLoading}
                      className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-orange-600 text-base font-medium text-white hover:bg-orange-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500 sm:ml-3 sm:w-auto sm:text-sm disabled:opacity-50"
                    >
                      {resetLoading ? 'Enviando...' : 'Enviar'}
                    </button>
                    <button
                      type="button"
                      onClick={closeResetDialog}
                      className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500 sm:mt-0 sm:w-auto sm:text-sm"
                    >
                      Cancelar
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}