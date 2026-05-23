import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, Validators, ReactiveFormsModule } from '@angular/forms';
import { BillService, Bill } from '../../shared/services/bill.service';
import { PaymentService, PaymentReceipt } from '../../shared/services/payment.service';
import { AuthService } from '../../shared/services/auth.service';
import { ToastService } from '../../shared/services/toast.service';

@Component({
  selector: 'app-pay-bill',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  template: `
    <!-- Success Screen -->
    @if (receipt) {
      <div class="bg-card rounded-2xl shadow-sm border border-border overflow-hidden">
        <div class="card-body text-center py-12 px-4">
          <div class="w-20 h-20 rounded-full bg-gradient-to-br from-green-500 to-green-600 flex items-center justify-center text-3xl text-white mx-auto mb-6 shadow-[0_0_0_12px_rgba(34,197,94,0.1)] animate-[bounceIn_0.5s_ease-out]">✅</div>
          <h2>Payment Successful!</h2>
          <p>Your electricity bill has been paid successfully.</p>

          <!-- Confetti dots -->
          <div class="relative">
            @for (i of [1,2,3,4,5,6]; track i) {
              <div class="absolute w-2 h-2 rounded-full animate-bounce-in"
                [style.background]="['#003087','#F5C518','#22C55E','#0066CC','#EF4444','#F59E0B'][i-1]"
                [style.left.%]="[10,30,50,70,85,20][i-1]"
                [style.top.px]="[-20,-30,-10,-25,-15,-35][i-1]"
                [style.animation-delay]="i * 0.1 + 's'">
              </div>
            }
          </div>

          <div class="bg-card-hover border border-border rounded-xl p-6 mx-auto mt-6 w-full max-w-5xl">
            <div class="flex justify-between items-center py-2 border-b border-dashed border-border last:border-b-0"><span class="text-[0.82rem] text-text-secondary">Receipt No.</span><span class="text-[0.85rem] font-semibold text-text-primary">{{ receipt.receiptNumber }}</span></div>
            <div class="flex justify-between items-center py-2 border-b border-dashed border-border last:border-b-0"><span class="text-[0.82rem] text-text-secondary">Transaction ID</span><span class="text-[0.85rem] font-semibold text-text-primary">{{ receipt.transactionId }}</span></div>
            <div class="flex justify-between items-center py-2 border-b border-dashed border-border last:border-b-0"><span class="text-[0.82rem] text-text-secondary">Consumer No.</span><span class="text-[0.85rem] font-semibold text-text-primary">{{ receipt.consumerNumber }}</span></div>
            <div class="flex justify-between items-center py-2 border-b border-dashed border-border last:border-b-0"><span class="text-[0.82rem] text-text-secondary">Payment Method</span><span class="text-[0.85rem] font-semibold text-text-primary">{{ receipt.method }}</span></div>
            <div class="flex justify-between items-center py-2 border-b border-dashed border-border last:border-b-0"><span class="text-[0.82rem] text-text-secondary">Date & Time</span><span class="text-[0.85rem] font-semibold text-text-primary">{{ receipt.date }}</span></div>
            <div class="flex justify-between items-center py-2 border-b border-dashed border-border last:border-b-0 flex justify-between items-center py-2 border-b border-dashed border-border last:border-b-0 mt-2"><span class="text-[0.82rem] text-text-secondary">Amount Paid</span><span class="text-[0.85rem] font-semibold text-text-primary">₹{{ receipt.amount }}</span></div>
          </div>

          <div class="flex gap-3 justify-center flex-wrap mt-6">
            <button class="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-lg text-[0.85rem] font-semibold cursor-pointer transition-all bg-gradient-to-br from-[#003087] to-[#0066CC] text-white border-none shadow-[0_4px_12px_rgba(0,102,204,0.3)] hover:shadow-[0_6px_16px_rgba(0,102,204,0.4)] hover:-translate-y-px disabled:opacity-50 disabled:cursor-not-allowed" (click)="printReceipt()">🖨️ Print Receipt</button>
            <button class="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-lg text-[0.85rem] font-semibold cursor-pointer transition-all bg-card text-text-primary border border-border hover:bg-card-hover disabled:opacity-50 disabled:cursor-not-allowed" (click)="reset()">← Pay Another Bill</button>
          </div>
        </div>
      </div>
    }

    <!-- Payment Form -->
    @if (!receipt && bill) {
      <div class="mb-6">
<h1 class="m-0 mb-1 text-[1.4rem] font-bold text-[#003087] dark:text-blue-400">Pay Bill</h1>
<p class="m-0 label">Complete your electricity bill payment securely</p>
</div>

      <div class="grid grid-cols-1 lg:grid-cols-[1fr_380px] gap-6 items-start">
        <div>
          <!-- Payment Method -->
          <div class="bg-card rounded-2xl shadow-sm border border-border overflow-hidden mb-4">
            <div class="card-header"><h3>Select Payment Method</h3></div>
            <div class="card-body">
              <div class="flex gap-2 mb-6 bg-surface p-1 rounded-xl">
                @for (m of methods; track m.value) {
                  <button class="flex-1 py-2.5 rounded-lg text-sm font-medium transition-all"
                    [class]="method === m.value ? 'bg-white text-text-primary shadow-sm' : 'text-text-muted hover:text-text-primary'"
                    (click)="switchMethod(m.value)">
                    {{ m.icon }} {{ m.label }}
                  </button>
                }
              </div>

              <form [formGroup]="paymentForm">
                <!-- UPI -->
                @if (method === 'UPI') {
                  <div class="text-center py-4">
                    <div class="text-4xl mb-2">📱</div>
                    <p class="text-text-muted text-sm mb-4">Enter your UPI ID to proceed</p>
                    <input class="w-full px-3.5 py-2.5 border-[1.5px] border-input-border rounded-lg text-[0.85rem] text-input-text bg-input-bg outline-none transition-colors focus:border-[#0066CC] focus:ring-[3px] focus:ring-[#0066CC]/10 dark:focus:border-blue-500 dark:focus:ring-blue-500/20 placeholder:text-text-muted mx-auto" style="max-width: 300px;" type="text" formControlName="upiId" placeholder="yourname&#64;upi"
                      [class.error]="f('upiId')?.invalid && f('upiId')?.touched">
                    @if (f('upiId')?.hasError('required') && f('upiId')?.touched) {
                      <span class="text-[0.72rem] text-red-500 mt-1">UPI ID is required</span>
                    }
                    @if (f('upiId')?.hasError('pattern') && f('upiId')?.touched) {
                      <span class="text-[0.72rem] text-red-500 mt-1">Enter a valid UPI ID (e.g., name&#64;upi)</span>
                    }
                  </div>
                }

                <!-- Card -->
                @if (method === 'Card') {
                  <div class="space-y-3">
                    <div>
                      <label class="block text-[0.78rem] font-semibold text-text-primary mb-1.5">Card Number</label>
                      <input class="w-full px-3.5 py-2.5 border-[1.5px] border-input-border rounded-lg text-[0.85rem] text-input-text bg-input-bg outline-none transition-colors focus:border-[#0066CC] focus:ring-[3px] focus:ring-[#0066CC]/10 dark:focus:border-blue-500 dark:focus:ring-blue-500/20 placeholder:text-text-muted" type="text" formControlName="cardNumber" placeholder="1234 5678 9012 3456" maxlength="16"
                        [class.error]="f('cardNumber')?.invalid && f('cardNumber')?.touched">
                      @if (f('cardNumber')?.hasError('required') && f('cardNumber')?.touched) {
                        <span class="text-[0.72rem] text-red-500 mt-1">Card number is required</span>
                      }
                      @if (f('cardNumber')?.hasError('pattern') && f('cardNumber')?.touched) {
                        <span class="text-[0.72rem] text-red-500 mt-1">Enter a valid 16-digit card number</span>
                      }
                    </div>
                    <div class="grid grid-cols-2 gap-3">
                      <div>
                        <label class="block text-[0.78rem] font-semibold text-text-primary mb-1.5">Expiry</label>
                        <input class="w-full px-3.5 py-2.5 border-[1.5px] border-input-border rounded-lg text-[0.85rem] text-input-text bg-input-bg outline-none transition-colors focus:border-[#0066CC] focus:ring-[3px] focus:ring-[#0066CC]/10 dark:focus:border-blue-500 dark:focus:ring-blue-500/20 placeholder:text-text-muted" type="text" formControlName="cardExpiry" placeholder="MM/YY" maxlength="5"
                          [class.error]="f('cardExpiry')?.invalid && f('cardExpiry')?.touched">
                        @if (f('cardExpiry')?.hasError('required') && f('cardExpiry')?.touched) {
                          <span class="text-[0.72rem] text-red-500 mt-1">Expiry is required</span>
                        }
                        @if (f('cardExpiry')?.hasError('pattern') && f('cardExpiry')?.touched) {
                          <span class="text-[0.72rem] text-red-500 mt-1">Format: MM/YY</span>
                        }
                      </div>
                      <div>
                        <label class="block text-[0.78rem] font-semibold text-text-primary mb-1.5">CVV</label>
                        <input class="w-full px-3.5 py-2.5 border-[1.5px] border-input-border rounded-lg text-[0.85rem] text-input-text bg-input-bg outline-none transition-colors focus:border-[#0066CC] focus:ring-[3px] focus:ring-[#0066CC]/10 dark:focus:border-blue-500 dark:focus:ring-blue-500/20 placeholder:text-text-muted" type="password" formControlName="cardCvv" placeholder="•••" maxlength="3"
                          [class.error]="f('cardCvv')?.invalid && f('cardCvv')?.touched">
                        @if (f('cardCvv')?.hasError('required') && f('cardCvv')?.touched) {
                          <span class="text-[0.72rem] text-red-500 mt-1">CVV is required</span>
                        }
                        @if (f('cardCvv')?.hasError('pattern') && f('cardCvv')?.touched) {
                          <span class="text-[0.72rem] text-red-500 mt-1">Enter 3 digits</span>
                        }
                      </div>
                    </div>
                    <div>
                      <label class="block text-[0.78rem] font-semibold text-text-primary mb-1.5">Card Holder Name</label>
                      <input class="w-full px-3.5 py-2.5 border-[1.5px] border-input-border rounded-lg text-[0.85rem] text-input-text bg-input-bg outline-none transition-colors focus:border-[#0066CC] focus:ring-[3px] focus:ring-[#0066CC]/10 dark:focus:border-blue-500 dark:focus:ring-blue-500/20 placeholder:text-text-muted" type="text" formControlName="cardName" placeholder="Name on card"
                        [class.error]="f('cardName')?.invalid && f('cardName')?.touched">
                      @if (f('cardName')?.hasError('required') && f('cardName')?.touched) {
                        <span class="text-[0.72rem] text-red-500 mt-1">Cardholder name is required</span>
                      }
                    </div>
                  </div>
                }

                <!-- Net Banking -->
                @if (method === 'NetBanking') {
                  <div>
                    <div class="grid grid-cols-3 gap-3">
                      @for (b of banks; track b.name) {
                        <button
                          type="button"
                          class="flex flex-col items-center gap-1 p-3 border-2 rounded-xl transition-all"
                          [class]="selectedBank === b.name ? 'border-primary bg-sky' : 'border-border hover:border-accent/30'"
                          (click)="selectBank(b.name)"
                        >
                          <span class="text-2xl">{{ b.icon }}</span>
                          <span class="text-xs font-semibold">{{ b.name }}</span>
                        </button>
                      }
                    </div>
                    @if (f('selectedBank')?.hasError('required') && f('selectedBank')?.touched) {
                      <span class="text-[0.72rem] text-red-500 mt-1 mt-2 block">Please select a bank</span>
                    }
                  </div>
                }
              </form>

              <button class="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-lg text-[0.85rem] font-semibold cursor-pointer transition-all bg-green-500 text-white border-none hover:bg-green-600 disabled:opacity-50 disabled:cursor-not-allowed w-full mt-5 py-3" (click)="pay()" [disabled]="paying || !isPaymentValid">
                {{ paying ? '⏳ Processing...' : ('💳 Pay ₹' + bill.totalAmount) }}
              </button>
            </div>
          </div>
        </div>

        <!-- Bill Summary Sidebar -->
        <div class="bg-card rounded-2xl shadow-sm border border-border overflow-hidden">
          <div class="card-header"><h3>Bill Summary</h3></div>
          <div class="card-body">
            <div class="bg-card-hover border border-border rounded-xl p-6">
              <div class="flex justify-between items-center py-2 border-b border-dashed border-border last:border-b-0"><span class="text-[0.82rem] text-text-secondary">Consumer No.</span><span class="text-[0.85rem] font-semibold text-text-primary">{{ bill.consumerNumber }}</span></div>
              <div class="flex justify-between items-center py-2 border-b border-dashed border-border last:border-b-0"><span class="text-[0.82rem] text-text-secondary">Billing Month</span><span class="text-[0.85rem] font-semibold text-text-primary">{{ bill.billingMonth }}</span></div>
              <div class="flex justify-between items-center py-2 border-b border-dashed border-border last:border-b-0"><span class="text-[0.82rem] text-text-secondary">Units Used</span><span class="text-[0.85rem] font-semibold text-text-primary">{{ bill.unitsConsumed }} kWh</span></div>
              <div class="flex justify-between items-center py-2 border-b border-dashed border-border last:border-b-0"><span class="text-[0.82rem] text-text-secondary">Slab Charges</span><span class="text-[0.85rem] font-semibold text-text-primary">₹{{ bill.slabCharges }}</span></div>
              <div class="flex justify-between items-center py-2 border-b border-dashed border-border last:border-b-0"><span class="text-[0.82rem] text-text-secondary">Taxes</span><span class="text-[0.85rem] font-semibold text-text-primary">₹{{ bill.taxes }}</span></div>
              <div class="flex justify-between items-center py-2 border-b border-dashed border-border last:border-b-0 flex justify-between items-center py-2 border-b border-dashed border-border last:border-b-0 mt-2"><span class="text-[0.82rem] text-text-secondary">Total Due</span><span class="text-[0.85rem] font-semibold text-text-primary">₹{{ bill.totalAmount }}</span></div>
            </div>
            <div class="mt-4 bg-success/10 border border-success/30 rounded-lg px-3 py-2 text-xs text-success">
              🔒 Your payment is secured with 256-bit SSL encryption
            </div>
          </div>
        </div>
      </div>
    }

    @if (!receipt && !bill) {
      <div class="bg-card rounded-2xl shadow-sm border border-border overflow-hidden">
        <div class="card-body">
          <div class="empty-state">
            <div class="empty-icon">💳</div>
            <h3>No Unpaid Bills</h3>
            <p>All your bills are paid. Check back later.</p>
          </div>
        </div>
      </div>
    }
  `
})
export class PayBillComponent implements OnInit {
  private billService = inject(BillService);
  private payService = inject(PaymentService);
  private auth = inject(AuthService);
  private toast = inject(ToastService);
  private fb = inject(FormBuilder);

