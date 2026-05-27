import { Component, inject, OnInit } from '@angular/core';
import { FormBuilder, Validators, ReactiveFormsModule, AbstractControl, ValidationErrors } from '@angular/forms';
import { BillService } from '../../shared/services/bill.service';
import { ToastService } from '../../shared/services/toast.service';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';

@Component({
  selector: 'app-add-bill',
  standalone: true,
  imports: [ReactiveFormsModule],
  template: `
    <div class="mb-6">
<h1 class="m-0 mb-1 text-[1.4rem] font-bold text-[#003087] dark:text-blue-400">Add Bill</h1>
<p class="m-0 label">Generate a new electricity bill for a consumer</p>
</div>

    <div class="grid grid-cols-1 lg:grid-cols-[1fr_360px] gap-6 items-start">
      <div class="bg-card rounded-2xl shadow-sm border border-border overflow-hidden">
        <div class="card-header"><h3>Bill Details</h3></div>
        <div class="card-body">
          <form [formGroup]="billForm">
            <div class="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 mb-4">
              <div class="flex flex-col gap-1.5">
                <label class="block text-[0.78rem] font-semibold text-text-primary mb-1.5">Consumer Number</label>
                <div class="flex gap-2">
                  <input class="w-full px-3.5 py-2.5 border-[1.5px] border-input-border rounded-lg text-[0.85rem] text-input-text bg-input-bg outline-none transition-colors focus:border-[#0066CC] focus:ring-[3px] focus:ring-[#0066CC]/10 dark:focus:border-blue-500 dark:focus:ring-blue-500/20 placeholder:text-text-muted flex-1" formControlName="consumerNumber" placeholder="e.g. 1234567890123"
                    [class.error]="f('consumerNumber')?.invalid && f('consumerNumber')?.touched">
                  <button class="px-4 py-2 bg-card-hover border border-border rounded-lg text-xs font-semibold hover:bg-border transition-colors disabled:opacity-50" type="button" (click)="fetchConsumerDetails()" [disabled]="!f('consumerNumber')?.value">Fetch</button>
                </div>
                @if (f('consumerNumber')?.hasError('required') && f('consumerNumber')?.touched) {
                  <span class="text-[0.72rem] text-red-500 mt-1">Consumer number is required</span>
                }
                @if (f('consumerNumber')?.hasError('pattern') && f('consumerNumber')?.touched) {
                  <span class="text-[0.72rem] text-red-500 mt-1">Format must be 13 digits</span>
                }
              </div>
              <div class="flex flex-col gap-1.5">
                <label class="block text-[0.78rem] font-semibold text-text-primary mb-1.5">Customer Name</label>
                <input class="w-full px-3.5 py-2.5 border-[1.5px] border-input-border rounded-lg text-[0.85rem] text-input-text bg-input-bg outline-none transition-colors focus:border-[#0066CC] focus:ring-[3px] focus:ring-[#0066CC]/10 dark:focus:border-blue-500 dark:focus:ring-blue-500/20 placeholder:text-text-muted opacity-80" formControlName="customerName" placeholder="Auto-filled" readonly>
                @if (f('customerName')?.hasError('required') && f('customerName')?.touched) {
                  <span class="text-[0.72rem] text-red-500 mt-1">Customer name is required</span>
                }
              </div>
            </div>
            <div class="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 mb-4">
              <div class="flex flex-col gap-1.5">
                <label class="block text-[0.78rem] font-semibold text-text-primary mb-1.5">Billing Month</label>
                <input class="w-full px-3.5 py-2.5 border-[1.5px] border-input-border rounded-lg text-[0.85rem] text-input-text bg-input-bg outline-none transition-colors focus:border-[#0066CC] focus:ring-[3px] focus:ring-[#0066CC]/10 dark:focus:border-blue-500 dark:focus:ring-blue-500/20 placeholder:text-text-muted" formControlName="billingMonth" placeholder="e.g., May 2025"
                  [class.error]="f('billingMonth')?.invalid && f('billingMonth')?.touched">
                @if (f('billingMonth')?.hasError('required') && f('billingMonth')?.touched) {
                  <span class="text-[0.72rem] text-red-500 mt-1">Billing month is required</span>
                }
              </div>
              <div class="flex flex-col gap-1.5">
                <label class="block text-[0.78rem] font-semibold text-text-primary mb-1.5">Meter Number</label>
                <input class="w-full px-3.5 py-2.5 border-[1.5px] border-input-border rounded-lg text-[0.85rem] text-input-text bg-input-bg outline-none transition-colors focus:border-[#0066CC] focus:ring-[3px] focus:ring-[#0066CC]/10 dark:focus:border-blue-500 dark:focus:ring-blue-500/20 placeholder:text-text-muted opacity-80" formControlName="meterNumber" placeholder="Auto-filled" readonly>
                @if (f('meterNumber')?.hasError('required') && f('meterNumber')?.touched) {
                  <span class="text-[0.72rem] text-red-500 mt-1">Meter number is required</span>
                }
              </div>
            </div>
            <div class="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 mb-4">
              <div class="flex flex-col gap-1.5">
                <label class="block text-[0.78rem] font-semibold text-text-primary mb-1.5">Previous Reading</label>
                <input class="w-full px-3.5 py-2.5 border-[1.5px] border-input-border rounded-lg text-[0.85rem] text-input-text bg-input-bg outline-none transition-colors focus:border-[#0066CC] focus:ring-[3px] focus:ring-[#0066CC]/10 dark:focus:border-blue-500 dark:focus:ring-blue-500/20 placeholder:text-text-muted" type="number" formControlName="previousReading"
                  [class.error]="f('previousReading')?.invalid && f('previousReading')?.touched">
                @if (f('previousReading')?.hasError('required') && f('previousReading')?.touched) {
                  <span class="text-[0.72rem] text-red-500 mt-1">Previous reading is required</span>
                }
                @if (f('previousReading')?.hasError('min') && f('previousReading')?.touched) {
                  <span class="text-[0.72rem] text-red-500 mt-1">Reading cannot be negative</span>
                }
              </div>
              <div class="flex flex-col gap-1.5">
                <label class="block text-[0.78rem] font-semibold text-text-primary mb-1.5">Current Reading</label>
                <input class="w-full px-3.5 py-2.5 border-[1.5px] border-input-border rounded-lg text-[0.85rem] text-input-text bg-input-bg outline-none transition-colors focus:border-[#0066CC] focus:ring-[3px] focus:ring-[#0066CC]/10 dark:focus:border-blue-500 dark:focus:ring-blue-500/20 placeholder:text-text-muted" type="number" formControlName="currentReading"
                  [class.error]="(f('currentReading')?.invalid || billForm.hasError('readingMismatch')) && f('currentReading')?.touched">
                @if (f('currentReading')?.hasError('required') && f('currentReading')?.touched) {
                  <span class="text-[0.72rem] text-red-500 mt-1">Current reading is required</span>
                }
                @if (f('currentReading')?.hasError('min') && f('currentReading')?.touched) {
                  <span class="text-[0.72rem] text-red-500 mt-1">Reading cannot be negative</span>
                }
                @if (billForm.hasError('readingMismatch') && f('currentReading')?.touched) {
                  <span class="text-[0.72rem] text-red-500 mt-1">Current reading must be ≥ previous reading</span>
                }
              </div>
            </div>
            <div class="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 mb-4">
              <div class="flex flex-col gap-1.5">
                <label class="block text-[0.78rem] font-semibold text-text-primary mb-1.5">Due Date</label>
                <input class="w-full px-3.5 py-2.5 border-[1.5px] border-input-border rounded-lg text-[0.85rem] text-input-text bg-input-bg outline-none transition-colors focus:border-[#0066CC] focus:ring-[3px] focus:ring-[#0066CC]/10 dark:focus:border-blue-500 dark:focus:ring-blue-500/20 placeholder:text-text-muted" type="date" formControlName="dueDate"
                  [class.error]="f('dueDate')?.invalid && f('dueDate')?.touched">
                @if (f('dueDate')?.hasError('required') && f('dueDate')?.touched) {
                  <span class="text-[0.72rem] text-red-500 mt-1">Due date is required</span>
                }
              </div>
              <div class="flex flex-col gap-1.5">
                <label class="block text-[0.78rem] font-semibold text-text-primary mb-1.5">Area</label>
                <div class="relative w-full"><select class="w-full px-3.5 py-2.5 border-[1.5px] border-input-border rounded-lg text-[0.85rem] text-input-text bg-input-bg outline-none transition-colors focus:border-[#0066CC] focus:ring-[3px] focus:ring-[#0066CC]/10 dark:focus:border-blue-500 dark:focus:ring-blue-500/20 appearance-none pr-9" formControlName="zone">
                  <option value="Vijay Nagar">Vijay Nagar</option>
                  <option value="Rau">Rau</option>
                  <option value="Pithampur">Pithampur</option>
                  <option value="Freeganj">Freeganj</option>
                  <option value="Dewas">Dewas</option>
                  <option value="Ujjain">Ujjain</option>
                  <option value="Indore">Indore</option>
                  <option value="Maksi Road">Maksi Road</option>
                  <option value="Tarana">Tarana</option>
                  <option value="Nagda">Nagda</option>
                </select><span class="material-symbols-outlined absolute right-3 top-1/2 -translate-y-1/2 text-text-muted pointer-events-none">expand_more</span></div>
              </div>
            </div>

            <button class="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-lg text-[0.85rem] font-semibold cursor-pointer transition-all bg-gradient-to-br from-[#003087] to-[#0066CC] text-white border-none shadow-[0_4px_12px_rgba(0,102,204,0.3)] hover:shadow-[0_6px_16px_rgba(0,102,204,0.4)] hover:-translate-y-px disabled:opacity-50 disabled:cursor-not-allowed w-full py-3 mt-4" (click)="submit()" [disabled]="submitting || billForm.invalid">
              @if (submitting) { <span class="material-symbols-outlined text-[1.2em] align-middle">hourglass_empty</span> Generating... } @else { <span class="material-symbols-outlined text-[1.2em] align-middle">description</span> Generate Bill }
            </button>
          </form>
        </div>
      </div>

      <!-- Live Preview -->
      <div>
        <div class="bg-card rounded-2xl shadow-sm border border-border overflow-hidden mb-4">
          <div class="card-header"><h3>Bill Preview</h3></div>
          <div class="card-body">
            <div class="bg-card-hover border border-border rounded-xl p-6">
              <div class="flex justify-between items-center py-2 border-b border-dashed border-border last:border-b-0"><span class="text-[0.82rem] text-text-secondary">Units Consumed</span><span class="text-[0.85rem] font-semibold text-text-primary">{{ calc.units }} kWh</span></div>
              <div class="flex justify-between items-center py-2 border-b border-dashed border-border last:border-b-0"><span class="text-[0.82rem] text-text-secondary">Slab Charges</span><span class="text-[0.85rem] font-semibold text-text-primary">₹{{ calc.slabCharges }}</span></div>
              <div class="flex justify-between items-center py-2 border-b border-dashed border-border last:border-b-0"><span class="text-[0.82rem] text-text-secondary">Taxes (11%)</span><span class="text-[0.85rem] font-semibold text-text-primary">₹{{ calc.taxes }}</span></div>
              <div class="flex justify-between items-center py-2 border-b border-dashed border-border last:border-b-0 flex justify-between items-center py-2 border-b border-dashed border-border last:border-b-0 mt-2"><span class="text-[0.82rem] text-text-secondary">Total Amount</span><span class="text-[0.85rem] font-semibold text-text-primary">₹{{ calc.total }}</span></div>
            </div>
          </div>
        </div>

        <!-- CSV Bulk Upload -->
        <div class="bg-card rounded-2xl shadow-sm border border-border overflow-hidden">
          <div class="card-header"><h3>Bulk Upload</h3></div>
          <div class="card-body">
            <div class="border-2 border-dashed border-border rounded-xl p-6 text-center hover:border-accent/50 transition-colors cursor-pointer"
              (click)="csvInput.click()">
              <p class="text-2xl mb-2"><span class="material-symbols-outlined text-[1.2em] align-middle">folder</span></p>
              <p class="text-sm text-text-muted">Drop CSV file here or click to browse</p>
              <p class="text-xs text-text-muted mt-1">Max file size: 5MB</p>
              <input #csvInput type="file" class="hidden" accept=".csv">
            </div>
            <button class="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-lg text-[0.85rem] font-semibold cursor-pointer transition-all bg-card text-text-primary border border-border hover:bg-card-hover disabled:opacity-50 disabled:cursor-not-allowed w-full mt-3 text-xs"><span class="material-symbols-outlined text-[1.2em] align-middle">download</span> Download CSV Template</button>
          </div>
        </div>
      </div>
    </div>
  `
})
export class AddBillComponent implements OnInit {
  private billService = inject(BillService);
  private toast = inject(ToastService);
  private fb = inject(FormBuilder);
  private http = inject(HttpClient);

