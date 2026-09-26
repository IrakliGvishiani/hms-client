import { Routes } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { LoginComponent } from './login/login.component';
import { guestGuard, roleGuard } from './guards/role.guard.guard';

import { AdminDashboardComponent } from './admin-dashboard/admin-dashboard.component';
import { DashboardHomeComponent } from './admin-dashboard/dashboard-home/dashboard-home.component';

import { HotelListComponent } from './admin-dashboard/hotel.list/hotel.list.component';
import { RoomListComponent } from './admin-dashboard/rooms/room-list/room-list.component';
import { HotelFormComponent } from './admin-dashboard/hotel.form/hotel.form.component';
import { RoomFormComponent } from './admin-dashboard/rooms/room.form/room.form.component';


import { ManagerListComponent } from './admin-dashboard/managers/manager.list/manager.list.component';
import { HotelAnalyticsComponent } from './admin-dashboard/managers/hotel.analytics/hotel.analytics.component';
import { ReservationListComponent } from './admin-dashboard/reservations/reservation.list/reservation.list.component';
import { ReservationFormComponent } from './admin-dashboard/reservations/reservation.form/reservation.form.component';
import { PublicLayoutComponent } from './public-layout/public-layout.component';
import { ForgotPasswordComponent } from './forgot-password/forgot-password.component';
import { ResetPasswordComponent } from './reset-password/reset-password.component';
import { RegisterComponent } from './register/register.component';
import { ConfirmEmailComponent } from './confirm-email/confirm-email.component';
import { AdminFormComponent } from './admin-dashboard/admin.form/admin.form.component';
import { ManagerRoomsComponent } from './manager-dashboard/manager-rooms/manager-rooms.component';
import { ManagerDashboardComponent } from './manager-dashboard/manager-dashboard.component';
import { ManagerProfileComponent } from './manager-dashboard/manager-profile/manager-profile.component';

export const routes: Routes = [
  
  {
    path: '',
    component: PublicLayoutComponent,
    children: [
      {
        path: '',
        component: HomeComponent
      },
      {
        path: 'login',
        component: LoginComponent,
        canActivate: [guestGuard]
      },
      {
      path: 'forgot-password',
      component: ForgotPasswordComponent
      },
      {
      path: 'reset-password',
      component: ResetPasswordComponent
      },
      {
      path: 'register',
      component: RegisterComponent,
      canActivate: [guestGuard]
      },
      {
      path: 'confirm-email',
      component: ConfirmEmailComponent
      },
    ]
  },

  {
    path: 'admin',
    component: AdminDashboardComponent,
    canActivate: [roleGuard(['Admin'])],
    children: [
      {
        path: '',
        redirectTo: 'dashboard',
        pathMatch: 'full'
      },
      {
        path: 'dashboard',
        component: DashboardHomeComponent
      },
      {
        path: 'hotels',
        children: [
          { path: '', component: HotelListComponent },
          { path: 'new', component: HotelFormComponent },
          { path: ':id/edit', component: HotelFormComponent }
        ]
      },
      {
        path: 'hotels/:hotelId/rooms',
        children: [
          { path: '', component: RoomListComponent },
          { path: 'new', component: RoomFormComponent },
          { path: ':roomId/edit', component: RoomFormComponent }
        ]
      },
      
      {
        path: 'managers',
        component: ManagerListComponent
      },
        { 
        path: 'admins/new',
         component: AdminFormComponent 
        },

      {
  path: 'reservations',
  children: [
    { path: '', component: ReservationListComponent },
    { path: 'new', component: ReservationFormComponent },
    { path: ':id/edit', component: ReservationFormComponent }
  ]
}
    ]
  },

  
 {
  path: 'manager',
  component: ManagerDashboardComponent,
  canActivate: [roleGuard(['Manager', 'Admin'])],
  children: [
    { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
    { path: 'dashboard', component: DashboardHomeComponent },
    {
      path: 'rooms',
      children: [
        { path: '', component: ManagerRoomsComponent },
        { path: 'new', component: RoomFormComponent },
        { path: ':roomId/edit', component: RoomFormComponent }
      ]
    },
    { path: 'reservations', component: ReservationListComponent },
    { path: 'profile', component: ManagerProfileComponent }
  ]
}
];