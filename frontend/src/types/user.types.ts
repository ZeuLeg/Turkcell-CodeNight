export type BackendRole = 'NOC' | 'FIELD_ENGINEER' | 'ADMIN' | 'MANAGER';

export interface BackendUser {
  id: string;
  email: string;
  role: BackendRole;
}
