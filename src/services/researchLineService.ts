import api from './api';
import { Program, ResearchLine } from '@/types/models/GeneralModels';
import { handleApiError } from '@/utils/errorHandler';
import { AxiosError } from 'axios';

interface ErrorResponse {
  detail: string;
}

export class ResearchLineServiceError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'ProgramServiceError';
  }
}

interface CreateResearchLineData {
  name: string;
  is_active?: boolean;
  coordinator?: string;
  coordinator_id: number;
}

export const researchLineService = {

  async fetchResearchLines(name: string): Promise<ResearchLine[]> {
    try {
      const response = await api.get<ResearchLine[]>(`/research_lines/${name}?with_inactives=false&all=true`);
      console.log(response.data)
      return response.data;
    } catch (error) {
      return handleApiError(
        error, 
        ResearchLineServiceError, 
        'Error al obtener lineas de investigacion. Por favor, intente nuevamente.'
      );
    }
  },

  async searchResearchLine(name: string, withInactives: boolean = true): Promise<ResearchLine[]> {
    try {
      console.log(withInactives)
      const response = await api.get<ResearchLine[]>(`/research_lines/${name}?with_inactives=${withInactives}`);
      console.log(response)
      return response.data;
    } catch (error) {
      const axiosError = error as AxiosError<ErrorResponse>;
      if (axiosError.response?.data?.detail) {
        if(axiosError.response.data.detail === 'Token invalido' || axiosError.response.data.detail === 'Se ha terminado el tiempo de la sesion') {
          sessionStorage.removeItem('access_token');
        }
        throw new ResearchLineServiceError(axiosError.response.data.detail);
      }
      throw new ResearchLineServiceError('Error al buscar lineas de investigacion. Por favor, intente nuevamente.');
    }
  },

  /**
   * Creates a new research line
   * @param data - The research line data to create
   * @returns The created research line
   * @throws ResearchLineServiceError if the creation fails
   */
  async createResearchLine(data: Omit<ResearchLine, 'id'>): Promise<ResearchLine> {
    try {
      const formattedData = {
        name: data.name,
        is_active: data.is_active,
        coordinator_id: data.coordinator.id
      };
      console.log(formattedData)
      const response = await api.post<ResearchLine>('/research_lines', formattedData);
      return response.data;
    } catch (error) {
      const axiosError = error as AxiosError<ErrorResponse>;
      if (axiosError.response?.data?.detail) {
        if(axiosError.response.data.detail === 'Token invalido' || axiosError.response.data.detail === 'Se ha terminado el tiempo de la sesion') {
          sessionStorage.removeItem('access_token');
        }
        throw new ResearchLineServiceError(axiosError.response.data.detail);
      }
      throw new ResearchLineServiceError('Error al crear la linea de investigacion. Por favor, intente nuevamente.');
    }
  },

  async updateResearchLine(id: number, data: Omit<ResearchLine, 'id'>): Promise<ResearchLine> {
    try {
      const formattedData = {
        name: data.name,
        is_active: data.is_active,
        coordinator_id: data.coordinator.id
      };
      console.log(formattedData)
      const response = await api.put<ResearchLine>(`/research_lines/${id}`, formattedData);
      return response.data;
    } catch (error) {
      const axiosError = error as AxiosError<ErrorResponse>;
      if (axiosError.response?.data?.detail) {
        if(axiosError.response.data.detail === 'Token invalido' || axiosError.response.data.detail === 'Se ha terminado el tiempo de la sesion') {
          sessionStorage.removeItem('access_token');
        }
        throw new ResearchLineServiceError(axiosError.response.data.detail);
      }
      throw new ResearchLineServiceError('Error al crear la linea de investigacion. Por favor, intente nuevamente.');
    }
  },

  async updateStatusResearchLine(id: number): Promise<string> {
    try {
      console.log(id)
      await api.patch<ResearchLine>(`/research_lines/${id}`);
      return "Linea de investigacion actualizada exitosamente";
    } catch (error) {
      const axiosError = error as AxiosError<ErrorResponse>;
      if (axiosError.response?.data?.detail) {
        if(axiosError.response.data.detail === 'Token invalido' || axiosError.response.data.detail === 'Se ha terminado el tiempo de la sesion') {
          sessionStorage.removeItem('access_token');
        }
        throw new ResearchLineServiceError(axiosError.response.data.detail);
      }
      throw new ResearchLineServiceError('Error al crear la linea de investigacion. Por favor, intente nuevamente.');
    }
  }
};