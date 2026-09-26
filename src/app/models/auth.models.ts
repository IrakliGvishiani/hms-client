export interface LoginRequest {
  userName: string;
  password: string;
}

export interface LoginResponse {
  accessToken: string;
  refreshToken: string;
}

export interface ApiResponse<T> {
  message: string;
  result: T;
  isSuccess: boolean;
  httpStatusCode: number;
}

export interface LoginRequest {
  userName: string; // EMAIL
  password: string;
}

export interface ResetPasswordRequest {
  email: string;
  token: string;
  newPassword: string;
}

export interface ConfirmEmailRequest {
  email: string;
  code: string;
}

export interface AdminRegistrationRequest {
  firstName: string;
  lastName: string;
  personalNumber: string;
  email: string;
  password: string;
  phoneNumber: string;
}