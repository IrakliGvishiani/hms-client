export interface Hotel {
  id: number;
  name: string;
  rating: number;
  country: string;
  address: string;
  city: string;
  primaryImageUrl: string | null;
}

export interface HotelImage {
  id: number;
  url: string;
  isPrimary: boolean;
}

export interface HotelDetail extends Hotel {
  images: HotelImage[];
}

export interface HotelForUpdating {
  id: number;
  name: string;
  address: string;
  rating: number;
}

export interface PagedRequest {
  pageNumber: number;
  pageSize: number;
  sortBy?: string;
  ascending?: boolean;
  filterBy?: string;
}

export interface PagedResponse<T> {
  items: T[];
  totalCount: number;
  pageNumber: number;
  pageSize: number;
}