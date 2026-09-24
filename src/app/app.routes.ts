import { Routes } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { LoginComponent } from './login/login.component';
import { roleGuard } from './guards/role.guard.guard';

import { AdminDashboardComponent } from './admin-dashboard/admin-dashboard.component';
import { DashboardHomeComponent } from './admin-dashboard/dashboard-home/dashboard-home.component';

import { HotelListComponent } from './admin-dashboard/hotel.list/hotel.list.component';
import { RoomListComponent } from './admin-dashboard/rooms/room-list/room-list.component';
import { HotelFormComponent } from './admin-dashboard/hotel.form/hotel.form.component';

export const routes: Routes = [

  {
    path: '',
    component: HomeComponent
  },

  {
    path: 'login',
    component: LoginComponent
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
        {
          path: '',
          component: HotelListComponent
        },
        {
          path: 'new',
          component: HotelFormComponent
        },
        {
          path: ':id/edit',
          component: HotelFormComponent
        }
      ]
    },

    {
      path: 'hotels/:hotelId/rooms',
      component: RoomListComponent
    }

  ]
}

];