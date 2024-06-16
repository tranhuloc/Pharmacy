export type AuthResponse = {
  access_token: string;
  refresh_token: string;
  token: string;
  type: string;
  id: number;
  username: string;
  email: string;
  roles: string[];
};

export type AuthRequestLogin = {
  email: string | null;
  password: string | null;
  isAdmin: boolean;
};

export type AuthChangePassword = {
  email: string;
  currentPassword: string;
  newPassword: string;
};

export type AuthInfoUserResponse = {
  id: number;
  username: string;
  email: string;
  birthday: Date;
  fullName: string;
  branchId: string;
  branchName: string;
  roles: string[];
  managerId: number;
  leadId: number;
  userManagerResource: number[];
  userManagerResourceDetail: ManagerResourceDetailResponse[];
  usersWithLead: number[];
  usersWithManagement: number[];
};

export type ManagerResourceDetailResponse = {
  userId: number;
  projectId: number;
  projectName: string;
  role: RoleResponse;
  managerId: number;
  leadId: number;
};

export type RoleResponse = {
  id: number;
  name: string;
};