'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Header from '@/components/layout/Header';
import UserTable from '@/components/users/UserTable';
import { User } from '@/types/models/GeneralModels';
import { userService, UserServiceError } from '@/services/userService';
import SearchBar from '@/components/ui/SearchBar';
import { toast, Toaster } from 'react-hot-toast';
import { checkUserPermission, AVAILABLE_PERMISSIONS } from '@/utils/permissionChecker';

export default function UsersPage() {
  const [allUsers, setAllUsers] = useState<User[]>([]);
  const [filteredUsers, setFilteredUsers] = useState<User[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [canCreateUser, setCanCreateUser] = useState(false);

  useEffect(() => {
    const loadUsers = async () => {
      try {
        const allUsers = await userService.fetchUsers(' ');
        setAllUsers(allUsers);
        setFilteredUsers(allUsers);
        
        // Verificar si el usuario tiene permiso para crear usuarios
        const hasCreatePermission = checkUserPermission(AVAILABLE_PERMISSIONS.CREATE);
        setCanCreateUser(hasCreatePermission);
      } catch (error) {
        if (error instanceof UserServiceError) {
          setError(error.message);
          toast.error(error.message);
        } else {
          const errorMessage = 'Ocurrió un error al cargar los usuarios. Por favor, intente nuevamente.';
          setError(errorMessage);
          toast.error(errorMessage);
        }
      } finally {
        setIsLoading(false);
      }
    };

    loadUsers();
  }, []);

  return (
    <>
    <Toaster position="top-center" />
      <Header moduleName="Usuarios" />
      <div className="w-full max-w-4xl mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold">Listado de Usuarios</h1>
          {canCreateUser && (
            <Link
              href="/usuarios/nuevo"
              className="bg-customDarkGreen hover:bg-green-200 text-black font-semibold py-2 px-4 rounded-lg transition-colors"
            >
              Agregar Usuario
            </Link>
          )}
        </div>
        <div className="mb-6">
          <SearchBar
            onSearch={(query) => {
              if (query.length === 0) {
                setFilteredUsers(allUsers);
              } else {
                const filtered = allUsers.filter(user =>
                  (user.first_name + ' ' + user.surname).toLowerCase().includes(query.toLowerCase()) ||
                  user.email.toLowerCase().includes(query.toLowerCase())
                );
                setFilteredUsers(filtered);
              }
            }}
            placeholder="Buscar usuario..."
          />
        </div>

        {error ? (
          <div className="mb-4 p-4 bg-red-100 border border-red-400 text-red-700 rounded">
            {error}
          </div>
        ) : isLoading ? (
          <div className="flex justify-center items-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-500"></div>
          </div>
        ) : filteredUsers.length > 0 ? (
          <div className="bg-white rounded-lg shadow">
            <UserTable users={filteredUsers} />
          </div>
        ) : (
          <div className="text-center py-8 text-gray-500">
            No hay usuarios registrados
          </div>
        )}
      </div>
    </>
  );
} 