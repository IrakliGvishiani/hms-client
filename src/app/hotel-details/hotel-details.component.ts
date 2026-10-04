import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { HotelService } from '../services/hotel.service';
import { RoomService } from '../services/room.service';
import { HotelDetail } from '../models/hotel.models';
import { Room } from '../models/room.models';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-hotel-detail',
  standalone: true,
  imports: [CommonModule,FormsModule],
  templateUrl: './hotel-details.component.html',
  styleUrl: './hotel-details.component.scss'
})
export class HotelDetailComponent implements OnInit {
  hotel = signal<HotelDetail | null>(null);
  rooms = signal<Room[]>([]);
  loading = signal(false);
  currentImageIndex = signal(0)

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private hotelService: HotelService,
    private roomService: RoomService
  ) {}

    hotelId = 0;
  checkIn = '';
  checkOut = '';
  minPrice: number | null = null;
  maxPrice: number | null = null;
  searchError = signal('');
  today = new Date().toISOString().split('T')[0];

    ngOnInit(): void {
    this.hotelId = Number(this.route.snapshot.paramMap.get('id'));
    this.loadHotel(this.hotelId);
    this.loadRooms(this.hotelId);
  }

    searchRooms(): void {
    if (!this.checkIn || !this.checkOut) {
      this.searchError.set('Please select check-in and check-out dates');
      return;
    }
    if (this.checkOut <= this.checkIn) {
      this.searchError.set('Check-out must be after check-in');
      return;
    }
    this.searchError.set('');

    this.roomService.searchRooms({
      hotelId: this.hotelId,
      checkInDate: this.checkIn,
      checkOutDate: this.checkOut,
      minPrice: this.minPrice,
      maxPrice: this.maxPrice
    }).subscribe({
      next: (res) => this.rooms.set(res.result),
      error: () => this.searchError.set('Search failed')
    });
  }

  resetSearch(): void {
    this.checkIn = '';
    this.checkOut = '';
    this.minPrice = null;
    this.maxPrice = null;
    this.searchError.set('');
    this.loadRooms(this.hotelId);
  }

  loadHotel(id: number): void {
    this.loading.set(true);
    this.hotelService.getById(id).subscribe({
      next: (res) => {
        this.hotel.set(res.result);
        this.loading.set(false);
      },
      error: () => this.loading.set(false)
    });
  }

  loadRooms(id: number): void {
    this.roomService.getByHotelId(id).subscribe({
      next: (res) => this.rooms.set(res.result)
    });
  }

  viewRoom(roomId: number): void {
    this.router.navigate(['/rooms', roomId]);
  }

  nextImage(): void {
  const hotel = this.hotel();
  if (!hotel || hotel.images.length === 0) return;
  this.currentImageIndex.set((this.currentImageIndex() + 1) % hotel.images.length);
}

prevImage(): void {
  const hotel = this.hotel();
  if (!hotel || hotel.images.length === 0) return;
  this.currentImageIndex.set(
    (this.currentImageIndex() - 1 + hotel.images.length) % hotel.images.length
  );
}

goToImage(index: number): void {
  this.currentImageIndex.set(index);
}
}