'use client';

import React, { useEffect, useState } from 'react';
import { Organization, ResearchLine, User } from '@/types/models/GeneralModels';
import { groupInformationService, GroupInformationServiceError } from '@/services/extras/groupInformationService';
import toast from 'react-hot-toast';
import { researchLineService } from '@/services/researchLineService';
import { userService } from '@/services/userService';
import { capitalizeFirstLetter, formatUserFullName } from '@/utils/stringUtils';

export default function InicioPage() {
  const [organization, setOrganization] = useState<Organization | null>(null);
  const [researchLines, setResearchLines] = useState<ResearchLine[] | null>(null);
  const [members, setMembers] = useState<User[] | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchOrganizationData = async () => {
      try {
        const groupInformation = await groupInformationService.getGroupInformation();
        const researchLines = await researchLineService.fetchResearchLines(' ');
        const members = await userService.fetchUsers(' ');
        setResearchLines(researchLines);
        setMembers(members);
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

        <div className="bg-customLightYellow p-6 rounded-lg shadow">
          <h2 className="text-xl font-semibold mb-2">Líneas de investigación</h2>
          {researchLines && researchLines.length > 0 ? (
            <ul className="list-disc list-inside">
              {researchLines.map((line, index) => (
                <li key={index}>{capitalizeFirstLetter(line.name)}</li>
              ))}
            </ul>
          ) : (
            <p className="text-gray-600">No hay líneas de investigación aún.</p>
          )}
        </div>

        <div className="bg-customLightYellow p-6 rounded-lg shadow">
          <h2 className="text-xl font-semibold mb-2">Miembros</h2>
          {members && members.length > 0? (
            <ul className="list-disc list-inside">
              {members.map((member, index) => (
                <li key={index}>{formatUserFullName(member)}</li>
              ))}
            </ul>
          ) : (
            <p className="text-gray-600">No hay miembros aún.</p>
          )}
        </div>
      </div>
    </div>
  );
}
