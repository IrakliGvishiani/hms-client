export interface HotelAnalytics {
  hotelId: number | null;

  totalRooms: number;
  availableRooms: number;
  reservedRooms: number;
  occupiedRooms: number;

  totalReservations: number;
  activeReservations: number;
  completedReservations: number;
  cancelledReservations: number;

  totalGuests: number;

  totalRevenue: number;
}