export type UserRole = 'NOC_OPERATOR' | 'FIELD_ENGINEER' | 'NETWORK_MANAGER' | 'ADMIN';

export interface User {
  id: string;
  email: string;
  role: UserRole;
  created_at: string;
}