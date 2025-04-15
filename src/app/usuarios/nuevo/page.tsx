'use client';

import React from 'react';
import Header from '@/components/layout/Header';
import UserForm from '@/components/users/UserForm';

export default function NewUserPage() {
  return (
    <>
      <Header moduleName="Gestión de Usuarios" />
      <div className="container mx-auto px-4 py-8">
        <div className="mb-6">
          <h1 className="text-2xl font-bold">Nuevo Usuario</h1>
        </div>
        <UserForm />
      </div>
    </>
  );
} 