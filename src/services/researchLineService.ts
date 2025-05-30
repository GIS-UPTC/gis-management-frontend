import api from './api';
import { ResearchLine } from '@/types/models/GeneralModels';
import { handleApiError } from '@/utils/errorHandler';

export class ResearchLineServiceError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'ProgramServiceError';
  }
}

export const researchLineService = {

  async fetchResearchLines(name: string): Promise<ResearchLine[]> {
    try {
      const response = await api.get<ResearchLine[]>(`/research_lines/${name}?with_inactives=true&all=true`);
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
      const response = await api.get<ResearchLine[]>(`/research_lines/${name}?with_inactives=${withInactives}`);
      return response.data;
    } catch (error) {
      return handleApiError(
        error,
        ResearchLineServiceError,
        'Error al buscar lineas de investigacion. Por favor, intente nuevamente.'
      );
    }
  },

  async createResearchLine(data: Omit<ResearchLine, 'id'>): Promise<ResearchLine> {
    try {
      const formattedData = {
        name: data.name,
        is_active: data.is_active,
        coordinator_id: data.coordinator.id
      };
      const response = await api.post<ResearchLine>('/research_lines', formattedData);
      return response.data;
    } catch (error) {
      return handleApiError(
        error,
        ResearchLineServiceError,
        'Error al crear la linea de investigacion. Por favor, intente nuevamente.'
      );
    }
  },

  async updateResearchLine(id: number, data: Omit<ResearchLine, 'id'>): Promise<ResearchLine> {
    try {
      const formattedData = {
        name: data.name,
        is_active: data.is_active,
        coordinator_id: data.coordinator.id
      };
      const response = await api.put<ResearchLine>(`/research_lines/${id}`, formattedData);
      return response.data;
    } catch (error) {
      return handleApiError(
        error,
        ResearchLineServiceError,
        'Error al actualizar la linea de investigacion. Por favor, intente nuevamente.'
      );
    }
  },

  async updateStatusResearchLine(id: number): Promise<string> {
    try {
      await api.patch<ResearchLine>(`/research_lines/${id}`);
      return "Linea de investigacion actualizada exitosamente";
    } catch (error) {
      return handleApiError(
        error,
        ResearchLineServiceError,
        'Error al actualizar el estado de la linea de investigacion. Por favor, intente nuevamente.'
      );
    }
  }
};