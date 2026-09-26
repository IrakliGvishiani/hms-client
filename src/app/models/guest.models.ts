export interface Guest {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  personalNumber: string;
  phoneNumber: string;
}

export interface GuestRegistrationRequest {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  personalNumber: string;
  phoneNumber: string;
}