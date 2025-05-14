import { Classification, Link } from "./GeneralModels";


export interface GroupInformation {
  id: number;
  name: string;
  image_url: string;
  organization_image_url: string;
  slogan: string;
  code: string;
  clasiffications: Classification[]; // Default: empty array
  acronym: string;
  mission: string;
  vision: string;
  links: Link[]; // Default: empty array
}

export interface GroupMember {
  first_name: string;
  surname: string;
  email: string;
  entry_date: string; // ISO date string (e.g., "2025-05-12")
  interest_topics: string[]; // Default: empty array if not provided
  links: Link[]; // Default: empty array if not provided
  program_name: string;
  is_diurn_program: boolean;
  faculty_name: string;
  university_name: string;
  projects: string[]; 
  other_name: string | null;
  other_surname: string | null;
  faculty_place: string | null;
  image_url: string;
}

export interface GroupProduct {
  name: string;
  description: string;
  project: string;
  type: string;
  subtype: string | null;
}