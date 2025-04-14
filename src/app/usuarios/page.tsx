'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Header from '@/components/layout/Header';
import SearchBar from '@/components/users/SearchBar';
import UserTable from '@/components/users/UserTable';
import { User, Role, Permission, RoleGranting } from '@/types/models/GeneralModels';

// Datos de ejemplo - Esto se reemplazará con la llamada a la API
const mockUsers: User[] = [
  {
    id: 1,
    dni: '30000222200',
    first_name: 'Accesorios VIMALUM',
    surname: 'Bta',
    email: 'vimalumaccesorios@gmail.com',
    birthdate: '1990-01-01',
    photo_url: '',
    entry_date: '2020-01-01',
    links: [],
    is_Active: true,
    deparure_date: null,
    other_name: '',
    other_surname: '',
    interest_topics: [],
    participations: [],
    role_granting_list: [
      {
        id: 1,
        role: {
          id: 1,
          name: 'admin',
          is_active: true,
          accesses: [
            { id: 1, name: 'users' },
            { id: 2, name: 'projects' },
            { id: 3, name: 'reports' }
          ]
        },
        permissions: [
          { id: 1, name: 'create', description: 'Crear nuevos registros' },
          { id: 2, name: 'read', description: 'Ver registros' },
          { id: 3, name: 'update', description: 'Actualizar registros' },
          { id: 4, name: 'delete', description: 'Eliminar registros' }
        ]
      }
    ]
  },
  {
    id: 2,
    dni: '32323540000',
    first_name: 'Aceros Carlos',
    surname: 'INOX',
    email: 'inoxacero@gmail.com',
    birthdate: '1990-01-01',
    photo_url: '',
    entry_date: '2020-01-01',
    links: [],
    is_Active: true,
    deparure_date: null,
    other_name: '',
    other_surname: '',
    interest_topics: [],
    participations: [],
    role_granting_list: [
      {
        id: 2,
        role: {
          id: 2,
          name: 'investigador',
          is_active: true,
          accesses: [
            { id: 2, name: 'projects' },
            { id: 3, name: 'reports' }
          ]
        },
        permissions: [
          { id: 1, name: 'create', description: 'Crear nuevos registros' },
          { id: 2, name: 'read', description: 'Ver registros' },
          { id: 3, name: 'update', description: 'Actualizar registros' }
        ]
      }
    ]
  },
  {
    id: 3,
    dni: '10023302324',
    first_name: 'T.K',
    surname: 'Andina',
    email: 'andina.tk@outlook.com',
    birthdate: '1990-01-01',
    photo_url: '',
    entry_date: '2020-01-01',
    links: [],
    is_Active: false,
    deparure_date: null,
    other_name: '',
    other_surname: '',
    interest_topics: [],
    participations: [],
    role_granting_list: [
      {
        id: 3,
        role: {
          id: 3,
          name: 'colaborador',
          is_active: true,
          accesses: [
            { id: 2, name: 'projects' }
          ]
        },
        permissions: [
          { id: 2, name: 'read', description: 'Ver registros' },
          { id: 3, name: 'update', description: 'Actualizar registros' }
        ]
      }
    ]
  }
];

export default function UsersPage() {
  const [users, setUsers] = useState<User[]>(mockUsers);

  const handleSearch = async (query: string) => {
    // TODO: Implementar la búsqueda con la API
    console.log('Buscando:', query);
  };

  return (
    <>
      <Header moduleName="Gestión de Usuarios" />
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold">Lista de usuarios</h1>
          <Link
            href="/usuarios/nuevo"
            className="bg-green-100 hover:bg-green-200 text-green-800 font-semibold py-2 px-4 rounded-lg transition-colors"
          >
            Agregar Usuario...
          </Link>
        </div>

        <div className="mb-6">
          <SearchBar onSearch={handleSearch} />
        </div>

        <div className="bg-white rounded-lg shadow">
          <UserTable users={users} />
        </div>
      </div>
    </>
  );
} 