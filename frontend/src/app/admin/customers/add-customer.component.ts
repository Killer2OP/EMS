import { Component, inject } from '@angular/core';
import { FormBuilder, Validators, ReactiveFormsModule } from '@angular/forms';
import { CustomerService } from '../../shared/services/customer.service';
import { ToastService } from '../../shared/services/toast.service';

@Component({
  selector: 'app-add-customer',
  standalone: true,
  imports: [ReactiveFormsModule],
  template: `
    <div class="mb-6">
<h1 class="m-0 mb-1 text-[1.4rem] font-bold text-[#003087] dark:text-blue-400">Add Customer</h1>
<p class="m-0 label">Register a new customer in the system</p>
</div>

    <div class="bg-card rounded-2xl shadow-sm border border-border overflow-hidden w-full max-w-5xl">
      <div class="card-header"><h3>Customer Details</h3></div>
      <div class="card-body">
        <form [formGroup]="customerForm">
          <div class="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 mb-4">
            <div class="flex flex-col gap-1.5">
              <label class="block text-[0.78rem] font-semibold text-text-primary mb-1.5">Full Name</label>
              <input class="w-full px-3.5 py-2.5 border-[1.5px] border-input-border rounded-lg text-[0.85rem] text-input-text bg-input-bg outline-none transition-colors focus:border-[#0066CC] focus:ring-[3px] focus:ring-[#0066CC]/10 dark:focus:border-blue-500 dark:focus:ring-blue-500/20 placeholder:text-text-muted" formControlName="name" placeholder="Enter full name"
                [class.error]="f('name')?.invalid && f('name')?.touched">
              @if (f('name')?.hasError('required') && f('name')?.touched) {
                <span class="text-[0.72rem] text-red-500 mt-1">Full name is required</span>
              }
              @if (f('name')?.hasError('minlength') && f('name')?.touched) {
                <span class="text-[0.72rem] text-red-500 mt-1">Name must be at least 3 characters</span>
              }
            </div>
            <div class="flex flex-col gap-1.5">
              <label class="block text-[0.78rem] font-semibold text-text-primary mb-1.5">Email</label>
              <input class="w-full px-3.5 py-2.5 border-[1.5px] border-input-border rounded-lg text-[0.85rem] text-input-text bg-input-bg outline-none transition-colors focus:border-[#0066CC] focus:ring-[3px] focus:ring-[#0066CC]/10 dark:focus:border-blue-500 dark:focus:ring-blue-500/20 placeholder:text-text-muted" type="email" formControlName="email" placeholder="email&#64;example.com"
                [class.error]="f('email')?.invalid && f('email')?.touched">
              @if (f('email')?.hasError('required') && f('email')?.touched) {
                <span class="text-[0.72rem] text-red-500 mt-1">Email is required</span>
              }
              @if (f('email')?.hasError('email') && f('email')?.touched) {
                <span class="text-[0.72rem] text-red-500 mt-1">Enter a valid email</span>
              }
            </div>
          </div>
          <div class="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 mb-4">
            <div class="flex flex-col gap-1.5">
              <label class="block text-[0.78rem] font-semibold text-text-primary mb-1.5">Phone</label>
              <input class="w-full px-3.5 py-2.5 border-[1.5px] border-input-border rounded-lg text-[0.85rem] text-input-text bg-input-bg outline-none transition-colors focus:border-[#0066CC] focus:ring-[3px] focus:ring-[#0066CC]/10 dark:focus:border-blue-500 dark:focus:ring-blue-500/20 placeholder:text-text-muted" formControlName="phone" placeholder="10-digit number (starts with 6-9)"
                [class.error]="f('phone')?.invalid && f('phone')?.touched">
              @if (f('phone')?.hasError('required') && f('phone')?.touched) {
                <span class="text-[0.72rem] text-red-500 mt-1">Phone number is required</span>
              }
              @if (f('phone')?.hasError('pattern') && f('phone')?.touched) {
                <span class="text-[0.72rem] text-red-500 mt-1">Enter a valid 10-digit number starting with 6-9</span>
              }
            </div>
            <div class="flex flex-col gap-1.5">
              <label class="block text-[0.78rem] font-semibold text-text-primary mb-1.5">Zone</label>
              <div class="relative w-full"><select class="w-full px-3.5 py-2.5 border-[1.5px] border-input-border rounded-lg text-[0.85rem] text-input-text bg-input-bg outline-none transition-colors focus:border-[#0066CC] focus:ring-[3px] focus:ring-[#0066CC]/10 dark:focus:border-blue-500 dark:focus:ring-blue-500/20 appearance-none pr-9" formControlName="zone">
                <option value="Zone A">Zone A</option>
                <option value="Zone B">Zone B</option>
                <option value="Zone C">Zone C</option>
              </select><span class="material-symbols-outlined absolute right-3 top-1/2 -translate-y-1/2 text-text-muted pointer-events-none">expand_more</span></div>
            </div>
          </div>
          <div class="mb-4">
            <label class="block text-[0.78rem] font-semibold text-text-primary mb-1.5">Address</label>
            <textarea class="w-full px-3.5 py-2.5 border-[1.5px] border-input-border rounded-lg text-[0.85rem] text-input-text bg-input-bg outline-none transition-colors resize-y min-h-[100px] focus:border-[#0066CC] focus:ring-[3px] focus:ring-[#0066CC]/10 dark:focus:border-blue-500 dark:focus:ring-blue-500/20 placeholder:text-text-muted" formControlName="address" rows="2" placeholder="Full address"
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
              <label class="block text-[0.78rem] font-semibold text-text-primary mb-1.5">Connection Type</label>
              <div class="relative w-full"><select class="w-full px-3.5 py-2.5 border-[1.5px] border-input-border rounded-lg text-[0.85rem] text-input-text bg-input-bg outline-none transition-colors focus:border-[#0066CC] focus:ring-[3px] focus:ring-[#0066CC]/10 dark:focus:border-blue-500 dark:focus:ring-blue-500/20 appearance-none pr-9" formControlName="connectionType">
                <option value="Domestic">Domestic</option>
                <option value="Commercial">Commercial</option>
              </select><span class="material-symbols-outlined absolute right-3 top-1/2 -translate-y-1/2 text-text-muted pointer-events-none">expand_more</span></div>
            </div>
            <div class="flex flex-col gap-1.5">
              <label class="block text-[0.78rem] font-semibold text-text-primary mb-1.5">Password</label>
              <input class="w-full px-3.5 py-2.5 border-[1.5px] border-input-border rounded-lg text-[0.85rem] text-input-text bg-input-bg outline-none transition-colors focus:border-[#0066CC] focus:ring-[3px] focus:ring-[#0066CC]/10 dark:focus:border-blue-500 dark:focus:ring-blue-500/20 placeholder:text-text-muted" formControlName="password" placeholder="Strong password or leave for auto"
                [class.error]="f('password')?.invalid && f('password')?.touched">
              @if (f('password')?.hasError('pattern') && f('password')?.touched && !f('password')?.hasError('required')) {
                <span class="text-[0.72rem] text-red-500 mt-1">Need 8+ chars, upper, lower, digit & special (&#64;$!%*?&)</span>
              }
            </div>
          </div>

          <button class="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-lg text-[0.85rem] font-semibold cursor-pointer transition-all bg-gradient-to-br from-[#003087] to-[#0066CC] text-white border-none shadow-[0_4px_12px_rgba(0,102,204,0.3)] hover:shadow-[0_6px_16px_rgba(0,102,204,0.4)] hover:-translate-y-px disabled:opacity-50 disabled:cursor-not-allowed w-full py-3 mt-4" (click)="submit()" [disabled]="submitting">
            @if (submitting) { <span class="material-symbols-outlined text-[1.2em] align-middle">hourglass_empty</span> Creating... } @else { <span class="material-symbols-outlined text-[1.2em] align-middle">person</span> Create Customer }
          </button>
        </form>
      </div>
    </div>

    <!-- Credentials Modal -->
    @if (showCredentials) {
      <div class="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50">
        <div class="bg-white rounded-2xl shadow-2xl p-6 w-full max-w-sm mx-4 animate-fade-in">
          <div class="text-center mb-4">
            <div class="text-3xl mb-2"><span class="material-symbols-outlined text-[1.2em] align-middle">check_circle</span></div>
            <h3 class="text-lg font-bold text-primary">Customer Created!</h3>
          </div>
          <div class="bg-card-hover border border-border rounded-xl p-6">
            <div class="flex justify-between items-center py-2 border-b border-dashed border-border last:border-b-0"><span class="text-[0.82rem] text-text-secondary">Name</span><span class="text-[0.85rem] font-semibold text-text-primary">{{ createdName }}</span></div>
            <div class="flex justify-between items-center py-2 border-b border-dashed border-border last:border-b-0"><span class="text-[0.82rem] text-text-secondary">Email</span><span class="text-[0.85rem] font-semibold text-text-primary">{{ createdEmail }}</span></div>
            <div class="flex justify-between items-center py-2 border-b border-dashed border-border last:border-b-0"><span class="text-[0.82rem] text-text-secondary">Password</span><span class="text-[0.85rem] font-semibold text-text-primary">{{ createdPassword }}</span></div>
          </div>
          <button class="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-lg text-[0.85rem] font-semibold cursor-pointer transition-all bg-gradient-to-br from-[#003087] to-[#0066CC] text-white border-none shadow-[0_4px_12px_rgba(0,102,204,0.3)] hover:shadow-[0_6px_16px_rgba(0,102,204,0.4)] hover:-translate-y-px disabled:opacity-50 disabled:cursor-not-allowed w-full mt-4" (click)="closeModal()">Done</button>
        </div>
      </div>
    }
  `
})
export class AddCustomerComponent {
  private customerService = inject(CustomerService);
  private toast = inject(ToastService);
  private fb = inject(FormBuilder);

