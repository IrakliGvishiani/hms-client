import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';

import { RoomService } from '../../../services/room.service';
import { RoomImage } from '../../../models/room.models';
import { ManagerService } from '../../../services/manager.service';
import { AuthService } from '../../../services/auth.service';

@Component({
  selector: 'app-room-form',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './room.form.component.html',
  styleUrl: './room.form.component.scss'
})
export class RoomFormComponent implements OnInit {

  isEditMode = signal(false);

  hotelId: number | null = null;
  roomId: number | null = null;

  name = '';
  price = 0;

  selectedFiles: File[] = [];
  selectedFilePreviews: string[] = [];

  existingImages = signal<
    (RoomImage & { markedForDeletion: boolean })[]
  >([]);

  selectedPrimaryImageId = signal<number | null>(null);

  loading = signal(false);
  errorMessage = signal<string | null>(null);

  constructor(
    private roomService: RoomService,
    private route: ActivatedRoute,
    private router: Router,
    private managerService: ManagerService,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
  const roomIdParam = this.route.snapshot.paramMap.get('roomId');

  if (roomIdParam) {
    this.isEditMode.set(true);
    this.roomId = Number(roomIdParam);
  }

  if (this.authService.role() === 'Manager') {

    this.managerService.getOwnProfile().subscribe({
      next: (res) => {
        this.hotelId = res.result.hotelId;

        if (this.isEditMode() && this.roomId) {
          this.loadRoom(this.roomId);
        }
      },
      error: (err) => {
        this.errorMessage.set(
          err.error?.message ?? 'Unable to load manager profile.'
        );
      }
    });

  } else {

    const hotelId = this.getHotelIdFromRoute();

    if (!hotelId) {
      this.errorMessage.set('Hotel ID was not provided.');
      return;
    }

    this.hotelId = hotelId;

    if (this.isEditMode() && this.roomId) {
      this.loadRoom(this.roomId);
    }
  }
}
private getHotelIdFromRoute(): number | null {
  let currentRoute: ActivatedRoute | null = this.route;

  while (currentRoute) {
    const hotelId = currentRoute.snapshot.paramMap.get('hotelId');

    if (hotelId) {
      return Number(hotelId);
    }

    currentRoute = currentRoute.parent;
  }

  return null;
}

  loadRoom(id: number): void {

    this.loading.set(true);
    this.errorMessage.set(null);

    this.roomService.getDetails(id).subscribe({
      next: (res) => {

        const room = res.result;

        this.name = room.name;
        this.price = room.price;

        const images = (room.images ?? []).map(image => ({
          ...image,
          markedForDeletion: false
        }));

        this.existingImages.set(images);

        const primaryImage = images.find(
          image => image.isPrimary
        );

        this.selectedPrimaryImageId.set(
          primaryImage?.id ?? null
        );

        this.loading.set(false);
      },

      error: (err) => {

        this.loading.set(false);

        this.errorMessage.set(
          err.error?.message ??
          'Error while loading room.'
        );
      }
    });
  }

  toggleDelete(imageId: number): void {

    this.existingImages.update(images =>
      images.map(image =>
        image.id === imageId
          ? {
              ...image,
              markedForDeletion: !image.markedForDeletion
            }
          : image
      )
    );

    

    const image = this.existingImages()
      .find(image => image.id === imageId);

    if (image?.isPrimary && image.markedForDeletion) {
      const fallbackPrimary = this.existingImages()
        .find(candidate =>
          !candidate.markedForDeletion &&
          candidate.id !== imageId
        );

      this.selectedPrimaryImageId.set(
        fallbackPrimary?.id ?? null
      );

      this.existingImages.update(images =>
        images.map(candidate => ({
          ...candidate,
          isPrimary: candidate.id === fallbackPrimary?.id
        }))
      );
    }
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
      ...newFiles.map(file =>
        URL.createObjectURL(file)
      )
    ];

    input.value = '';
  }

  removeSelectedFile(index: number): void {

    URL.revokeObjectURL(
      this.selectedFilePreviews[index]
    );

    this.selectedFiles =
      this.selectedFiles.filter(
        (_, i) => i !== index
      );

    this.selectedFilePreviews =
      this.selectedFilePreviews.filter(
        (_, i) => i !== index
      );
  }

  goBack(): void {
  if (this.authService.role() === 'Manager') {
    this.router.navigate(['/manager/rooms']);
  } else {
    this.router.navigate([
      '/admin/hotels',
      this.hotelId,
      'rooms'
    ]);
  }
}

private navigateToRooms(): void {
  if (this.authService.role() === 'Manager') {
    this.router.navigate(['/manager/rooms']);
  } else {
    this.router.navigate([
      '/admin/hotels',
      this.hotelId,
      'rooms'
    ]);
  }
}
  onSubmit(): void {

    this.errorMessage.set(null);

    if (!this.name.trim()) {
      this.errorMessage.set(
        'Room name is required.'
      );
      return;
    }

    if (this.price <= 0) {
      this.errorMessage.set(
        'Room price must be greater than 0.'
      );
      return;
    }

    if (!this.hotelId) {
      this.errorMessage.set(
        'Hotel ID was not provided.'
      );
      return;
    }

    this.loading.set(true);

    if (this.isEditMode() && this.roomId) {

      const imageIdsToDelete =
        this.existingImages()
          .filter(image => image.markedForDeletion)
          .map(image => image.id);

      this.roomService.update(
        this.roomId,
        this.name,
        this.price,
        this.selectedFiles,
        imageIdsToDelete,
        this.selectedPrimaryImageId()
      ).subscribe({

        next: () => {

          this.loading.set(false);

          this.navigateToRooms();
        },

        error: (err) => {

          this.loading.set(false);

          this.errorMessage.set(
            err.error?.message ??
            'Error while updating room.'
          );
        }
      });

    } else {

      this.roomService.create(
        this.name,
        this.price,
        this.hotelId,
        this.selectedFiles
      ).subscribe({

        next: () => {

          this.loading.set(false);

          this.navigateToRooms();
        },

        error: (err) => {

          this.loading.set(false);

          this.errorMessage.set(
            err.error?.message ??
            'Error while creating room.'
          );
        }
      });
    }
  }
}