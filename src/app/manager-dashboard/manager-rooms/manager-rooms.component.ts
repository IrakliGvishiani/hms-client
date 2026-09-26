import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { ManagerService } from '../../services/manager.service';
import { RoomService } from '../../services/room.service';
import { Room } from '../../models/room.models';

@Component({
  selector: 'app-manager-rooms',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './manager-rooms.component.html',
  styleUrl: './manager-rooms.component.scss'
})
export class ManagerRoomsComponent implements OnInit {
  rooms = signal<Room[]>([]);
  hotelId = signal<number | null>(null);
  loading = signal(false);
  errorMessage = signal<string | null>(null);

  constructor(
    private managerService: ManagerService,
    private roomService: RoomService
  ) {}

  ngOnInit(): void {
    this.loading.set(true);

    this.managerService.getHotelAnalytics().subscribe({
      next: (res) => {
        this.hotelId.set(res.result.hotelId);
        this.loadRooms(res.result.hotelId);
      },
      error: (err) => {
        this.loading.set(false);
        this.errorMessage.set(err.error?.message ?? 'Error');
      }
    });
  }

  loadRooms(hotelId: number): void {
    this.roomService.getByHotelId(hotelId).subscribe({
      next: (res) => {
        this.rooms.set(res.result);
        this.loading.set(false);
      },
      error: () => this.loading.set(false)
    });
  }

  onDelete(id: number): void {
    if (!confirm('Delete this Room?')) return;

    this.roomService.delete(id).subscribe({
      next: () => this.loadRooms(this.hotelId()!)
    });
  }
}