/**
 * MODELOS PARA PROYECTOS DE INVESTIGACIÓN
 */

import { ResearchLine, User } from "./GeneralModels";

/**
 * Modelo Objective - Objetivos específicos de un proyecto
 * - Se usa como parte del modelo Project
 */
export interface Objective {
    id: number;
    description: string;
    type: "GN" | string; // GN = General, podría tener otros valores
  }
  
  /**
   * Modelo ProjectKeyword - Palabras clave asociadas a un proyecto
   * - Se usa como parte del modelo Project
   */
  export interface ProjectKeyword {
    id: number;
    name: string;
  }
  
  /**
   * Modelo Participation - Participación de usuarios en proyectos
   * - Se usa como parte del modelo Project
   */
  export interface Participation {
    id: number;
    user: User;
    start_date: string; // formato date-time
    end_date: string; // formato date-time
    role: "JI" | string; // JI = Joven Investigador, podría tener otros valores
    responsibility: string;
    user_id: number;
  }
  
  /**
   * Modelo InCharge - Responsable de cooperación externa
   * - Se usa como parte del modelo Cooperation
   */
  export interface InCharge {
    id: number;
    first_name: string;
    last_name: string;
    dni: string;
    group_or_entity: string;
  }
  
  /**
   * Modelo Cooperation - Relaciones de cooperación del proyecto
   * - Se usa como parte del modelo Project
   */
  export interface Cooperation {
    id: number;
    in_charge: InCharge;
    cooperator: User;
    type: "EX" | string; // EX = Externa, podría tener otros valores
    cooperator_id: number;
  }
  
  /**
   * Modelo Project - Proyecto principal de investigación
   * - Contiene toda la estructura jerárquica de un proyecto
   */
  export interface Project {
    id: number;
    title: string;
    objectives: Objective[];
    project_keywords: ProjectKeyword[];
    participations: Participation[];
    cooperation_list: Cooperation[];
    code: string;
    description: string;
    creation_date: string; // formato date-time
    duration_days: number;
    schedule_url: string;
    status: "EJ" | string; // EJ = En ejecución, podría tener otros valores
    research_line: ResearchLine;
    convocation: string;
    has_financing: boolean;
    research_line_id: number;
  }