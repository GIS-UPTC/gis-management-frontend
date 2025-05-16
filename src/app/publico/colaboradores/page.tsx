'use client';

import React, { useEffect, useState } from 'react';
import { groupInformationService, GroupInformationServiceError } from '@/services/extras/groupInformationService';
import { GroupMember } from '@/types/models/groupInformation.models';
import { FaEnvelope, FaLink, FaGraduationCap, FaUniversity } from 'react-icons/fa';
import { capitalizeFirstLetter, formatUserFullName } from '@/utils/stringUtils';
import { getImageUrl } from '@/utils/imageUtils';

export default function ColaboradoresPage() {
  const [colaboradores, setColaboradores] = useState<GroupMember[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchColaboradores = async () => {
      try {
        // Usar el servicio para obtener los miembros del grupo
        const members = await groupInformationService.getGroupMember();
        setColaboradores(members);
      } catch (err) {
        console.error('Error al cargar colaboradores:', err);
        if (err instanceof GroupInformationServiceError) {
          setError(err.message);
        } else {
          setError('No se pudieron cargar los colaboradores. Por favor, intente nuevamente más tarde.');
        }
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
      <h1 className="text-2xl font-bold text-gray-800 mb-6">Miembros</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {colaboradores && colaboradores.length > 0 ? colaboradores.map((colaborador, index) => {
          // Adaptamos el objeto para que sea compatible con formatUserFullName
          const userForFormat = {
            first_name: colaborador.first_name,
            surname: colaborador.surname,
            other_name: colaborador.other_name || undefined,
            other_surname: colaborador.other_surname || undefined
          };
          
          return (
            <div key={index} className="flex flex-col md:flex-row gap-6 border rounded-lg p-6 shadow-sm hover:shadow-md transition-shadow">
              {/* Foto del colaborador (usamos una imagen por defecto) */}
              <div className="w-full md:w-1/3 flex justify-center">
                <div className="w-40 h-40 overflow-hidden rounded-lg border-2 border-gray-200">
                  <img 
                    src={getImageUrl(colaborador.image_url)} 
                    alt={formatUserFullName(userForFormat)}
                    className="object-cover w-full h-full"
                  />
                </div>
              </div>
              
              {/* Información del colaborador */}
              <div className="w-full md:w-2/3">
                <h2 className="text-xl font-bold text-gray-800 mb-2">{formatUserFullName(userForFormat)}</h2>
                
                {/* Programa académico */}
                <div className="flex items-center mb-1">
                  <FaGraduationCap className="text-gray-500 mr-2" />
                  <span className="text-gray-600 italic">
                    {capitalizeFirstLetter(colaborador.program_name)} {colaborador.is_diurn_program ? '(Diurno)' : '(Nocturno)'}
                  </span>
                </div>
                
                {/* Universidad y Facultad */}
                <div className="flex items-center mb-3">
                  <FaUniversity className="text-gray-500 mr-2" />
                  <span className="text-gray-600">
                    {capitalizeFirstLetter(colaborador.university_name)}, {capitalizeFirstLetter(colaborador.faculty_name)}
                  </span>
                </div>
                
                {/* Fecha de ingreso */}
                <p className="text-gray-600 mb-3">
                  <span className="font-medium">Fecha de ingreso:</span> {new Date(colaborador.entry_date).toLocaleDateString()}
                </p>
                
                {/* Temas de interés */}
                {colaborador.interest_topics && colaborador.interest_topics.length > 0 && (
                  <div className="mb-3">
                    <p className="font-medium mb-1">Temas de interés:</p>
                    <div className="flex flex-wrap gap-1">
                      {colaborador.interest_topics.map((topic, idx) => (
                        <span key={idx} className="bg-gray-100 text-gray-800 text-xs font-medium px-2.5 py-0.5 rounded-full">
                          {topic}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
                
                {/* Proyectos */}
                {colaborador.projects && colaborador.projects.length > 0 && (
                  <div className="mb-3">
                    <p className="font-medium mb-1">Proyectos:</p>
                    <ul className="list-disc list-inside text-sm text-gray-600">
                      {colaborador.projects.map((project, idx) => (
                        <li key={idx}>{capitalizeFirstLetter(project)}</li>
                      ))}
                    </ul>
                  </div>
                )}
                
                {/* Contacto y enlaces */}
                <div className="flex flex-col space-y-2 mt-3">
                  <div className="flex items-center">
                    <FaEnvelope className="text-gray-500 mr-2" />
                    <a href={`mailto:${colaborador.email}`} className="text-primary-600 hover:underline">
                      {colaborador.email}
                    </a>
                  </div>
                  
                  {colaborador.links && colaborador.links.length > 0 && (
                    <div className="flex flex-wrap gap-2">
                      {colaborador.links.map((link, idx) => (
                        <a 
                          key={idx} 
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
            <p className="text-gray-500">No se encontraron miembros.</p>
          </div>
        )}
      </div>
    </div>
  );
}
