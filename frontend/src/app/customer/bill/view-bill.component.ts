import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { BillService, Bill } from '../../shared/services/bill.service';
import { AuthService } from '../../shared/services/auth.service';

@Component({
  selector: 'app-view-bill',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <div class="mb-6 no-print">
      <h1>View Bill</h1>
      <p>View your latest electricity bill details</p>
    </div>

    @if (bill) {
      <div class="bg-card rounded-2xl shadow-sm border border-border overflow-hidden mb-6" id="printable-bill">
        <!-- Bill Header -->
        <div class="bg-gradient-to-r from-primary to-accent text-white p-6">
          <div class="flex justify-between items-start flex-wrap gap-4">
            <div>
              <div class="flex items-center gap-2 mb-2">
                <span class="text-2xl">⚡</span>
                <span class="text-lg font-bold">VidyutSeva</span>
              </div>
              <p class="text-white/60 text-xs uppercase tracking-widest">TAX INVOICE</p>
            </div>
            <div class="text-right">
              <span class="status-badge" [class]="bill.status.toLowerCase()">{{ bill.status }}</span>
              <p class="text-white/60 text-xs mt-2">{{ bill.billingMonth }}</p>
            </div>
          </div>
        </div>

        <div class="p-6">
          <!-- Consumer Details -->
          <div class="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <div>
              <h4 class="text-xs font-bold text-text-muted uppercase tracking-wider mb-3">Consumer Details</h4>
              <div class="space-y-2">
                <div class="flex justify-between text-sm border-b border-dashed border-border pb-2">
                  <span class="text-text-muted">Name</span>
                  <span class="font-semibold">{{ bill.customerName }}</span>
                </div>
                <div class="flex justify-between text-sm border-b border-dashed border-border pb-2">
                  <span class="text-text-muted">Consumer No.</span>
                  <span class="font-semibold">{{ bill.consumerNumber }}</span>
                </div>
                <div class="flex justify-between text-sm border-b border-dashed border-border pb-2">
                  <span class="text-text-muted">Meter No.</span>
                  <span class="font-semibold">{{ bill.meterNumber }}</span>
                </div>
              </div>
            </div>
            <div>
              <h4 class="text-xs font-bold text-text-muted uppercase tracking-wider mb-3">Billing Period</h4>
              <div class="space-y-2">
                <div class="flex justify-between text-sm border-b border-dashed border-border pb-2">
                  <span class="text-text-muted">Period</span>
                  <span class="font-semibold">{{ bill.readingPeriod }}</span>
                </div>
                <div class="flex justify-between text-sm border-b border-dashed border-border pb-2">
                  <span class="text-text-muted">Previous Reading</span>
                  <span class="font-semibold">{{ bill.previousReading }} units</span>
                </div>
                <div class="flex justify-between text-sm border-b border-dashed border-border pb-2">
                  <span class="text-text-muted">Current Reading</span>
                  <span class="font-semibold">{{ bill.currentReading }} units</span>
                </div>
              </div>
            </div>
          </div>

          <hr class="divider">

          <!-- Charges Breakdown -->
          <h4 class="text-xs font-bold text-text-muted uppercase tracking-wider mb-3">Charges Breakdown</h4>
          <div class="bg-card-hover border border-border rounded-xl p-6">
            <div class="flex justify-between items-center py-2 border-b border-dashed border-border last:border-b-0"><span class="text-[0.82rem] text-text-secondary">Units Consumed</span><span class="text-[0.85rem] font-semibold text-text-primary">{{ bill.unitsConsumed }} kWh</span></div>
            <div class="flex justify-between items-center py-2 border-b border-dashed border-border last:border-b-0"><span class="text-[0.82rem] text-text-secondary">Rate per Unit</span><span class="text-[0.85rem] font-semibold text-text-primary">₹{{ bill.ratePerUnit }}</span></div>
            <div class="flex justify-between items-center py-2 border-b border-dashed border-border last:border-b-0"><span class="text-[0.82rem] text-text-secondary">Energy Charges (Slab)</span><span class="text-[0.85rem] font-semibold text-text-primary">₹{{ bill.slabCharges }}</span></div>
            <div class="flex justify-between items-center py-2 border-b border-dashed border-border last:border-b-0"><span class="text-[0.82rem] text-text-secondary">Taxes & Surcharges (11%)</span><span class="text-[0.85rem] font-semibold text-text-primary">₹{{ bill.taxes }}</span></div>
            <div class="flex justify-between items-center py-2 border-b border-dashed border-border last:border-b-0 flex justify-between items-center py-2 border-b border-dashed border-border last:border-b-0 mt-2"><span class="text-[0.82rem] text-text-secondary">Total Amount Due</span><span class="text-[0.85rem] font-semibold text-text-primary">₹{{ bill.totalAmount }}</span></div>
          </div>

          <div class="flex justify-between items-center mt-4 text-xs text-text-muted">
            <span>Due Date: {{ bill.dueDate | date:'dd MMM yyyy' }}</span>
            @if (bill.paidDate) {
              <span class="text-success font-semibold">Paid on {{ bill.paidDate | date:'dd MMM yyyy' }}</span>
            }
          </div>

          <hr class="divider">

          <!-- Actions -->
          <div class="flex gap-3 flex-wrap no-print">
            <button class="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-lg text-[0.85rem] font-semibold cursor-pointer transition-all bg-card text-text-primary border border-border hover:bg-card-hover disabled:opacity-50 disabled:cursor-not-allowed" (click)="printBill()"><span class="material-symbols-outlined text-[1.2em] align-middle">print</span> Download PDF</button>
            @if (bill.status !== 'Paid') {
              <a class="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-lg text-[0.85rem] font-semibold cursor-pointer transition-all bg-green-500 text-white border-none hover:bg-green-600 disabled:opacity-50 disabled:cursor-not-allowed" routerLink="/customer/pay-bill"><span class="material-symbols-outlined text-[1.2em] align-middle">credit_card</span> Pay Now</a>
            }
          </div>
        </div>
      </div>
    } @else {
      <div class="bg-card rounded-2xl shadow-sm border border-border overflow-hidden">
        <div class="card-body">
          <div class="empty-state">
            <div class="empty-icon"><span class="material-symbols-outlined text-[1.2em] align-middle">description</span></div>
            <h3>No Bills Found</h3>
            <p>No bills are currently available for your account.</p>
          </div>
        </div>
      </div>
    }
  `
})
export class ViewBillComponent implements OnInit {
  private billService = inject(BillService);
  private auth = inject(AuthService);
  bill?: Bill;

  ngOnInit() {
    const consumerNo = this.auth.getCurrentUser()?.consumerNumber || 'CON-001';
    this.billService.getLatest(consumerNo).subscribe(b => this.bill = b);
  }

  printBill() { window.print(); }
}




