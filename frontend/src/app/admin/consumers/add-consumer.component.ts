import { Component, inject } from '@angular/core';
import { FormBuilder, Validators, ReactiveFormsModule } from '@angular/forms';
import { ConsumerService } from '../../shared/services/consumer.service';
import { ToastService } from '../../shared/services/toast.service';

@Component({
  selector: 'app-add-consumer',
  standalone: true,
  imports: [ReactiveFormsModule],
  template: `
    <div class="mb-6">
<h1 class="m-0 mb-1 text-[1.4rem] font-bold text-[#003087] dark:text-blue-400">Add Consumer</h1>
<p class="m-0 label">Link a new electricity connection to a customer</p>
</div>

    <div class="bg-card rounded-2xl shadow-sm border border-border overflow-hidden w-full max-w-5xl">
      <div class="card-header"><h3>Consumer Details</h3></div>
      <div class="card-body">
        <form [formGroup]="consumerForm">
          <div class="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 mb-4">
            <div class="flex flex-col gap-1.5">
              <label class="block text-[0.78rem] font-semibold text-text-primary mb-1.5">Customer Name</label>
              <input class="w-full px-3.5 py-2.5 border-[1.5px] border-input-border rounded-lg text-[0.85rem] text-input-text bg-input-bg outline-none transition-colors focus:border-[#0066CC] focus:ring-[3px] focus:ring-[#0066CC]/10 dark:focus:border-blue-500 dark:focus:ring-blue-500/20 placeholder:text-text-muted" formControlName="customerName" placeholder="Search or enter customer name"
                [class.error]="f('customerName')?.invalid && f('customerName')?.touched">
              @if (f('customerName')?.hasError('required') && f('customerName')?.touched) {
                <span class="text-[0.72rem] text-red-500 mt-1">Customer name is required</span>
              }
              @if (f('customerName')?.hasError('minlength') && f('customerName')?.touched) {
                <span class="text-[0.72rem] text-red-500 mt-1">Name must be at least 3 characters</span>
              }
            </div>
            <div class="flex flex-col gap-1.5">
              <label class="block text-[0.78rem] font-semibold text-text-primary mb-1.5">Consumer Number</label>
              <div class="flex gap-2">
                <input class="w-full px-3.5 py-2.5 border-[1.5px] border-input-border rounded-lg text-[0.85rem] text-input-text bg-input-bg outline-none transition-colors focus:border-[#0066CC] focus:ring-[3px] focus:ring-[#0066CC]/10 dark:focus:border-blue-500 dark:focus:ring-blue-500/20 placeholder:text-text-muted flex-1" formControlName="consumerNumber" placeholder="Auto-generated" readonly>
                <button class="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-lg text-[0.85rem] font-semibold cursor-pointer transition-all bg-card text-text-primary border border-border hover:bg-card-hover disabled:opacity-50 disabled:cursor-not-allowed" style="white-space: nowrap;" type="button" (click)="generateNumber()">🔄 Generate</button>
              </div>
            </div>
          </div>
          <div class="mb-4">
            <label class="block text-[0.78rem] font-semibold text-text-primary mb-1.5">Address</label>
            <textarea class="w-full px-3.5 py-2.5 border-[1.5px] border-input-border rounded-lg text-[0.85rem] text-input-text bg-input-bg outline-none transition-colors resize-y min-h-[100px] focus:border-[#0066CC] focus:ring-[3px] focus:ring-[#0066CC]/10 dark:focus:border-blue-500 dark:focus:ring-blue-500/20 placeholder:text-text-muted" formControlName="address" rows="2" placeholder="Connection address"
              [class.error]="f('address')?.invalid && f('address')?.touched"></textarea>
            @if (f('address')?.hasError('required') && f('address')?.touched) {
              <span class="text-[0.72rem] text-red-500 mt-1">Address is required</span>
            }
            @if (f('address')?.hasError('minlength') && f('address')?.touched) {
              <span class="text-[0.72rem] text-red-500 mt-1">Address must be at least 5 characters</span>
            }
          </div>
          <div class="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 mb-4">
            <div class="flex flex-col gap-1.5">
              <label class="block text-[0.78rem] font-semibold text-text-primary mb-1.5">Meter Number</label>
              <input class="w-full px-3.5 py-2.5 border-[1.5px] border-input-border rounded-lg text-[0.85rem] text-input-text bg-input-bg outline-none transition-colors focus:border-[#0066CC] focus:ring-[3px] focus:ring-[#0066CC]/10 dark:focus:border-blue-500 dark:focus:ring-blue-500/20 placeholder:text-text-muted" formControlName="meterNumber" placeholder="MN-XXXX-X"
                [class.error]="f('meterNumber')?.invalid && f('meterNumber')?.touched">
              @if (f('meterNumber')?.hasError('required') && f('meterNumber')?.touched) {
                <span class="text-[0.72rem] text-red-500 mt-1">Meter number is required</span>
              }
              @if (f('meterNumber')?.hasError('pattern') && f('meterNumber')?.touched) {
                <span class="text-[0.72rem] text-red-500 mt-1">Format must be MN-XXXX-X (e.g., MN-1234-A)</span>
              }
            </div>
            <div class="flex flex-col gap-1.5">
              <label class="block text-[0.78rem] font-semibold text-text-primary mb-1.5">Connection Type</label>
              <select class="w-full px-3.5 py-2.5 border-[1.5px] border-input-border rounded-lg text-[0.85rem] text-input-text bg-input-bg outline-none transition-colors focus:border-[#0066CC] focus:ring-[3px] focus:ring-[#0066CC]/10 dark:focus:border-blue-500 dark:focus:ring-blue-500/20 appearance-none pr-9 bg-[url('data:image/svg+xml,%3Csvg_xmlns=\'http://www.w3.org/2000/svg\'_width=\'12\'_height=\'12\'_viewBox=\'0_0_12_12\'%3E%3Cpath_d=\'M2_4l4_4_4-4\'_stroke=\'%2364748B\'_stroke-width=\'1.5\'_fill=\'none\'/%3E%3C/svg%3E')] bg-no-repeat bg-[right_12px_center]" formControlName="connectionType">
                <option value="Domestic">Residential</option>
                <option value="Commercial">Commercial</option>
              </select>
            </div>
          </div>
          <div class="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 mb-4">
            <div class="flex flex-col gap-1.5">
              <label class="block text-[0.78rem] font-semibold text-text-primary mb-1.5">Sanctioned Load (kW)</label>
              <input class="w-full px-3.5 py-2.5 border-[1.5px] border-input-border rounded-lg text-[0.85rem] text-input-text bg-input-bg outline-none transition-colors focus:border-[#0066CC] focus:ring-[3px] focus:ring-[#0066CC]/10 dark:focus:border-blue-500 dark:focus:ring-blue-500/20 placeholder:text-text-muted" type="number" formControlName="sanctionedLoad" placeholder="5"
                [class.error]="f('sanctionedLoad')?.invalid && f('sanctionedLoad')?.touched">
              @if (f('sanctionedLoad')?.hasError('required') && f('sanctionedLoad')?.touched) {
                <span class="text-[0.72rem] text-red-500 mt-1">Sanctioned load is required</span>
              }
              @if (f('sanctionedLoad')?.hasError('min') && f('sanctionedLoad')?.touched) {
                <span class="text-[0.72rem] text-red-500 mt-1">Minimum load is 1 kW</span>
              }
              @if (f('sanctionedLoad')?.hasError('max') && f('sanctionedLoad')?.touched) {
                <span class="text-[0.72rem] text-red-500 mt-1">Maximum load is 500 kW</span>
              }
            </div>
            <div class="flex flex-col gap-1.5">
              <label class="block text-[0.78rem] font-semibold text-text-primary mb-1.5">Connection Date</label>
              <input class="w-full px-3.5 py-2.5 border-[1.5px] border-input-border rounded-lg text-[0.85rem] text-input-text bg-input-bg outline-none transition-colors focus:border-[#0066CC] focus:ring-[3px] focus:ring-[#0066CC]/10 dark:focus:border-blue-500 dark:focus:ring-blue-500/20 placeholder:text-text-muted" type="date" formControlName="connectionDate"
                [class.error]="f('connectionDate')?.invalid && f('connectionDate')?.touched">
              @if (f('connectionDate')?.hasError('required') && f('connectionDate')?.touched) {
                <span class="text-[0.72rem] text-red-500 mt-1">Connection date is required</span>
              }
            </div>
          </div>
          <div class="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 mb-4">
            <div class="flex flex-col gap-1.5">
              <label class="block text-[0.78rem] font-semibold text-text-primary mb-1.5">Zone</label>
              <select class="w-full px-3.5 py-2.5 border-[1.5px] border-input-border rounded-lg text-[0.85rem] text-input-text bg-input-bg outline-none transition-colors focus:border-[#0066CC] focus:ring-[3px] focus:ring-[#0066CC]/10 dark:focus:border-blue-500 dark:focus:ring-blue-500/20 appearance-none pr-9 bg-[url('data:image/svg+xml,%3Csvg_xmlns=\'http://www.w3.org/2000/svg\'_width=\'12\'_height=\'12\'_viewBox=\'0_0_12_12\'%3E%3Cpath_d=\'M2_4l4_4_4-4\'_stroke=\'%2364748B\'_stroke-width=\'1.5\'_fill=\'none\'/%3E%3C/svg%3E')] bg-no-repeat bg-[right_12px_center]" formControlName="zone">
                <option value="Zone A">Zone A</option>
                <option value="Zone B">Zone B</option>
                <option value="Zone C">Zone C</option>
              </select>
            </div>
            <div class="flex flex-col gap-1.5">
              <label class="block text-[0.78rem] font-semibold text-text-primary mb-1.5">Tariff Category</label>
              <select class="w-full px-3.5 py-2.5 border-[1.5px] border-input-border rounded-lg text-[0.85rem] text-input-text bg-input-bg outline-none transition-colors focus:border-[#0066CC] focus:ring-[3px] focus:ring-[#0066CC]/10 dark:focus:border-blue-500 dark:focus:ring-blue-500/20 appearance-none pr-9 bg-[url('data:image/svg+xml,%3Csvg_xmlns=\'http://www.w3.org/2000/svg\'_width=\'12\'_height=\'12\'_viewBox=\'0_0_12_12\'%3E%3Cpath_d=\'M2_4l4_4_4-4\'_stroke=\'%2364748B\'_stroke-width=\'1.5\'_fill=\'none\'/%3E%3C/svg%3E')] bg-no-repeat bg-[right_12px_center]" formControlName="tariffCategory">
                <option value="LT-1">LT-1 (Domestic)</option>
                <option value="HT-1">HT-1 (Commercial)</option>
                <option value="HT-2">HT-2 (Industrial)</option>
              </select>
            </div>
          </div>

          <button class="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-lg text-[0.85rem] font-semibold cursor-pointer transition-all bg-gradient-to-br from-[#003087] to-[#0066CC] text-white border-none shadow-[0_4px_12px_rgba(0,102,204,0.3)] hover:shadow-[0_6px_16px_rgba(0,102,204,0.4)] hover:-translate-y-px disabled:opacity-50 disabled:cursor-not-allowed w-full py-3 mt-4" (click)="submit()" [disabled]="submitting">
            {{ submitting ? '⏳ Adding...' : '➕ Add Consumer' }}
          </button>
        </form>
      </div>
    </div>
  `
})
export class AddConsumerComponent {
  private consumerService = inject(ConsumerService);
  private toast = inject(ToastService);
  private fb = inject(FormBuilder);

