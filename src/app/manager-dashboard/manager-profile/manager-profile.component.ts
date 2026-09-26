import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ManagerService } from '../../services/manager.service';

@Component({
  selector: 'app-manager-profile',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './manager-profile.component.html',
  styleUrl: './manager-profile.component.scss'
})
export class ManagerProfileComponent implements OnInit {
  managerId: number | null = null;
  firstName = '';
  lastName = '';
  email = '';
  hotelName = '';
  personalNumber = '';
  phoneNumber = '';

  loading = signal(false);
  errorMessage = signal<string | null>(null);
  successMessage = signal<string | null>(null);

  constructor(private managerService: ManagerService) {}

  ngOnInit(): void {
    this.loading.set(true);
    this.managerService.getOwnProfile().subscribe({
      next: (res) => {
        this.managerId = res.result.id;
        this.firstName = res.result.firstName;
        this.lastName = res.result.lastName;
        this.email = res.result.email;
        this.hotelName = res.result.hotelName;
        this.personalNumber = res.result.personalNumber;
        this.phoneNumber = res.result.phoneNumber;
        this.loading.set(false);
      },
      error: (err) => {
        this.loading.set(false);
        this.errorMessage.set(err.error?.message ?? 'Failed Loading Profile');
      }
    });
  }

  onSubmit(): void {
    if (!this.managerId) return;

    this.errorMessage.set(null);
    this.successMessage.set(null);
    this.loading.set(true);

    this.managerService.update({
      id: this.managerId,
      firstName: this.firstName,
      lastName: this.lastName,
      personalNumber: this.personalNumber,
      phoneNumber: this.phoneNumber
    }).subscribe({
      next: () => {
        this.loading.set(false);
        this.successMessage.set('Profile Edited Successfully');
      },
      error: (err) => {
        this.loading.set(false);
        this.errorMessage.set(err.error?.message ?? 'Error While Editing Profile');
      }
    });
  }
}