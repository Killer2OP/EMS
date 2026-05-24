import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BillService, Bill } from '../../shared/services/bill.service';
import { AuthService } from '../../shared/services/auth.service';

@Component({
  selector: 'app-bill-summary',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="mb-6">
<h1 class="m-0 mb-1 text-[1.4rem] font-bold text-[#003087] dark:text-blue-400">Bill Summary</h1>
<p class="m-0 label">Your billing trends over the last 6 months</p>
</div>

    <!-- Bar Chart Visualization (Pure CSS) -->
    <div class="bg-card rounded-2xl shadow-sm border border-border overflow-hidden mb-6">
      <div class="card-header">
        <h3>Monthly Consumption & Billing</h3>
      </div>
      <div class="card-body">
        @if (bills.length > 0) {
          <div class="flex items-end gap-3 h-48 px-4">
            @for (bill of bills; track bill.id) {
              <div class="flex-1 flex flex-col items-center gap-1">
                <span class="text-xs font-bold" [class]="bill.status === 'Paid' ? 'text-success' : 'text-danger'">
                  ₹{{ bill.totalAmount }}
                </span>
                <div
                  class="w-full rounded-t-lg transition-all duration-500 min-h-[8px]"
                  [class]="bill.status === 'Paid' ? 'bg-success/80' : 'bg-danger/80'"
                  [style.height.%]="getBarHeight(bill.totalAmount)"
                ></div>
                <span class="text-xs text-text-muted mt-1 text-center">{{ getShortMonth(bill.billingMonth) }}</span>
                <span class="text-xs text-text-muted">{{ bill.unitsConsumed }} kWh</span>
              </div>
            }
          </div>
        } @else {
          <div class="empty-state">
            <div class="empty-icon"><span class="material-symbols-outlined text-[1.2em] align-middle">bar_chart</span></div>
            <h3>No Data</h3>
            <p>No billing data available.</p>
          </div>
        }
      </div>
    </div>

    <!-- Table -->
    <div class="bg-card rounded-2xl shadow-sm border border-border overflow-hidden">
      <div class="card-header">
        <h3>Bill Details</h3>
      </div>
      <div class="ems-table-wrapper">
        <table class="ems-table">
          <thead>
            <tr>
              <th>Month</th>
              <th>Units</th>
              <th>Amount</th>
              <th>Due Date</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            @for (bill of bills; track bill.id) {
              <tr>
                <td class="font-medium">{{ bill.billingMonth }}</td>
                <td>{{ bill.unitsConsumed }} kWh</td>
                <td class="font-semibold">₹{{ bill.totalAmount }}</td>
                <td>{{ bill.dueDate | date:'dd MMM yyyy' }}</td>
                <td><span class="status-badge" [class]="bill.status.toLowerCase()">{{ bill.status }}</span></td>
              </tr>
            }
          </tbody>
        </table>
      </div>
    </div>
  `
})
export class BillSummaryComponent implements OnInit {
  private billService = inject(BillService);
  private auth = inject(AuthService);
  bills: Bill[] = [];
  maxAmount = 0;

  ngOnInit() {
    const consumerNo = this.auth.getCurrentUser()?.consumerNumber || 'CON-001';
    this.billService.getByConsumer(consumerNo).subscribe(bills => {
      this.bills = bills.slice(0, 6);
      this.maxAmount = Math.max(...this.bills.map(b => b.totalAmount), 1);
    });
  }

  getBarHeight(amount: number): number {
    return Math.max((amount / this.maxAmount) * 100, 5);
  }

  getShortMonth(month: string): string {
    return month.split(' ')[0]?.substring(0, 3) || month;
  }
}




