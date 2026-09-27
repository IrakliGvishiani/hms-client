import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { HotelService } from '../services/hotel.service';
import { RoomService } from '../services/room.service';
import { HotelDetail } from '../models/hotel.models';
import { Room } from '../models/room.models';

@Component({
  selector: 'app-hotel-detail',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './hotel-details.component.html',
  styleUrl: './hotel-details.component.scss'
})
export class HotelDetailComponent implements OnInit {
  hotel = signal<HotelDetail | null>(null);
  rooms = signal<Room[]>([]);
  loading = signal(false);

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private hotelService: HotelService,
    private roomService: RoomService
  ) {}

  ngOnInit(): void {
    const id = Number(this.route.snapshot.paramMap.get('id'));
    this.loadHotel(id);
    this.loadRooms(id);
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
}