import { Routes } from '@angular/router';
import { AdminShellComponent } from './admin-shell.component';

export const adminRoutes: Routes = [
  {
    path: '',
    component: AdminShellComponent,
    children: [
      { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
      { path: 'dashboard', loadComponent: () => import('./dashboard/admin-dashboard.component').then(m => m.AdminDashboardComponent) },
      { path: 'add-customer', loadComponent: () => import('./customers/add-customer.component').then(m => m.AddCustomerComponent) },
      { path: 'add-consumer', loadComponent: () => import('./consumers/add-consumer.component').then(m => m.AddConsumerComponent) },
      { path: 'consumers', loadComponent: () => import('./consumers/list-consumers.component').then(m => m.ListConsumersComponent) },
      { path: 'consumers/edit/:id', loadComponent: () => import('./consumers/edit-consumer.component').then(m => m.EditConsumerComponent) },
      { path: 'consumers/status/:id', loadComponent: () => import('./consumers/consumer-status.component').then(m => m.ConsumerStatusComponent) },
      { path: 'add-bill', loadComponent: () => import('./bills/add-bill.component').then(m => m.AddBillComponent) },
      { path: 'bills', loadComponent: () => import('./bills/view-bills.component').then(m => m.ViewBillsComponent) },
      { path: 'complaints', loadComponent: () => import('./complaints/admin-complaints.component').then(m => m.AdminComplaintsComponent) },
    ]
  }
];