  consumerForm = this.fb.group({
    customerName: ['', [Validators.required, Validators.minLength(3)]],
    consumerNumber: [''],
    address: ['', [Validators.required, Validators.minLength(5)]],
    meterNumber: ['', [Validators.required, Validators.pattern(/^MN-\d{4}-[A-Z]$/)]],
    connectionType: ['Domestic'],
    sanctionedLoad: [5, [Validators.required, Validators.min(1), Validators.max(500)]],
    connectionDate: ['', Validators.required],
    zone: ['Zone A'],
    tariffCategory: ['LT-1'],
    customerId: [1],
  });

  submitting = false;

  f(field: string) { return this.consumerForm.get(field); }

  constructor() { this.generateNumber(); }

  generateNumber() {
    this.consumerForm.patchValue({
      consumerNumber: `1234567890${String(Math.floor(100 + Math.random() * 900)).padStart(3, '0')}`
    });
  }

  submit() {
    if (this.consumerForm.invalid) { this.consumerForm.markAllAsTouched(); this.toast.error('Please fix validation errors'); return; }
    this.submitting = true;
    this.consumerService.add({ ...this.consumerForm.value, status: 'Active' } as any).subscribe(() => {
      this.submitting = false;
      this.toast.success('Consumer added successfully!');
      this.consumerForm.reset({ connectionType: 'Domestic', sanctionedLoad: 5, zone: 'Zone A', tariffCategory: 'LT-1', customerId: 1 });
      this.generateNumber();
    });
  }
}





