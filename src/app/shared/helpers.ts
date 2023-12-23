export enum Role {
  User = 'User',
  Admin = 'Admin',
}

export class User2 {
  id?: number;
  name?: string;
  password?: string;
  role?: Role;

  constructor() {}
}

export interface User {
  id: number;
  firstName: string;
  lastName: string;
  userName: string;
  email: string;
  role: Role;
  accessToken?: string;
  //refreshToken: string;
  refreshToken: string;
  update_date: Date;
}

export class UserInfo {
  access_token: string;
  refresh_token: string;
  role: Role;

  constructor(access_token: string, refresh_token: string, role: Role) {
    this.access_token = access_token;
    this.refresh_token = refresh_token;
    this.role = role;
  }
}
