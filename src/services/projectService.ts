// services/projectService.ts
import { handleApiError, ServiceError } from '@/utils/errorHandler';
import api from './api';
import { InCharge, Project, ProjectKeyword } from '@/types/models/project.models';

export class ProjectServiceError extends ServiceError {
  constructor(message: string) {
    super(message, 'ProjectServiceError');
  }
}

const formatProjectData = (projectData: Omit<Project, 'id'>) => ({
  title: projectData.title,
  description: projectData.description,
  creation_date: projectData.creation_date,
  duration_type: projectData.duration_type,
  duration: projectData.duration,
  schedule_url: projectData.schedule_url,
  status: projectData.status,
  has_financing: projectData.has_financing,
  convocation: projectData.convocation,
  research_line_id: projectData.research_line_id,

  // Procesar el objetivo general y sus objetivos específicos anidados
  ...(projectData.objective ? {
    objective: {
      ...(projectData.objective.id && { id: projectData.objective.id }),
      description: projectData.objective.description,
      type: projectData.objective.type,
      objetives: (projectData.objective.objetives || []).map(specificObj => ({
        ...(specificObj.id && { id: specificObj.id }),
        description: specificObj.description,
        type: specificObj.type,
        objetives: [] // Por ahora no soportamos más niveles de anidación
      }))
    }
  } : {}),

  project_keywords: projectData.project_keywords.map(kw => ({
    ...(kw.id && { id: kw.id }),
    name: kw.name
  })),

  participations: projectData.participations.map(p => ({
    ...(p.id && { id: p.id }),
    user_id: p.user_id,
    start_date: p.start_date,
    role: p.role,
    responsibility: p.responsibility,

    ...(p.end_date && p.end_date !== "" ? { end_date: p.end_date } : {})
  })),

  cooperation_list: projectData.cooperation_list.map(c => ({
    ...(c.id && { id: c.id }),
    type: c.type,
    ...(c.type === 'IN' && c.cooperator_id ? { cooperator_id: c.cooperator_id } : {}),
    ...(c.type === 'EX' && c.in_charge ? {
      in_charge: {
        ...(c.in_charge.id && { id: c.in_charge.id }),
        first_name: c.in_charge.first_name,
        last_name: c.in_charge.last_name,
        dni: c.in_charge.dni,
        ...(c.in_charge.group_or_entity ? { group_or_entity: c.in_charge.group_or_entity } : {})
      }
    } : {})
  }))


});

export const projectService = {

  async fetchProjects(name: string): Promise<Project[]> {
    try {
      const response = await api.get<Project[]>(`/projects/${name}?only_actives=false&all=true`);
      return response.data;
    } catch (error) {
      return handleApiError(
        error,
        ProjectServiceError,
        'Error al buscar proyectos. Por favor, intente nuevamente.'
      );
    }
  },

  async searchProjects(name: string): Promise<Project[]> {
    try {
      const response = await api.get<Project[]>(`/projects/${name}?only_actives=false`);
      return response.data;
    } catch (error) {
      return handleApiError(
        error,
        ProjectServiceError,
        'Error al buscar proyectos. Por favor, intente nuevamente.'
      );
    }
  },

  async createProject(projectData: Omit<Project, 'id'>): Promise<Project> {
    try {
      const formattedData = formatProjectData(projectData);
      const response = await api.post<Project>('/projects', formattedData);
      return response.data;
    } catch (error) {
      return handleApiError(
        error,
        ProjectServiceError,
        'Error al crear el proyecto. Por favor, intente nuevamente.'
      );
    }
  },

  async updateProject(id: number, projectData: Omit<Project, 'id'>): Promise<Project> {
    try {
      const formattedData = formatProjectData(projectData);
      const response = await api.put<Project>(`/projects/${id}`, formattedData);
      return response.data;
    } catch (error) {
      return handleApiError(
        error,
        ProjectServiceError,
        'Error al actualizar el proyecto. Por favor, intente nuevamente.'
      );
    }
  },

  async changeProjectStatus(id: number, status: string): Promise<string> {
    try {

      const allowed = ["AC", "IN", "EJ", "CN", "FN"];

      if (!allowed.includes(status)) {
        throw new Error("El estado debe ser alguno de: AC|IN|EJ|CN|FN")
      }

      const response = await api.patch<string>(`/projects/${id}?state=${status}`);
      return response.data;
    } catch (error) {
      return handleApiError(
        error,
        ProjectServiceError,
        'Error al ejecutar operación PATCH. Por favor, intente nuevamente.'
      );
    }
  },

  async searchKeywords(name: string): Promise<ProjectKeyword[]> {
    try {
      const response = await api.get<ProjectKeyword[]>(`/keywords/${name}`);
      return response.data;
    } catch (error) {
      return handleApiError(
        error,
        ProjectServiceError,
        'Error al ejecutar operación PATCH. Por favor, intente nuevamente.'
      );
    }
  },

  async searchInCharges(name: string): Promise<InCharge[]> {
    try {
      const response = await api.get<InCharge[]>(`/in_charges/${name}`);
      return response.data;
    } catch (error) {
      return handleApiError(
        error,
        ProjectServiceError,
        'Error al ejecutar operación PATCH. Por favor, intente nuevamente.'
      );
    }
  }
};