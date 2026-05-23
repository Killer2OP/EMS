import { Component, inject } from '@angular/core';
import { FormBuilder, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../../shared/services/auth.service';
import { ToastService } from '../../shared/services/toast.service';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [ReactiveFormsModule, RouterModule],
  template: `
    <div class="min-h-screen bg-surface flex items-center justify-center p-6">
      <div class="w-full max-w-md">
        <!-- Header -->
        <div class="text-center mb-8">
          <div class="inline-flex items-center gap-2 mb-3">
            <span class="text-3xl">⚡</span>
            <span class="text-2xl font-extrabold text-primary">VidyutSeva</span>
          </div>
          <p class="text-text-muted text-sm">Create your electricity management account</p>
        </div>

        <!-- Card -->
        <div class="bg-white rounded-2xl p-8 shadow-lg shadow-primary/5">
          <h2 class="text-lg font-bold text-primary mb-5">Register New Account</h2>

          <form [formGroup]="registerForm" (ngSubmit)="onSubmit()">
            <!-- Full Name -->
            <div class="mb-4">
              <label class="block text-[0.78rem] font-semibold text-text-primary mb-1.5">Full Name</label>
              <input class="w-full px-3.5 py-2.5 border-[1.5px] border-input-border rounded-lg text-[0.85rem] text-input-text bg-input-bg outline-none transition-colors focus:border-[#0066CC] focus:ring-[3px] focus:ring-[#0066CC]/10 dark:focus:border-blue-500 dark:focus:ring-blue-500/20 placeholder:text-text-muted" type="text" formControlName="name" placeholder="Enter your full name (letters only)"
                [class.error]="f('name')?.invalid && f('name')?.touched">
              @if (f('name')?.hasError('required') && f('name')?.touched) {
                <span class="text-[0.72rem] text-red-500 mt-1">Full name is required</span>
              }
              @if (f('name')?.hasError('minlength') && f('name')?.touched) {
                <span class="text-[0.72rem] text-red-500 mt-1">Name must be at least 3 characters</span>
              }
              @if (f('name')?.hasError('pattern') && f('name')?.touched) {
                <span class="text-[0.72rem] text-red-500 mt-1">Name can only contain letters and spaces</span>
              }
            </div>

            <!-- Email -->
            <div class="mb-4">
              <label class="block text-[0.78rem] font-semibold text-text-primary mb-1.5">Email Address</label>
              <input class="w-full px-3.5 py-2.5 border-[1.5px] border-input-border rounded-lg text-[0.85rem] text-input-text bg-input-bg outline-none transition-colors focus:border-[#0066CC] focus:ring-[3px] focus:ring-[#0066CC]/10 dark:focus:border-blue-500 dark:focus:ring-blue-500/20 placeholder:text-text-muted" type="email" formControlName="email" placeholder="you&#64;example.com"
                [class.error]="f('email')?.invalid && f('email')?.touched">
              @if (f('email')?.hasError('required') && f('email')?.touched) {
                <span class="text-[0.72rem] text-red-500 mt-1">Email is required</span>
              }
              @if (f('email')?.hasError('email') && f('email')?.touched) {
                <span class="text-[0.72rem] text-red-500 mt-1">Enter a valid email</span>
              }
            </div>

            <!-- Password -->
            <div class="mb-4">
              <label class="block text-[0.78rem] font-semibold text-text-primary mb-1.5">Password</label>
              <div class="relative">
                <input class="w-full px-3.5 py-2.5 border-[1.5px] border-input-border rounded-lg text-[0.85rem] text-input-text bg-input-bg outline-none transition-colors focus:border-[#0066CC] focus:ring-[3px] focus:ring-[#0066CC]/10 dark:focus:border-blue-500 dark:focus:ring-blue-500/20 placeholder:text-text-muted pr-10" [type]="showPwd ? 'text' : 'password'" formControlName="password" placeholder="Min 8 chars, upper, lower, digit, special"
                  [class.error]="f('password')?.invalid && f('password')?.touched">
                <button type="button" class="absolute right-3 top-1/2 -translate-y-1/2 text-text-muted text-sm" (click)="showPwd=!showPwd">
                  {{ showPwd ? '🙈' : '👁️' }}
                </button>
              </div>
              @if (f('password')?.hasError('required') && f('password')?.touched) {
                <span class="text-[0.72rem] text-red-500 mt-1">Password is required</span>
              }
              @if (f('password')?.touched && f('password')?.value && !f('password')?.hasError('required')) {
                <!-- Password Strength Indicator -->
                <div class="mt-2">
                  <div class="flex gap-1 mb-1.5">
                    <div class="h-1.5 flex-1 rounded-full transition-all" [class]="pwdStrength >= 1 ? 'bg-danger' : 'bg-gray-200'"></div>
                    <div class="h-1.5 flex-1 rounded-full transition-all" [class]="pwdStrength >= 2 ? 'bg-warning' : 'bg-gray-200'"></div>
                    <div class="h-1.5 flex-1 rounded-full transition-all" [class]="pwdStrength >= 3 ? 'bg-warning' : 'bg-gray-200'"></div>
                    <div class="h-1.5 flex-1 rounded-full transition-all" [class]="pwdStrength >= 4 ? 'bg-success' : 'bg-gray-200'"></div>
                    <div class="h-1.5 flex-1 rounded-full transition-all" [class]="pwdStrength >= 5 ? 'bg-success' : 'bg-gray-200'"></div>
                  </div>
                  <div class="text-xs space-y-0.5">
                    <div [class]="hasMinLength ? 'text-success' : 'text-text-muted'">{{ hasMinLength ? '✅' : '○' }} At least 8 characters</div>
                    <div [class]="hasUppercase ? 'text-success' : 'text-text-muted'">{{ hasUppercase ? '✅' : '○' }} One uppercase letter</div>
                    <div [class]="hasLowercase ? 'text-success' : 'text-text-muted'">{{ hasLowercase ? '✅' : '○' }} One lowercase letter</div>
                    <div [class]="hasDigit ? 'text-success' : 'text-text-muted'">{{ hasDigit ? '✅' : '○' }} One digit</div>
                    <div [class]="hasSpecial ? 'text-success' : 'text-text-muted'">{{ hasSpecial ? '✅' : '○' }} One special character (&#64;$!%*?&)</div>
                  </div>
                </div>
              }
              @if (f('password')?.hasError('pattern') && f('password')?.touched && !f('password')?.hasError('required')) {
                <span class="text-[0.72rem] text-red-500 mt-1">Password does not meet all requirements</span>
              }
            </div>

            <!-- Confirm Password -->
            <div class="mb-4">
              <label class="block text-[0.78rem] font-semibold text-text-primary mb-1.5">Confirm Password</label>
              <input class="w-full px-3.5 py-2.5 border-[1.5px] border-input-border rounded-lg text-[0.85rem] text-input-text bg-input-bg outline-none transition-colors focus:border-[#0066CC] focus:ring-[3px] focus:ring-[#0066CC]/10 dark:focus:border-blue-500 dark:focus:ring-blue-500/20 placeholder:text-text-muted" type="password" formControlName="confirmPassword" placeholder="Re-enter your password"
                [class.error]="f('confirmPassword')?.invalid && f('confirmPassword')?.touched || passwordMismatch">
              @if (f('confirmPassword')?.hasError('required') && f('confirmPassword')?.touched) {
                <span class="text-[0.72rem] text-red-500 mt-1">Please confirm your password</span>
              }
              @if (passwordMismatch && f('confirmPassword')?.touched) {
                <span class="text-[0.72rem] text-red-500 mt-1">Passwords do not match</span>
              }
            </div>

            <!-- Consumer Number -->
            <div class="mb-6">
              <label class="block text-[0.78rem] font-semibold text-text-primary mb-1.5">Consumer Number <span class="text-text-muted font-normal">(for linking)</span></label>
              <input class="w-full px-3.5 py-2.5 border-[1.5px] border-input-border rounded-lg text-[0.85rem] text-input-text bg-input-bg outline-none transition-colors focus:border-[#0066CC] focus:ring-[3px] focus:ring-[#0066CC]/10 dark:focus:border-blue-500 dark:focus:ring-blue-500/20 placeholder:text-text-muted" type="text" formControlName="consumerNumber" placeholder="e.g., CON-001">
            </div>

            <button class="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-lg text-[0.85rem] font-semibold cursor-pointer transition-all bg-gradient-to-br from-[#003087] to-[#0066CC] text-white border-none shadow-[0_4px_12px_rgba(0,102,204,0.3)] hover:shadow-[0_6px_16px_rgba(0,102,204,0.4)] hover:-translate-y-px disabled:opacity-50 disabled:cursor-not-allowed w-full py-3 text-sm" type="submit" [disabled]="loading">
              {{ loading ? '⏳ Creating Account...' : '🚀 Create Account' }}
            </button>
          </form>

          <div class="mt-5 text-center">
            <span class="text-text-muted text-sm">Already have an account? </span>
            <a routerLink="/auth/login" class="text-sm text-accent font-semibold hover:underline">Sign in</a>
          </div>
        </div>

        <div class="text-center mt-6">
          <p class="text-xs text-text-muted">VidyutSeva — Powered by TCS ILP Team 10 | 2026</p>
        </div>
      </div>
    </div>
  `
})
export class RegisterComponent {
  private fb = inject(FormBuilder);
  private auth = inject(AuthService);
  private router = inject(Router);
  private toast = inject(ToastService);

