import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { HotelService } from '../services/hotel.service';
import { Hotel } from '../models/hotel.models';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss'
})
export class HomeComponent implements OnInit {
  hotels = signal<Hotel[]>([]);
  loading = signal(false);
  searchTerm = '';
  pageNumber = signal(1);
  pageSize = 9;
  totalCount = signal(0);

  constructor(private hotelService: HotelService, private router: Router) {}

  ngOnInit(): void {
    this.loadHotels();
  }

  loadHotels(): void {
    this.loading.set(true);

    this.hotelService.getList({
      pageNumber: this.pageNumber(),
      pageSize: this.pageSize,
      filterBy: this.searchTerm || undefined
    }).subscribe({
      next: (res) => {
        this.hotels.set(res.result.items);
        this.totalCount.set(res.result.totalCount);
        this.loading.set(false);
      },
      error: () => this.loading.set(false)
    });
  }

  onSearch(): void {
    this.pageNumber.set(1);
    this.loadHotels();
  }

  viewDetails(hotelId: number): void {
    this.router.navigate(['/hotels', hotelId]);
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