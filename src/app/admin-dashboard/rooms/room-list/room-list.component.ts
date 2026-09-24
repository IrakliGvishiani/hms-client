import { Component, OnInit, signal } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { RoomService } from '../../../services/room.service';
import { Room } from '../../../models/room.models';

@Component({
  selector: 'app-room-list',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './room-list.component.html',
  styleUrl: './room-list.component.scss'
})
export class RoomListComponent implements OnInit {

  hotelId: number = 0;

  rooms = signal<Room[]>([]);
  loading = signal(false);
  errorMessage = signal<string | null>(null);

  constructor(
    private route: ActivatedRoute,
    private roomService: RoomService
  ) {}

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('hotelId');

    if (!id) {
      this.errorMessage.set('Hotel ID was not provided.');
      return;
    }

    this.hotelId = Number(id);

    this.loadRooms();
  }

  loadRooms(): void {
    this.loading.set(true);
    this.errorMessage.set(null);

    this.roomService.getByHotelId(this.hotelId).subscribe({
      next: (res) => {
        this.rooms.set(res.result);
        this.loading.set(false);
      },
      error: (err) => {
        this.loading.set(false);
        this.errorMessage.set(
          err.error?.message ?? 'Error while loading rooms.'
        );
      }
    });
  }
}