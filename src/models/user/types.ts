export interface User {
  _id: string;
  name: string;
  email: string;
  password: string;
  isAdmin: boolean;
}

export interface UserResponse {
  _id: string;
  name: string;
  email: string;
  isAdmin: boolean;
}