'use client';

import React, { useEffect, useState } from 'react';
// import Image from 'next/image'; // No necesitamos este import ya que usaremos la etiqueta img nativa
import { userService } from '@/services/userService';
import { User } from '@/types/models/GeneralModels';
import { FaEnvelope, FaLink } from 'react-icons/fa';
import { formatUserFullName } from '@/utils/stringUtils';

export default function ColaboradoresPage() {
  const [colaboradores, setColaboradores] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchColaboradores = async () => {
      try {
        // Usar el servicio para obtener todos los usuarios
        const users = await userService.fetchUsers(' ');
        
        // Verificar que los usuarios tengan todas las propiedades necesarias
        const validUsers = users.map(user => ({
          ...user,
          // Asegurar que todas las propiedades existan
          responsabilities: user.responsabilities || [],
          links: user.links || [],
          program: user.program || { name: 'Programa no especificado' },
          is_group_leader: !!user.is_group_leader,
          is_main_researcher: !!user.is_main_researcher
        }));
        
        setColaboradores(validUsers);
      } catch (err) {
        console.error('Error al cargar colaboradores:', err);
        setError('No se pudieron cargar los colaboradores. Por favor, intente nuevamente más tarde.');
      } finally {
        setLoading(false);
      }
    };

    fetchColaboradores();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-white rounded-lg shadow-md p-6 text-center">
        <p className="text-red-500">{error}</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h1 className="text-2xl font-bold text-gray-800 mb-6">Colaboradores</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {colaboradores && colaboradores.length > 0 ? colaboradores.map((colaborador) => {
          
          return (
            <div key={colaborador.id} className="flex flex-col md:flex-row gap-6 border rounded-lg p-6 shadow-sm hover:shadow-md transition-shadow">
              {/* Foto del colaborador */}
              <div className="w-full md:w-1/3 flex justify-center">
                <div className="w-40 h-40 overflow-hidden rounded-lg border-2 border-gray-200">
                  <img 
                    src={colaborador.photo_url || '/images/default-user.png'} 
                    alt={formatUserFullName(colaborador)}
                    className="object-cover w-full h-full"
                  />
                </div>
              </div>
              
              {/* Información del colaborador */}
              <div className="w-full md:w-2/3">
                <h2 className="text-xl font-bold text-gray-800 mb-2">{formatUserFullName(colaborador)}</h2>
                
                {/* Programa académico */}
                <p className="text-gray-600 mb-1 italic">
                  {colaborador.program?.name || 'Programa no especificado'}
                </p>
                
                {/* Roles/Responsabilidades */}
                <div className="mb-3">
                  {colaborador.is_group_leader && (
                    <span className="bg-primary-100 text-primary-800 text-xs font-medium mr-2 px-2.5 py-0.5 rounded-full">
                      Líder de Grupo
                    </span>
                  )}
                  {colaborador.is_main_researcher && (
                    <span className="bg-blue-100 text-blue-800 text-xs font-medium mr-2 px-2.5 py-0.5 rounded-full">
                      Investigador Principal
                    </span>
                  )}
                  {colaborador.responsabilities && colaborador.responsabilities.length > 0 && colaborador.responsabilities.map(resp => (
                    <span key={resp.id} className="bg-gray-100 text-gray-800 text-xs font-medium mr-2 px-2.5 py-0.5 rounded-full">
                      {resp.description}
                    </span>
                  ))}
                </div>
                
                {/* Contacto y enlaces */}
                <div className="flex flex-col space-y-2">
                  <div className="flex items-center">
                    <FaEnvelope className="text-gray-500 mr-2" />
                    <a href={`mailto:${colaborador.email}`} className="text-primary-600 hover:underline">
                      {colaborador.email}
                    </a>
                  </div>
                  
                  {colaborador.links && colaborador.links.length > 0 && (
                    <div className="flex flex-wrap gap-2">
                      {colaborador.links.map((link, index) => (
                        <a 
                          key={index} 
                          href={link.link} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="flex items-center text-sm text-primary-600 hover:underline"
                        >
                          <FaLink className="mr-1" />
                          {link.name}
                        </a>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>
          );
        }) : (
          <div className="col-span-1 md:col-span-2 text-center py-10">
            <p className="text-gray-500">No se encontraron colaboradores.</p>
          </div>
        )}
      </div>
    </div>
  );
}
