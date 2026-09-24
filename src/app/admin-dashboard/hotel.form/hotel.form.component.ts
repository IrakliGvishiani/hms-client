import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { HotelService } from '../../services/hotel.service';
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

  constructor(
    private hotelService: HotelService,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit(): void {
    const idParam = this.route.snapshot.paramMap.get('id');
    if (idParam) {
      this.isEditMode.set(true);
      this.hotelId = Number(idParam);
      this.loadHotel(this.hotelId);
    }
  }

existingImages = signal<(HotelImage & { markedForDeletion: boolean })[]>([]);
selectedPrimaryImageId = signal<number | null>(null);

loadHotel(id: number): void {
  this.hotelService.getById(id).subscribe({
    next: (res) => {
      console.log('Hotel response:', res.result);

      this.name = res.result.name;
      this.rating = res.result.rating;
      this.country = res.result.country;
      this.city = res.result.city;
      this.address = res.result.address;

      const images = res.result.images ?? [];

      this.existingImages.set(
        images.map(img => ({
          ...img,
          markedForDeletion: false
        }))
      );

      const primaryImage = images.find(img => img.isPrimary);

      this.selectedPrimaryImageId.set(
        primaryImage?.id ?? null
      );
    },
    error: (err) => {
      console.error('Error while loading hotel:', err);
      this.errorMessage.set(
        err.error?.message ?? 'Error while loading hotel.'
      );
    }
  });
}

toggleDelete(imgId: number): void {

  this.existingImages.update(images =>
    images.map(image =>
      image.id === imgId
        ? {
            ...image,
            markedForDeletion: !image.markedForDeletion
          }
        : image
    )
  );

  const image = this.existingImages()
    .find(i => i.id === imgId);

  if (image?.isPrimary && !image.markedForDeletion) {
    this.selectedPrimaryImageId.set(null);
  }
}

  onFilesSelected(event: Event): void {
  const input = event.target as HTMLInputElement;

  if (!input.files || input.files.length === 0) {
    return;
  }

  const newFiles = Array.from(input.files);

  this.selectedFiles = [
    ...this.selectedFiles,
    ...newFiles
  ];

  this.selectedFilePreviews = [
    ...this.selectedFilePreviews,
    ...newFiles.map(file => URL.createObjectURL(file))
  ];

  
  input.value = '';
}

removeSelectedFile(index: number): void {
  URL.revokeObjectURL(this.selectedFilePreviews[index]);

  this.selectedFiles = this.selectedFiles.filter(
    (_, i) => i !== index
  );

  this.selectedFilePreviews = this.selectedFilePreviews.filter(
    (_, i) => i !== index
  );
}

setPrimary(imageId: number): void {
  this.selectedPrimaryImageId.set(imageId);

  this.existingImages.update(images =>
    images.map(image => ({
      ...image,
      isPrimary: image.id === imageId
    }))
  );
}

 onSubmit(): void {
  this.errorMessage.set(null);
  this.loading.set(true);

  if (this.isEditMode() && this.hotelId) {
    const idsToDelete = this.existingImages().filter(i => i.markedForDeletion).map(i => i.id);

    this.hotelService.update(this.hotelId, this.name, this.rating, this.address, this.selectedFiles, idsToDelete,this.selectedPrimaryImageId()).subscribe({
      next: () => {
        this.loading.set(false);
        this.router.navigate(['/admin/hotels']);
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
 }}