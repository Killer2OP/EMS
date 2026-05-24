import { Component, inject } from '@angular/core';
import { RouterModule } from '@angular/router';
import { StatsCardComponent } from '../../shared/components/stats-card/stats-card.component';
import { ConsumerService } from '../../shared/services/consumer.service';
import { BillService } from '../../shared/services/bill.service';
import { ComplaintService } from '../../shared/services/complaint.service';
import { CustomerService } from '../../shared/services/customer.service';

@Component({
  selector: 'app-admin-dashboard',
  standalone: true,
  imports: [RouterModule, StatsCardComponent],
  template: `
    <div class="mb-6">
<h1 class="m-0 mb-1 text-[1.4rem] font-bold text-[#003087] dark:text-blue-400">Admin Dashboard</h1>
<p class="m-0 label">Overview of the electricity management system</p>
</div>

    <div class="bg-gradient-to-br from-[#003087] via-[#0066CC] to-[#0078D4] rounded-2xl p-8 text-white mb-6 relative overflow-hidden after:content-['⚡'] after:absolute after:right-8 after:top-1/2 after:-translate-y-1/2 after:text-[5rem] after:opacity-10">
      <h2 class="m-0 mb-1 text-[1.5rem] font-bold">Welcome, Admin! <span class="material-symbols-outlined text-[1.2em] align-middle">security</span></h2>
<p class="m-0 mb-4 text-white/70 text-[0.85rem]">Here's what's happening in VidyutSeva today</p>
    </div>

    <!-- KPI Cards -->
    <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
      <app-stats-card icon="group" label="Total Customers" [value]="'' + totalCustomers" iconBg="#E8F4FD" borderColor="#003087" />
      <app-stats-card icon="power" label="Total Consumers" [value]="'' + totalConsumers" iconBg="#DCFCE7" borderColor="#22C55E" />
      <app-stats-card icon="description" label="Total Bills" [value]="'' + totalBills" iconBg="#FEF3C7" borderColor="#F5C518" />
      <app-stats-card icon="payments" label="Pending Bills" [value]="'' + pendingBills" iconBg="#FEE2E2" borderColor="#EF4444" />
      <app-stats-card icon="assignment" label="Open Complaints" [value]="'' + openComplaints" iconBg="#FEF3C7" borderColor="#F59E0B" />
      <app-stats-card icon="check_circle" label="Resolved Today" [value]="'' + resolvedToday" iconBg="#DCFCE7" borderColor="#22C55E" />
    </div>

    <!-- Quick Actions -->
    <h3 class="text-xs font-semibold text-text-muted uppercase tracking-wider mb-3">Quick Actions</h3>
    <div class="flex gap-3 flex-wrap mb-6 mb-6">
      <a class="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-lg text-[0.85rem] font-semibold cursor-pointer transition-all bg-gradient-to-br from-[#003087] to-[#0066CC] text-white border-none shadow-[0_4px_12px_rgba(0,102,204,0.3)] hover:shadow-[0_6px_16px_rgba(0,102,204,0.4)] hover:-translate-y-px disabled:opacity-50 disabled:cursor-not-allowed" routerLink="/admin/add-customer"><span class="material-symbols-outlined text-[1.2em] align-middle">person</span> Add Customer</a>
      <a class="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-lg text-[0.85rem] font-semibold cursor-pointer transition-all bg-[#0066CC] text-white border-none hover:bg-[#003087] disabled:opacity-50 disabled:cursor-not-allowed" routerLink="/admin/add-bill"><span class="material-symbols-outlined text-[1.2em] align-middle">edit</span> Add Bill</a>
      <a class="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-lg text-[0.85rem] font-semibold cursor-pointer transition-all bg-[#F5C518] text-[#1E293B] border-none hover:bg-yellow-500 disabled:opacity-50 disabled:cursor-not-allowed" routerLink="/admin/complaints"><span class="material-symbols-outlined text-[1.2em] align-middle">assignment</span> View Complaints</a>
      <a class="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-lg text-[0.85rem] font-semibold cursor-pointer transition-all bg-card text-text-primary border border-border hover:bg-card-hover disabled:opacity-50 disabled:cursor-not-allowed" routerLink="/admin/consumers"><span class="material-symbols-outlined text-[1.2em] align-middle">group</span> List Consumers</a>
    </div>

    <!-- Recent Activity -->
    <div class="bg-card rounded-2xl shadow-sm border border-border overflow-hidden">
      <div class="card-header"><h3>Recent Activity</h3></div>
      <div class="card-body">
        <div class="space-y-3">
          @for (activity of recentActivity; track activity.time) {
            <div class="flex items-start gap-3 pb-3 border-b border-border last:border-b-0">
              <div class="w-8 h-8 rounded-full bg-sky flex items-center justify-center text-sm flex-shrink-0" [innerHTML]="activity.icon"></div>
              <div class="flex-1">
                <p class="text-sm font-medium text-text-primary">{{ activity.text }}</p>
                <p class="text-xs text-text-muted">{{ activity.time }}</p>
              </div>
            </div>
          }
        </div>
      </div>
    </div>
  `
})
export class AdminDashboardComponent {
  private customerService = inject(CustomerService);
  private consumerService = inject(ConsumerService);
  private billService = inject(BillService);
  private complaintService = inject(ComplaintService);

  totalCustomers = 0;
  totalConsumers = 0;
  totalBills = 0;
  pendingBills = 0;
  openComplaints = 0;
  resolvedToday = 0;

  recentActivity = [
    { icon: '<span class="material-symbols-outlined text-[1.2em] align-middle">person</span>', text: 'New customer Arjun Sharma registered', time: '2 hours ago' },
    { icon: '<span class="material-symbols-outlined text-[1.2em] align-middle">description</span>', text: 'Bill generated for CON-001 — April 2025', time: '3 hours ago' },
    { icon: '<span class="material-symbols-outlined text-[1.2em] align-middle">credit_card</span>', text: 'Payment of ₹1,098.90 received from CON-001', time: '5 hours ago' },
    { icon: '<span class="material-symbols-outlined text-[1.2em] align-middle">assignment</span>', text: 'Complaint CMP-005 assigned to Ravi SME', time: '6 hours ago' },
    { icon: '<span class="material-symbols-outlined text-[1.2em] align-middle">check_circle</span>', text: 'Complaint CMP-003 resolved — Meter replaced', time: '1 day ago' },
    { icon: '<span class="material-symbols-outlined text-[1.2em] align-middle">power</span>', text: 'Consumer CON-003 disconnected — Non-payment', time: '2 days ago' },
  ];

  constructor() {
    this.customerService.getAll().subscribe(c => this.totalCustomers = c.length);
    this.consumerService.getAll().subscribe(c => this.totalConsumers = c.length);
    this.billService.getAll().subscribe(b => {
      this.totalBills = b.length;
      this.pendingBills = b.filter(x => x.status !== 'Paid').length;
    });
    this.complaintService.getAll().subscribe(c => {
      this.openComplaints = c.filter(x => x.status !== 'Resolved').length;
      this.resolvedToday = c.filter(x => x.status === 'Resolved').length;
    });
  }
}






