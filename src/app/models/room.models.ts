export interface Room {
  id: number;
  name: string;
  price: number;
  primaryImageUrl: string | null;
  hotelId: number;
}

export interface RoomImage {
  id: number;
  url: string;
  isPrimary: boolean;
}

export interface RoomDetails {
  id: number;
  name: string;
  price: number;
  primaryImageUrl: string | null;
  images: RoomImage[];
  hotelId: number;
}

export interface RoomForUpdating {
  id: number;
  name: string;
  price: number;
}