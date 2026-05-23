import { Component, inject } from '@angular/core';
import { FormBuilder, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../../shared/services/auth.service';
import { ToastService } from '../../shared/services/toast.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [ReactiveFormsModule, RouterModule],
  template: `
    <div class="min-h-screen flex">
      <!-- Left Panel -->
      <div class="flex-1 hidden lg:flex flex-col justify-center px-12 text-white relative overflow-hidden bg-[url('/assets/login-bg.png')] bg-cover bg-center">
        <div class="absolute inset-0 bg-black/10 z-0"></div>

        <div class="relative z-10">
          <div class="w-14 h-14 bg-electric/20 rounded-xl flex items-center justify-center text-3xl mb-6 backdrop-blur-sm">⚡</div>
          <h1 class="text-3xl font-extrabold mb-2 tracking-tight">VidyutSeva</h1>
          <p class="text-white/60 text-sm mb-1">Powering Lives, Simplifying Bills</p>
          <p class="text-white/40 text-xs mb-10">Electricity Management Portal — TCS ILP Project</p>

          <div class="space-y-5">
            @for (f of features; track f.title) {
              <div class="flex items-start gap-4">
                <span class="text-xl mt-0.5">{{ f.icon }}</span>
                <div>
                  <h4 class="text-sm font-semibold mb-1">{{ f.title }}</h4>
                  <p class="text-xs text-white/50">{{ f.desc }}</p>
                </div>
              </div>
            }
          </div>
        </div>
      </div>

      <!-- Right Panel -->
      <div class="w-full lg:w-[480px] flex items-center justify-center bg-surface p-6">
        <div class="w-full max-w-sm bg-white rounded-2xl p-8 shadow-lg shadow-primary/5">
          <!-- Mobile Logo -->
          <div class="lg:hidden flex items-center gap-2 mb-6">
            <span class="text-2xl">⚡</span>
            <span class="text-xl font-extrabold text-primary">VidyutSeva</span>
          </div>

          <div class="mb-6">
            <h2 class="text-xl font-bold text-primary mb-1">Welcome back</h2>
            <p class="text-text-muted text-sm">Sign in to your account</p>
          </div>

          <!-- Role Selector -->
          <div class="flex gap-2 mb-4">
            @for (r of roles; track r.value) {
              <button
                type="button"
                class="flex-1 flex flex-col items-center gap-1 py-2.5 px-2 border-2 rounded-xl cursor-pointer text-xs font-semibold transition-all"
                [class]="selectedRole === r.value
                  ? 'border-primary bg-sky text-primary'
                  : 'border-border bg-white text-text-muted hover:border-accent/30'"
                (click)="selectedRole = r.value"
              >
                <span class="text-lg">{{ r.icon }}</span>
                <span>{{ r.label }}</span>
              </button>
            }
          </div>

          <!-- Demo Hint -->
          <div class="bg-success/10 border border-success/30 rounded-lg px-3 py-2 text-xs text-success mb-5 flex items-center gap-1">
            <span>💡</span>
            <span>Demo:
              @switch (selectedRole) {
                @case ('CUSTOMER') { customer1&#64;vidyutseva.com }
                @case ('ADMIN') { admin1&#64;vidyutseva.com }
                @case ('SME') { sme1&#64;vidyutseva.com }
              }
              / Password&#64;123
            </span>
          </div>

          <form [formGroup]="loginForm" (ngSubmit)="onSubmit()">
            <!-- Email -->
            <div class="mb-4">
              <label class="block text-[0.78rem] font-semibold text-text-primary mb-1.5">Email Address</label>
              <input class="w-full px-3.5 py-2.5 border-[1.5px] border-input-border rounded-lg text-[0.85rem] text-input-text bg-input-bg outline-none transition-colors focus:border-[#0066CC] focus:ring-[3px] focus:ring-[#0066CC]/10 dark:focus:border-blue-500 dark:focus:ring-blue-500/20 placeholder:text-text-muted" type="email" formControlName="email" placeholder="you&#64;example.com"
                [class.error]="loginForm.get('email')?.invalid && loginForm.get('email')?.touched">
              @if (loginForm.get('email')?.hasError('required') && loginForm.get('email')?.touched) {
                <span class="text-[0.72rem] text-red-500 mt-1">Email is required</span>
              }
              @if (loginForm.get('email')?.hasError('email') && loginForm.get('email')?.touched) {
                <span class="text-[0.72rem] text-red-500 mt-1">Enter a valid email</span>
              }
            </div>

            <!-- Password -->
            <div class="mb-6">
              <label class="block text-[0.78rem] font-semibold text-text-primary mb-1.5">Password</label>
              <div class="relative">
                <input class="w-full px-3.5 py-2.5 border-[1.5px] border-input-border rounded-lg text-[0.85rem] text-input-text bg-input-bg outline-none transition-colors focus:border-[#0066CC] focus:ring-[3px] focus:ring-[#0066CC]/10 dark:focus:border-blue-500 dark:focus:ring-blue-500/20 placeholder:text-text-muted pr-10" [type]="showPwd ? 'text' : 'password'" formControlName="password" placeholder="Enter your password"
                  [class.error]="loginForm.get('password')?.invalid && loginForm.get('password')?.touched">
                <button type="button" class="absolute right-3 top-1/2 -translate-y-1/2 text-text-muted text-sm" (click)="showPwd=!showPwd">
                  {{ showPwd ? '🙈' : '👁️' }}
                </button>
              </div>
              @if (loginForm.get('password')?.hasError('required') && loginForm.get('password')?.touched) {
                <span class="text-[0.72rem] text-red-500 mt-1">Password is required</span>
              }
              @if (loginForm.get('password')?.hasError('minlength') && loginForm.get('password')?.touched) {
                <span class="text-[0.72rem] text-red-500 mt-1">Password must be at least 8 characters</span>
              }
            </div>

            <button class="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-lg text-[0.85rem] font-semibold cursor-pointer transition-all bg-gradient-to-br from-[#003087] to-[#0066CC] text-white border-none shadow-[0_4px_12px_rgba(0,102,204,0.3)] hover:shadow-[0_6px_16px_rgba(0,102,204,0.4)] hover:-translate-y-px disabled:opacity-50 disabled:cursor-not-allowed w-full py-3 text-sm" type="submit" [disabled]="loading">
              {{ loading ? '⏳ Signing in...' : '🔐 Sign In' }}
            </button>
          </form>

          <div class="mt-5 text-center">
            <span class="text-text-muted text-sm">New customer? </span>
            <a routerLink="/auth/register" class="text-sm text-accent font-semibold hover:underline">Register here</a>
          </div>
        </div>
      </div>
    </div>
  `
})
export class LoginComponent {
  private fb = inject(FormBuilder);
  private auth = inject(AuthService);
  private router = inject(Router);
  private toast = inject(ToastService);