  bill?: Bill;
  receipt?: PaymentReceipt;
  method: 'UPI' | 'Card' | 'NetBanking' = 'UPI';
  paying = false;
  selectedBank = '';

  paymentForm = this.fb.group({
    upiId: ['', [Validators.required, Validators.pattern(/^[\w.\-]+@[\w]+$/)]],
    cardNumber: [''],
    cardExpiry: [''],
    cardCvv: [''],
    cardName: [''],
    selectedBank: [''],
  });

  methods = [
    { value: 'UPI' as const, label: 'UPI', icon: '📱' },
    { value: 'Card' as const, label: 'Card', icon: '💳' },
    { value: 'NetBanking' as const, label: 'Net Banking', icon: '🏦' },
  ];

  banks = [
    { name: 'SBI', icon: '🏛️' }, { name: 'HDFC', icon: '🏦' }, { name: 'ICICI', icon: '💼' },
    { name: 'Axis', icon: '🔵' }, { name: 'Kotak', icon: '🔴' }, { name: 'PNB', icon: '🟠' },
  ];

  f(field: string) { return this.paymentForm.get(field); }

  ngOnInit() {
    const consumerNo = this.auth.getCurrentUser()?.consumerNumber || 'CON-001';
    this.billService.getLatest(consumerNo).subscribe(b => {
      if (b && b.status !== 'Paid') this.bill = b;
    });
    this.applyMethodValidators();
  }

