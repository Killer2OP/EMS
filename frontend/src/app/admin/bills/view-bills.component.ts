import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { BillService, Bill } from '../../shared/services/bill.service';
import { ToastService } from '../../shared/services/toast.service';

@Component({
  selector: 'app-view-bills',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="mb-6">
<h1 class="m-0 mb-1 text-[1.4rem] font-bold text-[#003087] dark:text-blue-400">View Bills</h1>
<p class="m-0 label">All generated electricity bills</p>
</div>

    <div class="bg-card rounded-2xl shadow-sm border border-border overflow-hidden">
      <div class="table-search-bar">
        <input class="w-full px-3.5 py-2.5 border-[1.5px] border-input-border rounded-lg text-[0.85rem] text-input-text bg-input-bg outline-none transition-colors focus:border-[#0066CC] focus:ring-[3px] focus:ring-[#0066CC]/10 dark:focus:border-blue-500 dark:focus:ring-blue-500/20 placeholder:text-text-muted" style="max-width: 240px;" placeholder="Search consumer no..." [(ngModel)]="search" (ngModelChange)="filter()">
        <select class="w-full px-3.5 py-2.5 border-[1.5px] border-input-border rounded-lg text-[0.85rem] text-input-text bg-input-bg outline-none transition-colors focus:border-[#0066CC] focus:ring-[3px] focus:ring-[#0066CC]/10 dark:focus:border-blue-500 dark:focus:ring-blue-500/20 appearance-none pr-9 bg-[url('data:image/svg+xml,%3Csvg_xmlns=\'http://www.w3.org/2000/svg\'_width=\'12\'_height=\'12\'_viewBox=\'0_0_12_12\'%3E%3Cpath_d=\'M2_4l4_4_4-4\'_stroke=\'%2364748B\'_stroke-width=\'1.5\'_fill=\'none\'/%3E%3C/svg%3E')] bg-no-repeat bg-[right_12px_center]" style="max-width: 140px;" [(ngModel)]="statusFilter" (ngModelChange)="filter()">
          <option value="All">All Status</option>
          <option value="Paid">Paid</option>
          <option value="Unpaid">Unpaid</option>
          <option value="Overdue">Overdue</option>
        </select>
      </div>

      <div class="ems-table-wrapper">
        <table class="ems-table">
          <thead>
            <tr>
              <th>Bill ID</th>
              <th>Consumer</th>
              <th>Month</th>
              <th>Units</th>
              <th>Amount</th>
              <th>Due Date</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            @for (bill of filtered; track bill.id) {
              <tr>
                <td class="font-medium text-accent">#{{ bill.id }}</td>
                <td>{{ bill.consumerNumber }}</td>
                <td>{{ bill.billingMonth }}</td>
                <td>{{ bill.unitsConsumed }} kWh</td>
                <td class="font-semibold">₹{{ bill.totalAmount }}</td>
                <td>{{ bill.dueDate | date:'dd MMM yyyy' }}</td>
                <td><span class="status-badge" [class]="bill.status.toLowerCase()">{{ bill.status }}</span></td>
                <td>
                  <div class="flex gap-2">
                    <button class="text-xs text-danger font-semibold hover:underline" (click)="deleteBill(bill.id)">Delete</button>
                  </div>
                </td>
              </tr>
            }
            @if (filtered.length === 0) {
              <tr><td colspan="8" class="text-center py-8 text-text-muted">No bills found</td></tr>
            }
          </tbody>
        </table>
      </div>
    </div>
  `
})
export class ViewBillsComponent implements OnInit {
  private billService = inject(BillService);
  private toast = inject(ToastService);

  all: Bill[] = [];
  filtered: Bill[] = [];
  search = '';
  statusFilter = 'All';

  ngOnInit() {
    this.billService.getAll().subscribe(b => { this.all = b; this.filter(); });
  }

  filter() {
    let result = [...this.all];
    if (this.statusFilter !== 'All') result = result.filter(b => b.status === this.statusFilter);
    if (this.search) {
      const s = this.search.toLowerCase();
      result = result.filter(b => b.consumerNumber.toLowerCase().includes(s));
    }
    this.filtered = result;
  }

  deleteBill(id: number) {
    this.billService.delete(id).subscribe(() => {
      this.all = this.all.filter(b => b.id !== id);
      this.filter();
      this.toast.success('Bill deleted');
    });
  }
}





