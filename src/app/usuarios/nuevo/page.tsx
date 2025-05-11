'use client';

import React, { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import Header from '@/components/layout/Header';
import UserForm from '@/components/users/UserForm';
import { User } from '@/types/models/GeneralModels';
import { userService, UserServiceError } from '@/services/userService';
import { toast } from 'react-hot-toast';
import ArrowLeftIcon from '@heroicons/react/24/outline/ArrowLeftIcon';
import Link from 'next/link';

export default function NewUserPage() {
  const searchParams = useSearchParams();
  const [isEditing, setIsEditing] = useState(false);
  const [userData, setUserData] = useState<User | null>(null);  
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const editUser = searchParams.get('edit');
    if (editUser) {
      setIsEditing(true);
      fetchUserData(editUser);
    }
  }, [searchParams]);

  const fetchUserData = async (userName: string) => {
    setIsLoading(true);
    try {
      const searchResults = await userService.searchUsersByName(userName);
      if (searchResults.length > 0) {
        setUserData(searchResults[0]);
      } else {
        toast.error('Usuario no encontrado');
      }
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

  return (
    <>
      <Header moduleName="Usuarios" />
      <div className="w-full max-w-4xl mx-auto px-4 py-8">
        <div className="mb-6 flex items-center">
          <Link href="/usuarios" className="mr-4">
            <ArrowLeftIcon className="h-8 w-8 text-black hover:text-orange-600" />
          </Link>
          <h1 className="text-2xl font-bold">
            {isEditing ? 'Editar Usuario' : 'Nuevo Usuario'}
          </h1>
        </div>
        {isLoading ? (
          <div className="flex justify-center items-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-500"></div>
          </div>
        ) : (
          <UserForm initialData={userData} isEditing={isEditing} />
        )}
      </div>
    </>
  );
} 