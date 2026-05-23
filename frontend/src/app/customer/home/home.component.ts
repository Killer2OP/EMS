import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { AuthService } from '../../shared/services/auth.service';
import { BillService, Bill } from '../../shared/services/bill.service';
import { ComplaintService, Complaint } from '../../shared/services/complaint.service';
import { StatsCardComponent } from '../../shared/components/stats-card/stats-card.component';

@Component({
  selector: 'app-customer-home',
  standalone: true,
  imports: [CommonModule, RouterModule, StatsCardComponent],
  template: `
    <div class="mb-6">
<h1 class="m-0 mb-1 text-[1.4rem] font-bold text-[#003087] dark:text-blue-400">Dashboard</h1>
<p class="m-0 label">Welcome to your electricity account overview</p>
</div>

    <div class="bg-gradient-to-br from-[#003087] via-[#0066CC] to-[#0078D4] rounded-2xl p-8 text-white mb-6 relative overflow-hidden after:content-['⚡'] after:absolute after:right-8 after:top-1/2 after:-translate-y-1/2 after:text-[5rem] after:opacity-10">
      <h2 class="m-0 mb-1 text-[1.5rem] font-bold">Good {{ greeting }}, {{ firstName }}! 👋</h2>
<p class="m-0 mb-4 text-white/70 text-[0.85rem]">Here's your electricity account summary</p>
      <div class="inline-flex items-center gap-2 bg-white/15 px-3.5 py-1.5 rounded-full text-[0.78rem] font-medium backdrop-blur-sm">⚡ Consumer No: {{ user?.consumerNumber || 'CON-001' }}</div>
    </div>

    <!-- Stats Cards -->
    <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
      <app-stats-card icon="💰" label="Total Due" [value]="'₹' + totalDue" iconBg="#FEE2E2" [borderColor]="totalDue > 0 ? '#EF4444' : '#22C55E'" />
      <app-stats-card icon="📄" label="Last Bill Amount" [value]="'₹' + lastBillAmount" iconBg="#E8F4FD" borderColor="#003087" />
      <app-stats-card icon="📋" label="Open Complaints" [value]="'' + openComplaints" iconBg="#FEF3C7" borderColor="#F59E0B" />
      <app-stats-card icon="🔌" label="Consumer Number" [value]="user?.consumerNumber || 'CON-001'" iconBg="#DCFCE7" borderColor="#22C55E" />
    </div>

    <!-- Quick Actions -->
    <h3 class="text-xs font-semibold text-text-muted uppercase tracking-wider mb-3">Quick Actions</h3>
    <div class="flex gap-3 flex-wrap mb-6">
      <a class="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-lg text-[0.85rem] font-semibold cursor-pointer transition-all bg-gradient-to-br from-[#003087] to-[#0066CC] text-white border-none shadow-[0_4px_12px_rgba(0,102,204,0.3)] hover:shadow-[0_6px_16px_rgba(0,102,204,0.4)] hover:-translate-y-px disabled:opacity-50 disabled:cursor-not-allowed" routerLink="/customer/view-bill">📄 View Bill</a>
      <a class="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-lg text-[0.85rem] font-semibold cursor-pointer transition-all bg-green-500 text-white border-none hover:bg-green-600 disabled:opacity-50 disabled:cursor-not-allowed" routerLink="/customer/pay-bill">💳 Pay Bill</a>
      <a class="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-lg text-[0.85rem] font-semibold cursor-pointer transition-all bg-[#F5C518] text-[#1E293B] border-none hover:bg-yellow-500 disabled:opacity-50 disabled:cursor-not-allowed" routerLink="/customer/register-complaint">📝 Register Complaint</a>
      <a class="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-lg text-[0.85rem] font-semibold cursor-pointer transition-all bg-card text-text-primary border border-border hover:bg-card-hover disabled:opacity-50 disabled:cursor-not-allowed" routerLink="/customer/bill-history">🗂️ Bill History</a>
    </div>

    <!-- Recent Bills -->
    <div class="bg-card rounded-2xl shadow-sm border border-border overflow-hidden mb-6">
      <div class="card-header">
        <h3>Recent Bills</h3>
        <a routerLink="/customer/bill-history" class="text-xs text-accent font-semibold hover:underline">View All →</a>
      </div>
      <div class="ems-table-wrapper">
        <table class="ems-table">
          <thead>
            <tr>
              <th>Month</th>
              <th>Units</th>
              <th>Amount</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            @for (bill of recentBills; track bill.id) {
              <tr>
                <td class="font-medium">{{ bill.billingMonth }}</td>
                <td>{{ bill.unitsConsumed }} kWh</td>
                <td class="font-semibold">₹{{ bill.totalAmount }}</td>
                <td><span class="status-badge" [class]="bill.status.toLowerCase()">{{ bill.status }}</span></td>
              </tr>
            }
            @if (recentBills.length === 0) {
              <tr><td colspan="4" class="text-center py-6 text-text-muted">No bills found</td></tr>
            }
          </tbody>
        </table>
      </div>
    </div>

    <!-- Recent Complaints -->
    <div class="bg-card rounded-2xl shadow-sm border border-border overflow-hidden">
      <div class="card-header">
        <h3>Recent Complaints</h3>
        <a routerLink="/customer/my-complaints" class="text-xs text-accent font-semibold hover:underline">View All →</a>
      </div>
      <div class="ems-table-wrapper">
        <table class="ems-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Type</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            @for (c of recentComplaints; track c.id) {
              <tr>
                <td class="font-medium text-accent">{{ c.id }}</td>
                <td>{{ c.category }}</td>
                <td><span class="status-badge" [class]="c.status.toLowerCase().replace(' ', '-')">{{ c.status }}</span></td>
              </tr>
            }
            @if (recentComplaints.length === 0) {
              <tr><td colspan="3" class="text-center py-6 text-text-muted">No complaints found</td></tr>
            }
          </tbody>
        </table>
      </div>
    </div>
  `
})
export class CustomerHomeComponent implements OnInit {
  private auth = inject(AuthService);
  private billService = inject(BillService);
  private complaintService = inject(ComplaintService);

  user = this.auth.getCurrentUser();
  recentBills: Bill[] = [];
  recentComplaints: Complaint[] = [];
  totalDue = 0;
  lastBillAmount = 0;
  openComplaints = 0;

  get firstName() { return (this.user?.name?.split(' ') || [])[0] || 'Customer'; }
  get greeting() {
    const h = new Date().getHours();
    if (h < 12) return 'morning';
    if (h < 17) return 'afternoon';
    return 'evening';
  }

  ngOnInit() {
    const consumerNo = this.user?.consumerNumber || 'CON-001';
    this.billService.getByConsumer(consumerNo).subscribe(bills => {
      this.recentBills = bills.slice(0, 3);
      this.totalDue = bills.filter(b => b.status !== 'Paid').reduce((sum, b) => sum + b.totalAmount, 0);
      this.lastBillAmount = bills[0]?.totalAmount || 0;
    });

    const customerId = this.user?.id || 1;
    this.complaintService.getByCustomer(customerId).subscribe(complaints => {
      this.recentComplaints = complaints.slice(0, 3);
      this.openComplaints = complaints.filter(c => c.status !== 'Resolved').length;
    });
  }
}






