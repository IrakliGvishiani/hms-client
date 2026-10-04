export enum ReservationStatus {
  Reserved = 0,
  Active = 1,
  Completed = 2,
  Cancelled = 3
}
export interface ReservationRoomInfo {
  roomId: number;
  roomName: string;
  pricePerNight: number;
}

export interface ReservationForCreatingDto {
  checkInDate: string;
  checkOutDate: string;
  roomIds: number[];
  guestId?: number | null;
}

export interface ReservationForGettingDto {
  id: number;
  checkInDate: string;
  checkOutDate: string;
  guestId: number;
  guestName: string;
  guestPhoneNumber: string;
  roomIds: number[];
  rooms: ReservationRoomInfo[];
  hotelId: number;
  hotelName: string;
  nights: number;
  totalPrice: number;
  status: ReservationStatus;
}

export interface ReservationForUpdatingDto {
  id: number;
  checkInDate: string;
  checkOutDate: string;
}

export interface ReservationSearchDto {
  hotelId?: number | null;
  guestId?: number | null;
  roomId?: number | null;
  date?: string | null;
  active?: boolean | null;
}

export interface Guest {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
}