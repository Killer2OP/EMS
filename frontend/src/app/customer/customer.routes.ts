import { Routes } from '@angular/router';
import { CustomerShellComponent } from './customer-shell.component';

export const customerRoutes: Routes = [
  {
    path: '',
    component: CustomerShellComponent,
    children: [
      { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
      { path: 'dashboard', loadComponent: () => import('./home/home.component').then(m => m.CustomerHomeComponent) },
      { path: 'view-bill', loadComponent: () => import('./bill/view-bill.component').then(m => m.ViewBillComponent) },
      { path: 'bill-summary', loadComponent: () => import('./bill/bill-summary.component').then(m => m.BillSummaryComponent) },
      { path: 'bill-history', loadComponent: () => import('./bill/bill-history.component').then(m => m.BillHistoryComponent) },
      { path: 'pay-bill', loadComponent: () => import('./pay/pay-bill.component').then(m => m.PayBillComponent) },
      { path: 'register-complaint', loadComponent: () => import('./complaint/register-complaint.component').then(m => m.RegisterComplaintComponent) },
      { path: 'complaint-status', loadComponent: () => import('./complaint/complaint-status.component').then(m => m.ComplaintStatusComponent) },
      { path: 'my-complaints', loadComponent: () => import('./complaint/all-complaints.component').then(m => m.AllComplaintsComponent) },
    ]
  },
];