  loginForm = this.fb.group({
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required, Validators.minLength(8)]]
  });

  selectedRole: 'CUSTOMER' | 'ADMIN' | 'SME' = 'CUSTOMER';
  showPwd = false;
  loading = false;

  roles = [
    { value: 'CUSTOMER' as const, label: 'Customer', icon: '👤' },
    { value: 'ADMIN' as const, label: 'Admin', icon: '🛡️' },
    { value: 'SME' as const, label: 'SME', icon: '🔧' },
  ];

  features = [
    { icon: '⚡', title: 'Smart Billing', desc: 'Auto-calculated slab-based electricity billing' },
    { icon: '📊', title: 'Usage Analytics', desc: 'Track your consumption with visual charts' },
    { icon: '🔧', title: 'Complaint Management', desc: 'Raise and track service complaints in real time' },
    { icon: '💳', title: 'Online Payments', desc: 'Secure card & UPI payment gateway' },
  ];

  onSubmit() {
    if (this.loginForm.invalid) { this.loginForm.markAllAsTouched(); return; }
    this.loading = true;
    const { email, password } = this.loginForm.value;
    this.auth.login(email!, password!, this.selectedRole).subscribe(user => {
      this.loading = false;
      if (user) {
        this.toast.success(`Welcome back, ${user.name}!`);
        const routes: Record<string, string> = {
          CUSTOMER: '/customer/dashboard',
          ADMIN: '/admin/dashboard',
          SME: '/sme/dashboard'
        };
        this.router.navigate([routes[user.role]]);
      } else {
        this.toast.error('Invalid credentials. Please try again.');
      }
    });
  }
}