  switchMethod(m: 'UPI' | 'Card' | 'NetBanking') {
    this.method = m;
    this.applyMethodValidators();
  }

  selectBank(name: string) {
    this.selectedBank = name;
    this.paymentForm.patchValue({ selectedBank: name });
  }

  private applyMethodValidators() {
    const f = this.paymentForm;
    // Reset all validators first
    f.get('upiId')?.clearValidators();
    f.get('cardNumber')?.clearValidators();
    f.get('cardExpiry')?.clearValidators();
    f.get('cardCvv')?.clearValidators();
    f.get('cardName')?.clearValidators();
    f.get('selectedBank')?.clearValidators();

    switch (this.method) {
      case 'UPI':
        f.get('upiId')?.setValidators([Validators.required, Validators.pattern(/^[\w.\-]+@[\w]+$/)]);
        break;
      case 'Card':
        f.get('cardNumber')?.setValidators([Validators.required, Validators.pattern(/^\d{16}$/)]);
        f.get('cardExpiry')?.setValidators([Validators.required, Validators.pattern(/^(0[1-9]|1[0-2])\/\d{2}$/)]);
        f.get('cardCvv')?.setValidators([Validators.required, Validators.pattern(/^\d{3}$/)]);
        f.get('cardName')?.setValidators([Validators.required]);
        break;
      case 'NetBanking':
        f.get('selectedBank')?.setValidators([Validators.required]);
        break;
    }

    // Update validity for all fields
    Object.keys(f.controls).forEach(key => {
      f.get(key)?.updateValueAndValidity();
      f.get(key)?.markAsUntouched();
    });
  }

  get isPaymentValid(): boolean {
    switch (this.method) {
      case 'UPI':
        return this.paymentForm.get('upiId')?.valid ?? false;
      case 'Card':
        return (this.paymentForm.get('cardNumber')?.valid ?? false) &&
               (this.paymentForm.get('cardExpiry')?.valid ?? false) &&
               (this.paymentForm.get('cardCvv')?.valid ?? false) &&
               (this.paymentForm.get('cardName')?.valid ?? false);
      case 'NetBanking':
        return (this.paymentForm.get('selectedBank')?.valid ?? false);
      default:
        return false;
    }
  }

  pay() {
    this.paymentForm.markAllAsTouched();
    if (!this.isPaymentValid) { this.toast.error('Please fix payment details'); return; }
    if (!this.bill) return;
    this.paying = true;
    setTimeout(() => {
      const user = this.auth.getCurrentUser();
      this.payService.pay(this.bill!.consumerNumber, this.bill!.totalAmount, this.method, user?.name || 'Customer')
        .subscribe(r => {
          this.receipt = r;
          this.paying = false;
          this.toast.success('Payment successful! 🎉');
        });
    }, 1500);
  }

  reset() { this.receipt = undefined; }
  printReceipt() { window.print(); }
}






