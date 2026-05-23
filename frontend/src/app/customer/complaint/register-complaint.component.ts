import { Component, inject } from '@angular/core';
import { FormBuilder, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { ComplaintService } from '../../shared/services/complaint.service';
import { AuthService } from '../../shared/services/auth.service';
import { ToastService } from '../../shared/services/toast.service';

@Component({
  selector: 'app-register-complaint',
  standalone: true,
  imports: [ReactiveFormsModule],
  template: `
    <div class="mb-6">
<h1 class="m-0 mb-1 text-[1.4rem] font-bold text-[#003087] dark:text-blue-400">Register Complaint</h1>
<p class="m-0 label">Submit a new complaint about your electricity service</p>
</div>

    <div class="bg-card rounded-2xl shadow-sm border border-border overflow-hidden w-full max-w-5xl">
      <div class="card-header"><h3>New Complaint</h3></div>
      <div class="card-body">
        <form [formGroup]="complaintForm">
          <!-- Complaint Type -->
          <div class="mb-4">
            <label class="block text-[0.78rem] font-semibold text-text-primary mb-1.5">Complaint Type</label>
            <select class="w-full px-3.5 py-2.5 border-[1.5px] border-input-border rounded-lg text-[0.85rem] text-input-text bg-input-bg outline-none transition-colors focus:border-[#0066CC] focus:ring-[3px] focus:ring-[#0066CC]/10 dark:focus:border-blue-500 dark:focus:ring-blue-500/20 appearance-none pr-9 bg-[url('data:image/svg+xml,%3Csvg_xmlns=\'http://www.w3.org/2000/svg\'_width=\'12\'_height=\'12\'_viewBox=\'0_0_12_12\'%3E%3Cpath_d=\'M2_4l4_4_4-4\'_stroke=\'%2364748B\'_stroke-width=\'1.5\'_fill=\'none\'/%3E%3C/svg%3E')] bg-no-repeat bg-[right_12px_center]" formControlName="category"
              [class.error]="f('category')?.invalid && f('category')?.touched">
              <option value="">Select complaint type</option>
              <option value="Power Outage">Power Outage</option>
              <option value="Meter Fault">Meter Fault</option>
              <option value="Billing Issue">Billing Issue</option>
              <option value="Voltage Fluctuation">Voltage Fluctuation</option>
              <option value="New Connection Request">New Connection Request</option>
              <option value="Other">Other</option>
            </select>
            @if (f('category')?.hasError('required') && f('category')?.touched) {
              <span class="text-[0.72rem] text-red-500 mt-1">Please select a complaint type</span>
            }
          </div>

          <!-- Description -->
          <div class="mb-4">
            <label class="block text-[0.78rem] font-semibold text-text-primary mb-1.5">Description</label>
            <textarea class="w-full px-3.5 py-2.5 border-[1.5px] border-input-border rounded-lg text-[0.85rem] text-input-text bg-input-bg outline-none transition-colors resize-y min-h-[100px] focus:border-[#0066CC] focus:ring-[3px] focus:ring-[#0066CC]/10 dark:focus:border-blue-500 dark:focus:ring-blue-500/20 placeholder:text-text-muted" formControlName="description" rows="4" placeholder="Describe your issue in detail (min 20 characters)..."
              [class.error]="f('description')?.invalid && f('description')?.touched"></textarea>
            <div class="flex justify-between mt-1">
              <div>
                @if (f('description')?.hasError('required') && f('description')?.touched) {
                  <span class="text-[0.72rem] text-red-500 mt-1">Description is required</span>
                }
                @if (f('description')?.hasError('minlength') && f('description')?.touched) {
                  <span class="text-[0.72rem] text-red-500 mt-1">Description must be at least 20 characters</span>
                }
                @if (f('description')?.hasError('maxlength') && f('description')?.touched) {
                  <span class="text-[0.72rem] text-red-500 mt-1">Description cannot exceed 500 characters</span>
                }
              </div>
              <span class="text-xs" [class]="descLength > 500 ? 'text-danger' : 'text-text-muted'">{{ descLength }}/500</span>
            </div>
          </div>

          <!-- Priority -->
          <div class="mb-4">
            <label class="block text-[0.78rem] font-semibold text-text-primary mb-1.5">Priority</label>
            <div class="flex gap-2">
              @for (p of priorities; track p.value) {
                <button
                  type="button"
                  class="px-4 py-1.5 rounded-full text-xs font-semibold border-2 transition-all"
                  [class]="priority === p.value ? p.activeClass : 'border-border text-text-muted bg-input-bg'"
                  (click)="priority = p.value"
                >
                  {{ p.label }}
                </button>
              }
            </div>
          </div>

          <!-- File Upload -->
          <div class="mb-6">
            <label class="block text-[0.78rem] font-semibold text-text-primary mb-1.5">Upload Photo (Optional)</label>
            <div class="border-2 border-dashed border-border rounded-xl p-6 text-center hover:border-accent/50 transition-colors cursor-pointer"
              (click)="fileInput.click()">
              @if (fileName) {
                <p class="text-sm text-success font-medium">📎 {{ fileName }}</p>
              } @else {
                <p class="text-text-muted text-sm">📷 Click to upload or drag and drop</p>
                <p class="text-xs text-text-muted mt-1">PNG, JPG up to 5MB</p>
              }
              <input #fileInput type="file" class="hidden" accept="image/*" (change)="onFileSelect($event)">
            </div>
          </div>

          <button class="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-lg text-[0.85rem] font-semibold cursor-pointer transition-all bg-gradient-to-br from-[#003087] to-[#0066CC] text-white border-none shadow-[0_4px_12px_rgba(0,102,204,0.3)] hover:shadow-[0_6px_16px_rgba(0,102,204,0.4)] hover:-translate-y-px disabled:opacity-50 disabled:cursor-not-allowed w-full py-3" (click)="submit()" [disabled]="submitting || complaintForm.invalid">
            {{ submitting ? '⏳ Submitting...' : '📝 Submit Complaint' }}
          </button>
        </form>
      </div>
    </div>
  `
})
export class RegisterComplaintComponent {
  private complaintService = inject(ComplaintService);
  private auth = inject(AuthService);
  private toast = inject(ToastService);
  private fb = inject(FormBuilder);
  private router = inject(Router);

  complaintForm = this.fb.group({
    category: ['', Validators.required],
    description: ['', [Validators.required, Validators.minLength(20), Validators.maxLength(500)]],
  });

  priority: 'Low' | 'Medium' | 'High' = 'Medium';
  fileName = '';
  submitting = false;

  priorities = [
    { value: 'Low' as const, label: '🟢 Low', activeClass: 'border-success bg-success/10 text-success' },
    { value: 'Medium' as const, label: '🟡 Medium', activeClass: 'border-warning bg-warning/10 text-warning' },
    { value: 'High' as const, label: '🔴 High', activeClass: 'border-danger bg-danger/10 text-danger' },
  ];

  f(field: string) { return this.complaintForm.get(field); }
  get descLength(): number { return this.f('description')?.value?.length || 0; }

  onFileSelect(event: Event) {
    const file = (event.target as HTMLInputElement).files?.[0];
    if (file) this.fileName = file.name;
  }

  submit() {
    if (this.complaintForm.invalid) { this.complaintForm.markAllAsTouched(); return; }
    this.submitting = true;
    const user = this.auth.getCurrentUser();
    const val = this.complaintForm.value;
    this.complaintService.add({
      customerId: user?.id || 1,
      customerName: user?.name || 'Customer',
      category: val.category!,
      description: val.description!,
      priority: this.priority,
    }).subscribe({
      next: (c) => {
        this.submitting = false;
        this.toast.success(`Complaint registered! ID: ${c.id}`);
        this.complaintForm.reset();
        this.fileName = '';
        this.router.navigate(['/customer/my-complaints']);
      },
      error: (err) => {
        this.submitting = false;
        this.toast.error('Failed to submit complaint. Please check your inputs.');
      }
    });
  }
}