  billForm = this.fb.group({
    consumerNumber: ['', [Validators.required, Validators.pattern(/^\d{13}$/)]],
    customerName: ['', Validators.required],
    billingMonth: ['', Validators.required],
    meterNumber: ['', Validators.required],
    previousReading: [0, [Validators.required, Validators.min(0)]],
    currentReading: [0, [Validators.required, Validators.min(0)]],
    dueDate: ['', Validators.required],
    zone: ['Vijay Nagar'],
  }, { validators: [this.readingValidator] });

  calc = { units: 0, slabCharges: 0, taxes: 0, total: 0 };
  submitting = false;

  f(field: string) { return this.billForm.get(field); }

  ngOnInit() {
    this.billForm.valueChanges.subscribe(() => {
      this.calculate();
    });
  }

  fetchConsumerDetails() {
    const num = this.billForm.get('consumerNumber')?.value;
    if (!num || num.length !== 13) {
      this.toast.error('Enter a valid 13-digit consumer number');
      return;
    }
    
    // Attempt to fetch from backend
    this.http.get<any>(`${environment.apiUrl}/consumers/number/${num}`).subscribe({
      next: (consumer) => {
        this.billForm.patchValue({
          customerName: consumer.name,
          meterNumber: consumer.meterNumber
        });
        this.toast.success('Consumer details fetched successfully!');
      },
      error: () => {
        this.toast.error('Consumer not found. Please check the number.');
        this.billForm.patchValue({
          customerName: '',
          meterNumber: ''
        });
      }
    });
  }

  readingValidator(control: AbstractControl): ValidationErrors | null {
    const prev = control.get('previousReading')?.value;
    const curr = control.get('currentReading')?.value;
    if (prev != null && curr != null && curr < prev) {
      return { readingMismatch: true };
    }
    return null;
  }

  calculate() {
    this.calc = this.billService.calculateBill(this.billForm.value.previousReading || 0, this.billForm.value.currentReading || 0);
  }

  submit() {
    if (this.billForm.invalid) { this.billForm.markAllAsTouched(); this.toast.error('Please fix validation errors'); return; }
    this.submitting = true;
    const val = this.billForm.value;
    this.billService.add({
      ...val,
      readingPeriod: val.billingMonth,
      unitsConsumed: this.calc.units,
      ratePerUnit: 5.5,
      slabCharges: this.calc.slabCharges,
      taxes: this.calc.taxes,
      totalAmount: this.calc.total,
      status: 'Unpaid',
    } as any).subscribe(() => {
      this.submitting = false;
      this.toast.success('Bill generated successfully!');
    });
  }
}






