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
  userName: string; // რეალურად email-ს ჩაწერთ აქ
  password: string;
}