  private readonly strongPasswordPattern = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;

  customerForm = this.fb.group({
    name: ['', [Validators.required, Validators.minLength(3)]],
    email: ['', [Validators.required, Validators.email]],
    phone: ['', [Validators.required, Validators.pattern(/^[6-9]\d{9}$/)]],
    address: ['', [Validators.required, Validators.minLength(5)]],
    zone: ['Zone A'],
    connectionType: ['Domestic'],
    password: ['', [Validators.pattern(this.strongPasswordPattern)]],
  });

  submitting = false;
  showCredentials = false;
  createdName = '';
  createdEmail = '';
  createdPassword = '';

  f(field: string) { return this.customerForm.get(field); }

  generateStrongPassword(): string {
    const uppers = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    const lowers = 'abcdefghijklmnopqrstuvwxyz';
    const numbers = '0123456789';
    const specials = '@$!%*?&';
    const all = uppers + lowers + numbers + specials;
    
    let pwd = '';
    pwd += uppers[Math.floor(Math.random() * uppers.length)];
    pwd += lowers[Math.floor(Math.random() * lowers.length)];
    pwd += numbers[Math.floor(Math.random() * numbers.length)];
    pwd += specials[Math.floor(Math.random() * specials.length)];
    
    for (let i = 0; i < 6; i++) {
      pwd += all[Math.floor(Math.random() * all.length)];
    }
    
    return pwd.split('').sort(() => 0.5 - Math.random()).join('');
  }

  submit() {
    if (this.customerForm.invalid) { this.customerForm.markAllAsTouched(); this.toast.error('Please fix validation errors'); return; }
    const val = this.customerForm.value;
    const password = val.password || this.generateStrongPassword();
    this.submitting = true;
    this.customerService.add({
      name: val.name!, email: val.email!, phone: val.phone!,
      address: val.address!, zone: val.zone!, connectionType: val.connectionType! as 'Domestic' | 'Commercial',
      meterNumber: `MN-${Math.floor(1000 + Math.random() * 9000)}-${String.fromCharCode(65 + Math.floor(Math.random() * 26))}`,
      status: 'Active', createdAt: new Date().toISOString().split('T')[0],
    }).subscribe(() => {
      this.submitting = false;
      this.createdName = val.name!;
      this.createdEmail = val.email!;
      this.createdPassword = password;
      this.showCredentials = true;
      this.toast.success('Customer created successfully!');
    });
  }

  closeModal() {
    this.showCredentials = false;
    this.customerForm.reset({ zone: 'Zone A', connectionType: 'Domestic' });
  }
}






