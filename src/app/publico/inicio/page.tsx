'use client';

import React, { useEffect, useState } from 'react';
import { GroupInformation } from '@/types/models/groupInformation.models';
import { groupInformationService, GroupInformationServiceError } from '@/services/extras/groupInformationService';
import toast from 'react-hot-toast';
import { capitalizeFirstLetter } from '@/utils/stringUtils';

export default function InicioPage() {
  const [organization, setOrganization] = useState<GroupInformation | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchOrganizationData = async () => {
      try {
        const groupInformation = await groupInformationService.getGroupInformation();
        setOrganization(groupInformation);
      } catch (error) {
        if (error instanceof GroupInformationServiceError) {
          setError(error.message);
          toast.error(error.message);
        } else {
          const errorMessage = 'Ocurrió un error inesperado. Por favor, intente nuevamente.';
          setError(errorMessage);
          toast.error(errorMessage);
        }
      } finally {
        setLoading(false);
      }
    };

    fetchOrganizationData();
  }, []);

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-600"></div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 py-8">
        <p className="text-red-600 font-semibold">{error}</p>
      </div>
    );
  }

  if (!organization) {
    return null;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold mb-1">
            {organization.name} {organization.acronym && `(${organization.acronym})`}
          </h1>
          {organization.slogan && (
            <p className="text-gray-600 text-lg">{organization.slogan}</p>
          )}
        </div>
        <div className="mr-0 mb-4 md:mb-0 md:mr-4">
            <img
              src="/images/logo-gis.png"
              alt="GIS Logo"
              width={280}
              height={280}
              className="object-contain"
            />
          </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
        <div className="bg-customLightYellow p-6 rounded-lg mb-4 shadow">
          <h2 className="text-xl font-semibold mb-2">Misión</h2>
          <p>{organization.mission}</p>
        </div>

        <div className="bg-customLightYellow p-6 rounded-lg shadow">
          <h2 className="text-xl font-semibold mb-2">Visión</h2>
          <p>{organization.vision}</p>
        </div>

        <div className="bg-customLightYellow p-6 rounded-lg shadow col-span-1 sm:col-span-2">
          <h2 className="text-xl font-semibold mb-2">Clasificaciones</h2>
          {organization.clasiffications && organization.clasiffications.length > 0 ? (
            <div className="flex flex-wrap gap-2">
              {organization.clasiffications.map((classification, index) => (
                <span key={index} className="bg-primary-100 text-primary-800 text-sm font-medium px-3 py-1 rounded-full">
                  {capitalizeFirstLetter(classification.classification)} ({classification.year})
                </span>
              ))}
            </div>
          ) : (
            <p className="text-gray-600">No hay clasificaciones disponibles.</p>
          )}
        </div>

        {organization.links && organization.links.length > 0 && (
          <div className="bg-customLightYellow p-6 rounded-lg shadow col-span-1 sm:col-span-2">
            <h2 className="text-xl font-semibold mb-2">Enlaces de interés</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
              {organization.links.map((link, index) => (
                <a
                  key={index}
                  href={link.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center p-3 bg-white rounded-md shadow-sm hover:shadow transition-shadow"
                >
                  <span className="text-primary-600 font-medium">{link.name}</span>
                </a>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
