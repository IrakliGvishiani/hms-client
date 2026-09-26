export interface ManagerListForGettingDto {
  id: number;
  firstName: string;
  lastName: string;
  personalNumber: string;
  email: string;
  phoneNumber: string;
  hotelId: number;    
  hotelName: string;
}

export interface ManagerProfile {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  personalNumber: string;
  phoneNumber: string;
  hotelName: string;
  hotelId: number;
}
export interface ManagerForUpdatingDto {
  id: number;
  firstName: string;
  lastName: string;
  personalNumber: string;
  phoneNumber: string;
}

export interface ManagerRegistrationRequestDto {
  firstName: string;
  lastName: string;
  personalNumber: string;
  email: string;
  password: string;
  phoneNumber: string;
  hotelId: number;
}

export interface HotelAnalyticsDto {
  hotelId: number;
  totalRooms: number;
  availableRooms: number;
  reservedRooms: number;
  occupiedRooms: number;
  totalReservations: number;
  activeReservations: number;
  cancelledReservations: number;
  completedReservations: number;
  totalGuests: number;
  totalRevenue: number;
}