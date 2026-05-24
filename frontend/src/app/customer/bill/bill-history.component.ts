import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { BillService, Bill } from '../../shared/services/bill.service';
import { AuthService } from '../../shared/services/auth.service';

@Component({
  selector: 'app-bill-history',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  template: `
    <div class="mb-6">
<h1 class="m-0 mb-1 text-[1.4rem] font-bold text-[#003087] dark:text-blue-400">Bill History</h1>
<p class="m-0 label">View all your past electricity bills</p>
</div>

    <div class="bg-card rounded-2xl shadow-sm border border-border overflow-hidden">
      <!-- Filter Bar -->
      <div class="table-search-bar">
        <div class="relative inline-block w-full align-middle" style="max-width: 160px;"><select class="w-full px-3.5 py-2.5 border-[1.5px] border-input-border rounded-lg text-[0.85rem] text-input-text bg-input-bg outline-none transition-colors focus:border-[#0066CC] focus:ring-[3px] focus:ring-[#0066CC]/10 dark:focus:border-blue-500 dark:focus:ring-blue-500/20 appearance-none pr-9" style="max-width: 160px;" [(ngModel)]="statusFilter" (ngModelChange)="applyFilters()">
          <option value="All">All Status</option>
          <option value="Paid">Paid</option>
          <option value="Unpaid">Unpaid</option>
          <option value="Overdue">Overdue</option>
        </select><span class="material-symbols-outlined absolute right-3 top-1/2 -translate-y-1/2 text-text-muted pointer-events-none">expand_more</span></div>
        <input class="w-full px-3.5 py-2.5 border-[1.5px] border-input-border rounded-lg text-[0.85rem] text-input-text bg-input-bg outline-none transition-colors focus:border-[#0066CC] focus:ring-[3px] focus:ring-[#0066CC]/10 dark:focus:border-blue-500 dark:focus:ring-blue-500/20 placeholder:text-text-muted" style="max-width: 200px;" type="text" placeholder="Search..." [(ngModel)]="searchTerm" (ngModelChange)="applyFilters()">
      </div>

      <!-- Table -->
      <div class="ems-table-wrapper">
        <table class="ems-table">
          <thead>
            <tr>
              <th>Bill ID</th>
              <th>Month</th>
              <th>Units</th>
              <th>Amount</th>
              <th>Due Date</th>
              <th>Status</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            @for (bill of pagedBills; track bill.id) {
              <tr>
                <td class="font-medium text-accent">#{{ bill.id }}</td>
                <td>{{ bill.billingMonth }}</td>
                <td>{{ bill.unitsConsumed }} kWh</td>
                <td class="font-semibold">₹{{ bill.totalAmount }}</td>
                <td>{{ bill.dueDate | date:'dd MMM yyyy' }}</td>
                <td><span class="status-badge" [class]="bill.status.toLowerCase()">{{ bill.status }}</span></td>
                <td>
                  <div class="flex gap-2">
                    <a routerLink="/customer/view-bill" class="text-xs text-accent font-semibold hover:underline">View</a>
                    <button class="text-xs text-text-muted font-semibold hover:text-primary" (click)="download(bill)">Download</button>
                  </div>
                </td>
              </tr>
            }
            @if (filteredBills.length === 0) {
              <tr><td colspan="7" class="text-center py-8 text-text-muted">No bills found matching your filters</td></tr>
            }
          </tbody>
        </table>
      </div>

      <!-- Pagination -->
      @if (totalPages > 1) {
        <div class="flex items-center justify-between p-4 border-t border-border text-sm">
          <span class="text-text-muted text-xs">
            Showing {{ startIdx + 1 }} - {{ endIdx }} of {{ filteredBills.length }} bills
          </span>
          <div class="flex items-center gap-1">
            <button class="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-lg text-[0.85rem] font-semibold cursor-pointer transition-all bg-card text-text-primary border border-border hover:bg-card-hover disabled:opacity-50 disabled:cursor-not-allowed" style="padding: 0.35rem 0.75rem; font-size: 0.75rem;" [disabled]="page === 1" (click)="page = page - 1">Prev</button>
            @for (p of pages; track p) {
              <button class="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-lg text-[0.85rem] font-semibold cursor-pointer transition-all border border-border hover:bg-black/5 disabled:opacity-50 disabled:cursor-not-allowed" [class.primary]="p === page" [class.secondary]="p !== page" style="padding: 0.35rem 0.65rem; font-size: 0.75rem;" (click)="page = p">{{ p }}</button>
            }
            <button class="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-lg text-[0.85rem] font-semibold cursor-pointer transition-all bg-card text-text-primary border border-border hover:bg-card-hover disabled:opacity-50 disabled:cursor-not-allowed" style="padding: 0.35rem 0.75rem; font-size: 0.75rem;" [disabled]="page === totalPages" (click)="page = page + 1">Next</button>
          </div>
        </div>
      }
    </div>
  `
})
export class BillHistoryComponent implements OnInit {
  private billService = inject(BillService);
  private auth = inject(AuthService);

  allBills: Bill[] = [];
  filteredBills: Bill[] = [];
  statusFilter = 'All';
  searchTerm = '';
  page = 1;
  pageSize = 10;

  ngOnInit() {
    const consumerNo = this.auth.getCurrentUser()?.consumerNumber || 'CON-001';
    this.billService.getByConsumer(consumerNo).subscribe(bills => {
      this.allBills = bills;
      this.applyFilters();
    });
  }

  applyFilters() {
    let result = [...this.allBills];
    if (this.statusFilter !== 'All') result = result.filter(b => b.status === this.statusFilter);
    if (this.searchTerm) {
      const term = this.searchTerm.toLowerCase();
      result = result.filter(b => b.billingMonth.toLowerCase().includes(term) || String(b.id).includes(term));
    }
    this.filteredBills = result;
    this.page = 1;
  }

  get totalPages() { return Math.ceil(this.filteredBills.length / this.pageSize) || 1; }
  get startIdx() { return (this.page - 1) * this.pageSize; }
  get endIdx() { return Math.min(this.startIdx + this.pageSize, this.filteredBills.length); }
  get pagedBills() { return this.filteredBills.slice(this.startIdx, this.endIdx); }
  get pages() {
    const p: number[] = [];
    for (let i = Math.max(1, this.page - 2); i <= Math.min(this.totalPages, this.page + 2); i++) p.push(i);
    return p;
  }

  download(bill: Bill) { window.print(); }
}





