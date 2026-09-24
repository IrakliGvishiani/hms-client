import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { HotelService } from '../../services/hotel.service';
import { Hotel } from '../../models/hotel.models';

@Component({
  selector: 'app-hotel-list',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './hotel.list.component.html',
  styleUrl: './hotel.list.component.scss'
})
export class HotelListComponent implements OnInit {
  hotels = signal<Hotel[]>([]);
  totalCount = signal(0);
  pageNumber = signal(1);
  pageSize = 10;
  loading = signal(false);

  constructor(private hotelService: HotelService) {}

  ngOnInit(): void {
    this.loadHotels();
  }

  loadHotels(): void {
    this.loading.set(true);
    this.hotelService.getList({ pageNumber: this.pageNumber(), pageSize: this.pageSize }).subscribe({
      next: (res) => {
        this.hotels.set(res.result.items);
        this.totalCount.set(res.result.totalCount);
        this.loading.set(false);
      },
      error: () => this.loading.set(false)
    });
  }

  onDelete(id: number): void {
    if (!confirm('Are You Sure You Want to delete hotel?')) return;

    this.hotelService.delete(id).subscribe({
      next: () => this.loadHotels()
    });
  }

  nextPage(): void {
    if (this.pageNumber() * this.pageSize < this.totalCount()) {
      this.pageNumber.set(this.pageNumber() + 1);
      this.loadHotels();
    }
  }

  prevPage(): void {
    if (this.pageNumber() > 1) {
      this.pageNumber.set(this.pageNumber() - 1);
      this.loadHotels();
    }
  }
}