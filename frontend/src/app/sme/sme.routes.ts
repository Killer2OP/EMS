import { Routes } from '@angular/router';
import { SmeShellComponent } from './sme-shell.component';

export const smeRoutes: Routes = [
  {
    path: '',
    component: SmeShellComponent,
    children: [
      { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
      { path: 'dashboard', loadComponent: () => import('./dashboard/sme-dashboard.component').then(m => m.SmeDashboardComponent) },
      { path: 'complaints', loadComponent: () => import('./complaints/list-complaints.component').then(m => m.ListComplaintsComponent) },
      { path: 'complaints/:id/action', loadComponent: () => import('./complaints/act-on-complaint.component').then(m => m.ActOnComplaintComponent) },
      { path: 'search-complaint', loadComponent: () => import('./complaints/search-complaint.component').then(m => m.SearchComplaintComponent) },
    ]
  }
];
