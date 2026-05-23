import { Routes } from '@angular/router';
import { authGuard } from './shared/guards/auth.guard';
import { roleGuard } from './shared/guards/role.guard';

export const routes: Routes = [
  { path: '', redirectTo: '/auth/login', pathMatch: 'full' },
  {
    path: 'auth',
    loadChildren: () => import('./auth/auth.routes').then(m => m.authRoutes)
  },
  {
    path: 'customer',
    canActivate: [authGuard, roleGuard],
    data: { role: 'CUSTOMER' },
    loadChildren: () => import('./customer/customer.routes').then(m => m.customerRoutes)
  },
  {
    path: 'admin',
    canActivate: [authGuard, roleGuard],
    data: { role: 'ADMIN' },
    loadChildren: () => import('./admin/admin.routes').then(m => m.adminRoutes)
  },
  {
    path: 'sme',
    canActivate: [authGuard, roleGuard],
    data: { role: 'SME' },
    loadChildren: () => import('./sme/sme.routes').then(m => m.smeRoutes)
  },
  { path: '**', redirectTo: '/auth/login' }
];
