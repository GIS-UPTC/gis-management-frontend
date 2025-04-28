'use client';

import React, { useEffect, useState } from 'react';
import Header from '@/components/layout/Header';
import { Organization } from '@/types/models/GeneralModels';
import { groupInformationService, GroupInformationServiceError } from '@/services/extras/groupInformationService'; // <--- Ajusta esta ruta según tu proyecto
import Image from 'next/image';
import toast from 'react-hot-toast';

export default function OrganizationPage() {
  const [organization, setOrganization] = useState<Organization | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchOrganizationData = async () => {
      try {
        const data = await groupInformationService.getGroupInformation();
        setOrganization(data);
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
      <>
        <Header moduleName="Gestión de Usuarios" />
        <div className="container mx-auto px-4 py-8">
          <p className="text-lg">Cargando la información de la organización...</p>
        </div>
      </>
    );
  }

  if (error) {
    return (
      <>
        <Header moduleName="Gestión de Usuarios" />
        <div className="container mx-auto px-4 py-8">
          <p className="text-red-600 font-semibold">{error}</p>
        </div>
      </>
    );
  }

  if (!organization) {
    return null;
  }

  return (
    <>
      <Header moduleName="Inicio" />

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
          {organization.organization_image_url && (
            <div className="mr-0 mb-4 md:mb-0 md:mr-4">
              <img
                src={organization.organization_image_url}
                alt={organization.name}
                width={150}
                height={150}
                className="object-contain"
              />
            </div>
          )}
        </div>

        <div className="bg-customLightYellow p-6 rounded-lg mb-4 shadow">
          <h2 className="text-xl font-semibold mb-2">Misión</h2>
          <p>{organization.mission}</p>
        </div>

        <div className="bg-customLightYellow p-6 rounded-lg shadow">
          <h2 className="text-xl font-semibold mb-2">Visión</h2>
          <p>{organization.vision}</p>
        </div>
      </div>
    </>
  );
}
