import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { HotelService } from '../../services/hotel.service';
import { ManagerService } from '../../services/manager.service';
import { AuthService } from '../../services/auth.service';
import { HotelImage } from '../../models/hotel.models';

@Component({
  selector: 'app-hotel-form',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './hotel.form.component.html',
  styleUrl: './hotel.form.component.scss'
})
export class HotelFormComponent implements OnInit {
  isEditMode = signal(false);
  isManager = signal(false);
  hotelId: number | null = null;

  name = '';
  rating = 5;
  country = '';
  city = '';
  address = '';
  selectedFiles: File[] = [];
  selectedFilePreviews: string[] = [];

  errorMessage = signal<string | null>(null);
  loading = signal(false);

  existingImages = signal<(HotelImage & { markedForDeletion: boolean })[]>([]);
  selectedPrimaryImageId = signal<number | null>(null);

  constructor(
    private hotelService: HotelService,
    private managerService: ManagerService,
    private authService: AuthService,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit(): void {
    const role = this.authService.role();

    if (role === 'Manager') {
      this.isManager.set(true);
      this.isEditMode.set(true);
      this.loading.set(true);

      this.managerService.getHotelAnalytics().subscribe({
        next: (res) => {
          this.hotelId = res.result.hotelId;
          if (this.hotelId) {
            this.loadHotel(this.hotelId);
          } else {
            this.loading.set(false);
            this.errorMessage.set('No hotel assigned to your account.');
          }
        },
        error: (err) => {
          this.loading.set(false);
          this.errorMessage.set(err.error?.message ?? 'Error while loading your hotel.');
        }
      });
      return;
    }

    const idParam = this.route.snapshot.paramMap.get('id');
    if (idParam) {
      this.isEditMode.set(true);
      this.hotelId = Number(idParam);
      this.loadHotel(this.hotelId);
    }
  }

  loadHotel(id: number): void {
    this.loading.set(true);

    this.hotelService.getById(id).subscribe({
      next: (res) => {
        this.name = res.result.name;
        this.rating = res.result.rating;
        this.country = res.result.country;
        this.city = res.result.city;
        this.address = res.result.address;

        const images = res.result.images ?? [];

        this.existingImages.set(
          images.map(img => ({ ...img, markedForDeletion: false }))
        );

        const primaryImage = images.find(img => img.isPrimary);
        this.selectedPrimaryImageId.set(primaryImage?.id ?? null);

        this.loading.set(false);
      },
      error: (err) => {
        this.loading.set(false);
        this.errorMessage.set(err.error?.message ?? 'Error while loading hotel.');
      }
    });
  }

  toggleDelete(imgId: number): void {
    this.existingImages.update(images =>
      images.map(image =>
        image.id === imgId
          ? { ...image, markedForDeletion: !image.markedForDeletion }
          : image
      )
    );

    const image = this.existingImages().find(i => i.id === imgId);

    if (image?.isPrimary && !image.markedForDeletion) {
      this.selectedPrimaryImageId.set(null);
    }
  }

  onFilesSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (!input.files || input.files.length === 0) return;

    const newFiles = Array.from(input.files);

    this.selectedFiles = [...this.selectedFiles, ...newFiles];
    this.selectedFilePreviews = [
      ...this.selectedFilePreviews,
      ...newFiles.map(file => URL.createObjectURL(file))
    ];

    input.value = '';
  }

  removeSelectedFile(index: number): void {
    URL.revokeObjectURL(this.selectedFilePreviews[index]);
    this.selectedFiles = this.selectedFiles.filter((_, i) => i !== index);
    this.selectedFilePreviews = this.selectedFilePreviews.filter((_, i) => i !== index);
  }

  setPrimary(imageId: number): void {
    this.selectedPrimaryImageId.set(imageId);

    this.existingImages.update(images =>
      images.map(image => ({ ...image, isPrimary: image.id === imageId }))
    );
  }

  onSubmit(): void {
    this.errorMessage.set(null);
    this.loading.set(true);

    if (this.isEditMode() && this.hotelId) {
      const idsToDelete = this.existingImages().filter(i => i.markedForDeletion).map(i => i.id);

      this.hotelService.update(
        this.hotelId,
        this.name,
        this.rating,
        this.address,
        this.selectedFiles,
        idsToDelete,
        this.selectedPrimaryImageId()
      ).subscribe({
        next: () => {
          this.loading.set(false);
          this.router.navigate([this.getBackRoute()]);
        },
        error: (err) => {
          this.loading.set(false);
          this.errorMessage.set(err.error?.message ?? 'Error While Updating');
        }
      });
    } else {
      this.hotelService.create(this.name, this.rating, this.country, this.city, this.address, this.selectedFiles).subscribe({
        next: () => {
          this.loading.set(false);
          this.router.navigate(['/admin/hotels']);
        },
        error: (err) => {
          this.loading.set(false);
          this.errorMessage.set(err.error?.message ?? 'Error While Creating');
        }
      });
    }
  }

  private getBackRoute(): string {
    return this.isManager() ? '/manager/hotel' : '/admin/hotels';
  }
}