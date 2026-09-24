import { Component, OnInit, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ManagerService } from '../../../services/manager.service';
import { AuthService } from '../../../services/auth.service';
import { HotelService } from '../../../services/hotel.service'; // 👈 HotelService-ის იმპორტი
import { Hotel } from '../../../models/hotel.models'; // 👈 Hotel მოდელი
import { 
  ManagerListForGettingDto, 
  ManagerForUpdatingDto, 
  ManagerRegistrationRequestDto 
} from '../../../models/manager.models';

@Component({
  selector: 'app-manager-list',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './manager.list.component.html',
  styleUrl: './manager.list.component.scss'
})
export class ManagerListComponent implements OnInit {

  managers = signal<ManagerListForGettingDto[]>([]);
  allHotels = signal<Hotel[]>([]); // 👈 ყველა სასტუმროს სია Dropdown-ისთვის
  loading = signal(false);
  errorMessage = signal<string | null>(null);

  // HOTEL FILTER STATE
  selectedHotelId = signal<number | 'ALL'>('ALL');

  // COMPUTED SIGNAL: დაფილტრული მენეჯერების სია
  filteredManagers = computed(() => {
    const filter = this.selectedHotelId();
    const list = this.managers();

    if (filter === 'ALL') {
      return list;
    }
    return list.filter(m => m.hotelId === filter);
  });

  // Edit Modal State
  selectedManager = signal<ManagerForUpdatingDto | null>(null);
  isEditModalOpen = signal(false);

  // Register Modal State
  isCreateModalOpen = signal(false);
  newManager: ManagerRegistrationRequestDto = this.getEmptyRegistrationDto();

  constructor(
    private managerService: ManagerService,
    private authService: AuthService,
    private hotelService: HotelService // 👈 Service-ის ინჯექტირება
  ) {}

  ngOnInit(): void {
    this.loadManagers();
    this.loadHotels(); // 👈 სასტუმროების ჩატვირთვა
  }

  loadHotels(): void {
    // იღებს პირველ 100 სასტუმროს Dropdown-ის შესავსებად
    this.hotelService.getList({ pageNumber: 1, pageSize: 100 }).subscribe({
      next: (res) => {
        if (res.result?.items) {
          this.allHotels.set(res.result.items);
        }
      },
      error: (err) => {
        console.error('Failed to load hotels list', err);
      }
    });
  }

  private getEmptyRegistrationDto(): ManagerRegistrationRequestDto {
    return {
      firstName: '',
      lastName: '',
      personalNumber: '',
      email: '',
      password: '',
      phoneNumber: '',
      hotelId: 0
    };
  }

  loadManagers(): void {
    this.loading.set(true);
    this.errorMessage.set(null);

    this.managerService.getAll().subscribe({
      next: (res) => {
        this.managers.set(res.result);
        this.loading.set(false);
      },
      error: (err) => {
        this.loading.set(false);
        this.errorMessage.set(err.error?.message ?? 'Failed to load managers.');
      }
    });
  }

  // --- FILTER HANDLER ---
  onHotelFilterChange(event: Event): void {
    const value = (event.target as HTMLSelectElement).value;
    this.selectedHotelId.set(value === 'ALL' ? 'ALL' : Number(value));
  }

  // --- REGISTER MANAGER ---
  openCreateModal(): void {
    this.newManager = this.getEmptyRegistrationDto();
    this.isCreateModalOpen.set(true);
  }

  closeCreateModal(): void {
    this.isCreateModalOpen.set(false);
  }

  createManager(): void {
    if (!this.newManager.firstName || 
        !this.newManager.lastName || 
        !this.newManager.personalNumber || 
        !this.newManager.email || 
        !this.newManager.password || 
        !this.newManager.hotelId ||
        this.newManager.hotelId === 0) {
      this.errorMessage.set('Please fill in all required fields and select a hotel.');
      return;
    }

    this.loading.set(true);
    this.authService.registerManager(this.newManager).subscribe({
      next: () => {
        this.loading.set(false);
        this.closeCreateModal();
        this.loadManagers();
      },
      error: (err) => {
        this.loading.set(false);
        this.errorMessage.set(err.error?.message ?? 'Failed to register manager.');
      }
    });
  }

  // --- UPDATE MANAGER ---
  openEditModal(manager: ManagerListForGettingDto): void {
    this.selectedManager.set({
      id: manager.id,
      firstName: manager.firstName,
      lastName: manager.lastName,
      personalNumber: manager.personalNumber,
      phoneNumber: manager.phoneNumber
    });
    this.isEditModalOpen.set(true);
  }

  closeEditModal(): void {
    this.isEditModalOpen.set(false);
    this.selectedManager.set(null);
  }

  saveManager(): void {
    const model = this.selectedManager();
    if (!model) return;

    this.loading.set(true);
    this.managerService.update(model).subscribe({
      next: () => {
        this.loading.set(false);
        this.closeEditModal();
        this.loadManagers();
      },
      error: (err) => {
        this.loading.set(false);
        this.errorMessage.set(err.error?.message ?? 'Failed to update manager.');
      }
    });
  }

  // --- DELETE MANAGER ---
  deleteManager(id: number): void {
    if (!confirm('Are You Sure You Want To Delete Manager?')) {
      return;
    }

    this.managerService.delete(id).subscribe({
      next: () => {
        this.managers.update(list => list.filter(m => m.id !== id));
      },
      error: (err) => {
        this.errorMessage.set(err.error?.message ?? 'Failed to delete manager.');
      }
    });
  }
}