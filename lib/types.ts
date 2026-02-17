export interface User {
  id: number;
  email: string;
}

export interface AuthResponse {
  access_token: string;
  token_type: string;
}

export interface Resume {
  id: number;
  original_filename: string;
  created_at: string;
}

export interface Job {
  id: number;
  title: string;
  description: string;
  skills: string[];
  created_at: string;
}

export interface JobRequest {
  title: string;
  description: string;
  skills: string[];
}

export interface MatchResult {
  resume_id: number;
  score: number;
  explanation?: string;
}