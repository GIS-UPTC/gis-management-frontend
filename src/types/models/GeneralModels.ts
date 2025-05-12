// models/types.ts - Modelos base para el sistema GIS

import { Project } from "./project.models";

/**
 * MODELOS PARA UBICACIONES Y ENTIDADES ACADÉMICAS
 * Estos modelos representan la estructura jerárquica de entidades académicas
 */

/**
 * Modelo Place - Ubicación
 * Utilizado para representar ubicaciones geográficas en varios contextos
 * - Como parte de University, Faculty y otros modelos que requieren ubicación
 * - No hay endpoint directo para CRUD, solo se usa como parte de otras entidades
 */
export interface Place {
  id: number;
  name: string;
  place: Place | null;
}

/**
 * Modelo University - Universidad
 * - Representa una institución universitaria
 * - No hay endpoint directo para CRUD, solo se usa como parte de Faculty
 */
export interface University {
  id: number;
  name: string;
  place: Place;
}

/**
 * Modelo Faculty - Facultad
 * - Representa una facultad universitaria
 * - No hay endpoint directo para CRUD, solo se usa como parte de Program
 */
export interface Faculty {
  id: number;
  name: string;
  university: University;
  place: Place | null;
}

/**
 * Modelo Program - Programa académico
 * - Representa un programa de estudio dentro de una facultad
 * - Se usa en:
 *   - GET /api/v1/programs/{name}: Para búsqueda de programas por nombre
 *   - Como parte de GroupParticipation para usuarios
 */
export interface Program {
  id: number;
  name: string;
  faculty: Faculty;
  is_diurn: boolean;
}

/**
 * MODELOS PARA INFORMACIÓN DE PERFIL DE USUARIO
 * Estos modelos representan elementos asociados al perfil de un usuario
 */

/**
 * Modelo Link - Enlaces asociados al perfil
 * - Se usa en:
 *   - Como parte del modelo User para crear (POST) y actualizar (PUT) usuarios
 *   - Representa enlaces personales o profesionales del usuario
 */
export interface Link {
  id: number;
  name: string;
  link: string;
}

/**
 * Modelo InterestTopic - Tópicos de interés del usuario
 * - Se usa en:
 *   - GET /api/v1/interest_topics/{name}: Para búsqueda de tópicos por nombre
 *   - Como parte del modelo User para crear (POST) y actualizar (PUT) usuarios
 */
export interface InterestTopic {
  id: number;
  description: string;
}

/**
 * MODELOS PARA PARTICIPACIÓN Y RESPONSABILIDADES
 * Estos modelos representan la participación de usuarios en grupos y sus responsabilidades
 */

/**
 * Modelo Responsibility - Responsabilidades dentro de un grupo
 * - Se usa como parte de GroupParticipation
 * - Define las responsabilidades asignadas a un usuario en un grupo específico
 */
export interface Responsability {
  id: number;
  description: string;
}

/**
 * Modelo GroupParticipation - Participación en grupos de investigación o académicos
 * - Se usa como parte del modelo User para crear (POST) y actualizar (PUT) usuarios
 * - Define la participación de un usuario en un programa académico o grupo de investigación
 */
export interface GroupParticipation {
  id: number;
  responsibilities: Responsability[];
}

/**
 * MODELOS PARA CONTROL DE ACCESO Y PERMISOS
 * Estos modelos representan el sistema de permisos y roles
 */

/**
 * Modelo Access - Accesos del sistema
 * - Se usa en:
 *   - GET /api/v1/accesses/{name}: Para búsqueda de accesos por nombre
 *   - Como parte del modelo Role para crear (POST) y actualizar (PUT) roles
 */
export interface Access {
  id: number;
  name: string;
}

/**
 * Modelo Permission - Permisos específicos
 * - Se usa en:
 *   - GET /api/v1/permissions/{name}: Para búsqueda de permisos por nombre
 *   - Como parte de RoleGranting para asignar permisos específicos a usuarios
 */
export interface Permission {
  id: number;
  name: string;
  description: string;
}

/**
 * Modelo Role - Roles del sistema
 * - Se usa en:
 *   - POST /api/v1/roles/: Para crear nuevos roles
 *   - PUT /api/v1/roles/{id}: Para actualizar roles existentes
 *   - PATCH /api/v1/roles/{id}: Para desactivar roles
 *   - GET /api/v1/roles/{name}: Para búsqueda de roles por nombre
 */
