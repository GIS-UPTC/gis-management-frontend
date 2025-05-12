import axios from 'axios';
import { GroupInformation, GroupMember, GroupProduct } from '@/types/models/groupInformation.models';
import { handleApiError } from '@/utils/errorHandler';

// Crear una instancia de axios sin interceptores para llamadas públicas
const publicApi = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api/v1',
  headers: {
    'Content-Type': 'application/json',
  },
});

export class GroupInformationServiceError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'GroupInformationServiceError';
  }
}

export const groupInformationService = {
  async getGroupInformation(): Promise<GroupInformation> {
    try {
      const response = await publicApi.get<GroupInformation>('/group_information/');
      return response.data;
    } catch (error) {
      console.log(error);
      return handleApiError(
        error,
        GroupInformationServiceError,
        'Error al obtener la informacion del grupo. Por favor, intente nuevamente.'
      );
    }
  },

  async getGroupMember(): Promise<GroupMember[]> {
    try {
      const response = await publicApi.get<GroupMember[]>('/group_information/members/');
      return response.data;
    } catch (error) {
      console.log(error);
      return handleApiError(
        error,
        GroupInformationServiceError,
        'Error al obtener la informacion del miembro del grupo. Por favor, intente nuevamente.'
      );
    }
  },

  async getGroupProduct(): Promise<GroupProduct[]> {
    try {
      const response = await publicApi.get<GroupProduct[]>('/group_information/products/');
      return response.data;
    } catch (error) {
      console.log(error);
      return handleApiError(
        error,
        GroupInformationServiceError,
        'Error al obtener la informacion del producto del grupo. Por favor, intente nuevamente.'
      );
    }
  },
};
