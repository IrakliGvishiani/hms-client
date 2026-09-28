import { Routes } from '@angular/router';
import { guestGuard, roleGuard } from './guards/role.guard.guard';
import { authGuard } from './guards/auth.guard';


export const routes: Routes = [
  
  {
    path: '',
    loadComponent: () => import('./public-layout/public-layout.component').then(m => m.PublicLayoutComponent),
    children: [
      {
        path: '',
        loadComponent: () => import('./home/home.component').then(m => m.HomeComponent)
      },
      { path: 'hotels/:id', 
        loadComponent: () => import('./hotel-details/hotel-details.component').then(m => m.HotelDetailComponent),
         canActivate: [authGuard] },
         { path: 'rooms/:id',
           loadComponent: () => import('./room-details/room-details.component').then(m => m.RoomDetailComponent),
            canActivate: [authGuard] },
      {
        path: 'login',
        loadComponent: () => import('./login/login.component').then(m => m.LoginComponent),
        canActivate: [guestGuard]
      },
      { path: 'my-reservations',
         loadComponent: () => import('./my-reservations/my-reservations.component').then(m => m.MyReservationsComponent),
          canActivate: [roleGuard(['Guest'])]},
      {      
       path: 'my-reservations/:id/edit',
        loadComponent: () => import('./admin-dashboard/reservations/reservation.form/reservation.form.component').then(m => m.ReservationFormComponent),
       canActivate: [roleGuard(['Guest'])] },
      {
      path: 'forgot-password',
      loadComponent: () => import('./forgot-password/forgot-password.component').then(m => m.ForgotPasswordComponent)
      },
      {
      path: 'reset-password',
      loadComponent: () => import('./reset-password/reset-password.component').then(m => m.ResetPasswordComponent)
      },
      {
      path: 'register',
      loadComponent: () => import('./register/register.component').then(m => m.RegisterComponent),
      canActivate: [guestGuard]
      },
      {
      path: 'confirm-email',
      loadComponent: () => import('./confirm-email/confirm-email.component').then(m => m.ConfirmEmailComponent)
      },
    ]
  },

  {
    path: 'admin',
    loadComponent: () => import('./admin-dashboard/admin-dashboard.component').then(m => m.AdminDashboardComponent),
    canActivate: [roleGuard(['Admin'])],
    children: [
      {
        path: '',
        redirectTo: 'dashboard',
        pathMatch: 'full'
      },
      {
        path: 'dashboard',
        loadComponent: () => import('./admin-dashboard/dashboard-home/dashboard-home.component').then(m => m.DashboardHomeComponent)
      },
      {
        path: 'hotels',
        children: [
          { path: '', loadComponent: () => import('./admin-dashboard/hotel.list/hotel.list.component').then(m => m.HotelListComponent) },
          { path: 'new', loadComponent: () => import('./admin-dashboard/hotel.form/hotel.form.component').then(m => m.HotelFormComponent) },
          { path: ':id/edit', loadComponent: () => import('./admin-dashboard/hotel.form/hotel.form.component').then(m => m.HotelFormComponent) }
        ]
      },
      {
        path: 'hotels/:hotelId/rooms',
        children: [
          { path: '', loadComponent: () => import('./admin-dashboard/rooms/room-list/room-list.component').then(m => m.RoomListComponent) },
          { path: 'new', loadComponent: () => import('./admin-dashboard/rooms/room.form/room.form.component').then(m => m.RoomFormComponent) },
          { path: ':roomId/edit', loadComponent: () => import('./admin-dashboard/rooms/room.form/room.form.component').then(m => m.RoomFormComponent)  }
        ]
      },
      
      {
        path: 'managers',
        loadComponent: () => import('./admin-dashboard/managers/manager.list/manager.list.component').then(m => m.ManagerListComponent)
      },
        { 
        path: 'admins/new',
         loadComponent: () => import('./admin-dashboard/admin.form/admin.form.component').then(m => m.AdminFormComponent) 
        },

      {
  path: 'reservations',
  children: [
    { path: '', loadComponent: () => import('./admin-dashboard/reservations/reservation.list/reservation.list.component').then(m => m.ReservationListComponent) },
    { path: 'new', loadComponent: () => import('./admin-dashboard/reservations/reservation.form/reservation.form.component').then(m => m.ReservationFormComponent) },
    { path: ':id/edit', loadComponent: () => import('./admin-dashboard/reservations/reservation.form/reservation.form.component').then(m => m.ReservationFormComponent) }
  ]
}
    ]
  },

  
 {
  path: 'manager',
  loadComponent: () => import('./manager-dashboard/manager-dashboard.component').then(m => m.ManagerDashboardComponent),
  canActivate: [roleGuard(['Manager', 'Admin'])], 
  children: [
    { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
    { path: 'dashboard', loadComponent: () => import('./admin-dashboard/dashboard-home/dashboard-home.component').then(m => m.DashboardHomeComponent) },
    {
      path: 'rooms',
      canActivate: [roleGuard(['Manager'])], 
      children: [
        { path: '', loadComponent: () => import('./manager-dashboard/manager-rooms/manager-rooms.component').then(m => m.ManagerRoomsComponent) },
        { path: 'new', loadComponent: () => import('./admin-dashboard/rooms/room.form/room.form.component').then(m => m.RoomFormComponent) },
        { path: ':roomId/edit',  loadComponent: () => import('./admin-dashboard/rooms/room.form/room.form.component').then(m => m.RoomFormComponent) }
      ]
    },
    {
      path: 'reservations',
      canActivate: [roleGuard(['Manager'])],
      children: [
        { path: '', loadComponent: () => import('./admin-dashboard/reservations/reservation.list/reservation.list.component').then(m => m.ReservationListComponent) },
        { path: 'new', loadComponent: () => import('./admin-dashboard/reservations/reservation.form/reservation.form.component').then(m => m.ReservationFormComponent) },
        { path: ':id/edit', loadComponent: () => import('./admin-dashboard/reservations/reservation.form/reservation.form.component').then(m => m.ReservationFormComponent) }
      ]
    },
    { path: 'profile', canActivate: [roleGuard(['Manager'])], loadComponent: () => import('./manager-dashboard/manager-profile/manager-profile.component').then(m => m.ManagerProfileComponent) }
  ]
},

{
  path: '**',
  loadComponent: () => import('./not-found/not-found.component').then(m => m.NotFoundComponent)
}
];