export interface Role {
  id: number;
  name: string;
  is_active: boolean;
  accesses: Access[];
}

/**
 * Modelo RoleGranting - Asignación de roles y permisos a usuarios
 * - Se usa como parte del modelo User para crear (POST) y actualizar (PUT) usuarios
 * - Define los roles y permisos específicos asignados a un usuario
 */
export interface RoleGranting {
  id: number;
  role: Role;
  permissions: Permission[];
}

/**
 * MODELO PRINCIPAL DE USUARIO
 */

/**
 * Modelo User - Usuario principal del sistema
 * - Se usa en:
 *   - POST /api/v1/users/: Para crear nuevos usuarios
 *   - PUT /api/v1/users/{id}: Para actualizar usuarios existentes
 *   - GET /api/v1/users/{name}: Para búsqueda de usuarios por nombre
 */
export interface User {
  id: number;
  dni: string;
  first_name: string;
  email: string;
  surname: string;
  birthdate: string; // formato date-time
  photo_url: string;
  entry_date: string; // formato date-time
  links: Link[];
  is_Active: boolean; // nota: mantiene la mayúscula como en la API
  deparure_date?: string; // formato date-time (hay un typo en la API, debería ser departure_date)
  other_name?: string;
  other_surname?: string;
  interest_topics: InterestTopic[];
  participations: GroupParticipation[];
  responsabilities: Responsability[];
  program: Program;
  role_granting_list: RoleGranting[];
  is_group_leader: boolean;
  is_main_researcher: boolean;
}

/**
 * MODELOS PARA PETICIONES ESPECÍFICAS
 * Estos modelos representan el cuerpo de las peticiones a endpoints específicos
 */

/**
 * Modelo LoginRequest - Petición de inicio de sesión
 * - Se usa en:
 *   - POST /api/v1/auth/: Para iniciar sesión y obtener un token JWT
 */
export interface LoginRequest {
  email: string;
  password: string;
}

/**
 * Modelo ChangePasswordRequest - Petición de cambio de contraseña
 * - Se usa en:
 *   - PATCH /api/v1/users/{id}: Para cambiar la contraseña de un usuario
 */
export interface ChangePasswordRequest {
  user_id: number;
  new_password: string;
}

/**
 * MODELOS PARA RESPUESTAS DE ERROR
 * Estos modelos representan las estructuras de error que puede devolver la API
 */

/**
 * Modelo ValidationError - Error de validación individual
 * - Se usa para interpretar errores de validación devueltos por la API
 * - Contiene información sobre la ubicación del error, el mensaje y el tipo de error
 */
export interface ValidationError {
  loc: (string | number)[];
  msg: string;
  type: string;
}

/**
 * Modelo HttpValidationError - Contenedor de errores de validación
 * - Se usa para manejar la respuesta de error 422 de la API
 * - Contiene una lista de errores de validación específicos
 */
export interface HttpValidationError {
  detail: ValidationError[];
}

/**
 * Modelo SearchParams - Parámetros de búsqueda
 * - Se usa en:
 *   - GET /api/v1/users: Para filtrar y buscar usuarios
 */
export interface SearchParams {
  name?: string;
  email?: string;
  dni?: string;
  is_active?: boolean;
  page?: number;
  page_size?: number;
}

export interface Classification {
  classification: string;
  year: number;
}

export interface ResearchLine {
  id: number;
  name: string;
  is_active: boolean;
  coordinator: User;
}

export interface ChangePasswordResponse {
  userId: number,
  newPassword: string,
}

export interface Progress {
  id: number;
  user: User;
  project: Project;
  date: string | null;
  type: "PI" | "OI" | "IF" | "FI";
  document_link: string | null,
  description: string | null;
  user_id: number;
  project_id: number;
}

export interface Report {
  format: 'PDF' | 'XLSX';
  report_type: 'TPR' | 'PRL' | 'TPD' | 'PDP' | 'TAV' | 'AVP' | 'AVU' | 'APU';
  start_date: string;
  end_date: string;
  project_id?: number | null;
  researcher_id?: number | null;
  line_id?: number | null;
}

export interface Product {
  code: string;
  name: string;
  description: string;
  type: Type;
  project?: Project;
  url: string;
  complementary_information: string | null;
  project_id: number;
}

export interface Type {
  id: number | null;
  name: string;
  subtype_id: number | null;
  subtype_name: string | null;
}