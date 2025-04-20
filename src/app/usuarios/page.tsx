'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Header from '@/components/layout/Header';
import SearchBar from '@/components/ui/SearchBar';
import UserTable from '@/components/users/UserTable';
import { User } from '@/types/models/GeneralModels';
import { userService, UserServiceError } from '@/services/userService';
import { toast } from 'react-hot-toast';

export default function UsersPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSearch = async (query: string) => {
    if (query.length < 3) {
      toast.error('Por favor ingrese al menos 3 caracteres para buscar');
      return;
    }

    setIsLoading(true);
    setError(null);
    try {
      const searchResults = await userService.searchUsersByName(query);
      setUsers(searchResults);
      if (searchResults.length === 0) {
        toast('No se encontraron usuarios con ese nombre');
      }
    } catch (error) {
      if (error instanceof UserServiceError) {
        setError(error.message);
        toast.error(error.message);
      } else {
        const errorMessage = 'Ocurrió un error inesperado. Por favor, intente nuevamente.';
        setError(errorMessage);
        toast.error(errorMessage);
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <Header moduleName="Gestión de Usuarios" />
      <div className="w-full max-w-4xl mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold">Búsqueda de usuarios</h1>
          <Link
            href="/usuarios/nuevo"
            className="bg-customDarkGreen hover:bg-green-200 text-black font-semibold py-2 px-4 rounded-lg transition-colors"
          >
            Agregar Usuario...
          </Link>
        </div>

        <div className="mb-6">
          <SearchBar onSearch={handleSearch} isLoading={isLoading} />
        </div>

        {error ? (
          <div className="mb-4 p-4 bg-red-100 border border-red-400 text-red-700 rounded">
            {error}
          </div>
        ) : (
          isLoading ? (
            <div className="flex justify-center items-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-500"></div>
            </div>
          ) : users.length > 0 ? (
            <div className="bg-white rounded-lg shadow">
              <UserTable users={users} />
            </div>
          ) : (
            <div className="text-center py-8 text-gray-500">
              Ingrese un nombre para buscar usuarios
            </div>
          )
        )}

      </div>
    </>
  );
} 