export interface RoomDetails {
  id: number;
  name: string;
  price: number;
  primaryImageUrl: string;
  imageUrls: string[];
  hotelId: number;
}


export interface Room {
  id: number;
  name: string;
  price: number;
  primaryImageUrl: string;
  hotelId: number;
}