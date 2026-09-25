import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ReservationService } from '../../../services/reservation.service';
import { HotelService } from '../../../services/hotel.service';
import { RoomService } from '../../../services/room.service';
import { GuestService } from '../../../services/guest.service';
import { Hotel } from '../../../models/hotel.models';
import { Room } from '../../../models/room.models';
import { Guest } from '../../../models/guest.models';

@Component({
  selector: 'app-reservation-form',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './reservation.form.component.html',
  styleUrl: './reservation.form.component.scss'
})
export class ReservationFormComponent implements OnInit {
  isEditMode = signal(false);
  reservationId: number | null = null;

  hotels = signal<Hotel[]>([]);
  rooms = signal<Room[]>([]);
  guests = signal<Guest[]>([]);

  selectedHotelId: number | null = null;
  selectedRoomIds: number[] = [];
  selectedGuestId: number | null = null;
  checkInDate = '';
  checkOutDate = '';

  errorMessage = signal<string | null>(null);
  loading = signal(false);

  constructor(
    private reservationService: ReservationService,
    private hotelService: HotelService,
    private roomService: RoomService,
    private guestService: GuestService,
    private route: ActivatedRoute,
    private router: Router
  ) {}

readOnlyGuestName = '';
readOnlyHotelName = '';
  loadReservation(id: number): void {
  this.loading.set(true);

  this.reservationService.getById(id).subscribe({
    next: (res) => {
      this.checkInDate = res.result.checkInDate.substring(0, 10); // YYYY-MM-DD ფორმატისთვის <input type="date">
      this.checkOutDate = res.result.checkOutDate.substring(0, 10);
      this.readOnlyGuestName = res.result.guestName;
      this.readOnlyHotelName = res.result.hotelName;
      this.loading.set(false);
    },
    error: (err) => {
      this.loading.set(false);
      this.errorMessage.set(err.error?.message ?? 'Error While Uploading');
    }
  });
}

  ngOnInit(): void {
  const idParam = this.route.snapshot.paramMap.get('id');

  if (idParam) {
    this.isEditMode.set(true);
    this.reservationId = Number(idParam);
    this.loadReservation(this.reservationId);
  } else {
    this.hotelService.getList({ pageNumber: 1, pageSize: 100 }).subscribe({
      next: (res) => this.hotels.set(res.result.items)
    });

    this.guestService.getAll().subscribe({
      next: (res) => this.guests.set(res.result)
    });
  }
}
  onHotelChange(): void {
    this.selectedRoomIds = [];
    if (!this.selectedHotelId) {
      this.rooms.set([]);
      return;
    }

    this.roomService.getByHotelId(this.selectedHotelId).subscribe({
      next: (res) => this.rooms.set(res.result)
    });
  }

  onSubmit(): void {
    this.errorMessage.set(null);
    this.loading.set(true);

    if (this.isEditMode() && this.reservationId) {
      this.reservationService.update({
        id: this.reservationId,
        checkInDate: this.checkInDate,
        checkOutDate: this.checkOutDate
      }).subscribe({
        next: () => {
          this.loading.set(false);
          this.router.navigate(['/admin/reservations']);
        },
        error: (err) => {
          this.loading.set(false);
          this.errorMessage.set(err.error?.message ?? 'Error While Updating');
        }
      });
    } else {
      if (!this.selectedGuestId) {
        this.errorMessage.set('Guest Field Is Required');
        this.loading.set(false);
        return;
      }
      if (this.selectedRoomIds.length === 0) {
        this.errorMessage.set('Choose minimum 1 room');
        this.loading.set(false);
        return;
      }

      this.reservationService.create({
        checkInDate: this.checkInDate,
        checkOutDate: this.checkOutDate,
        roomIds: this.selectedRoomIds,
        guestId: this.selectedGuestId
      }).subscribe({
        next: () => {
          this.loading.set(false);
          this.router.navigate(['/admin/reservations']);
        },
        error: (err) => {
          this.loading.set(false);
          this.errorMessage.set(err.error?.message ?? 'Error While Creating');
        }
      });
    }
  }
}