  showPwd = false;
  loading = false;

  private readonly strongPasswordPattern = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;

  registerForm = this.fb.group({
    name: ['', [Validators.required, Validators.minLength(3), Validators.pattern(/^[a-zA-Z\s]+$/)]],
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required, Validators.minLength(8), Validators.pattern(this.strongPasswordPattern)]],
    confirmPassword: ['', Validators.required],
    consumerNumber: [''],
  });

  f(field: string) { return this.registerForm.get(field); }

  get passwordMismatch(): boolean {
    const { password, confirmPassword } = this.registerForm.value;
    return !!password && !!confirmPassword && password !== confirmPassword;
  }

  // Password strength helpers
  get pwdValue(): string { return this.f('password')?.value || ''; }
  get hasMinLength(): boolean { return this.pwdValue.length >= 8; }
  get hasUppercase(): boolean { return /[A-Z]/.test(this.pwdValue); }
  get hasLowercase(): boolean { return /[a-z]/.test(this.pwdValue); }
  get hasDigit(): boolean { return /\d/.test(this.pwdValue); }
  get hasSpecial(): boolean { return /[@$!%*?&]/.test(this.pwdValue); }
  get pwdStrength(): number {
    return [this.hasMinLength, this.hasUppercase, this.hasLowercase, this.hasDigit, this.hasSpecial].filter(Boolean).length;
  }

  onSubmit() {
    if (this.registerForm.invalid || this.passwordMismatch) {
      this.registerForm.markAllAsTouched();
      if (this.passwordMismatch) this.toast.error('Passwords do not match');
      return;
    }
    this.loading = true;
    const { name, email, password, consumerNumber } = this.registerForm.value;
    this.auth.register({ name: name!, email: email!, password: password!, consumerNumber: consumerNumber || undefined }).subscribe({
      next: () => {
        this.loading = false;
        this.toast.success('Registration successful! Please login.');
        this.router.navigate(['/auth/login']);
      },
      error: () => {
        this.loading = false;
        this.toast.error('Registration failed. Please try again.');
      }
    });
  }
}




