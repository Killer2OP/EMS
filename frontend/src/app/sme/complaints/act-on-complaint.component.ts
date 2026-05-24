import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ComplaintService, Complaint } from '../../shared/services/complaint.service';
import { ToastService } from '../../shared/services/toast.service';

@Component({
  selector: 'app-act-on-complaint',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="mb-6">
<h1 class="m-0 mb-1 text-[1.4rem] font-bold text-[#003087] dark:text-blue-400">Act on Complaint</h1>
<p class="m-0 label">Update status and add remarks</p>
</div>

    @if (complaint) {
      <!-- Complaint Detail -->
      <div class="bg-card rounded-2xl shadow-sm border border-border overflow-hidden mb-6">
        <div class="card-header">
          <h3>{{ complaint.id }} — {{ complaint.category }}</h3>
          <span class="status-badge" [class]="complaint.status.toLowerCase().replace(' ', '-')">{{ complaint.status }}</span>
        </div>
        <div class="card-body">
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div>
              <span class="text-xs text-text-muted font-semibold uppercase">Customer</span>
              <p class="text-sm font-semibold">{{ complaint.customerName }}</p>
            </div>
            <div>
              <span class="text-xs text-text-muted font-semibold uppercase">Date Raised</span>
              <p class="text-sm font-semibold">{{ complaint.dateRaised | date:'dd MMM yyyy' }}</p>
            </div>
            <div>
              <span class="text-xs text-text-muted font-semibold uppercase">Priority</span>
              <p class="text-sm font-semibold" [class]="complaint.priority === 'High' ? 'text-danger' : 'text-warning'">{{ complaint.priority }}</p>
            </div>
            <div>
              <span class="text-xs text-text-muted font-semibold uppercase">Category</span>
              <p class="text-sm font-semibold">{{ complaint.category }}</p>
            </div>
          </div>
          <div class="bg-surface rounded-lg p-4">
            <span class="text-xs text-text-muted font-semibold uppercase">Description</span>
            <p class="text-sm mt-1">{{ complaint.description }}</p>
          </div>
        </div>
      </div>

      <!-- Action Form -->
      @if (complaint.status !== 'Resolved') {
        <div class="bg-card rounded-2xl shadow-sm border border-border overflow-hidden mb-6 w-full max-w-5xl">
          <div class="card-header"><h3>Update Status</h3></div>
          <div class="card-body">
            <div class="mb-4">
              <label class="block text-[0.78rem] font-semibold text-text-primary mb-1.5">Status</label>
              <div class="relative w-full"><select class="w-full px-3.5 py-2.5 border-[1.5px] border-input-border rounded-lg text-[0.85rem] text-input-text bg-input-bg outline-none transition-colors focus:border-[#0066CC] focus:ring-[3px] focus:ring-[#0066CC]/10 dark:focus:border-blue-500 dark:focus:ring-blue-500/20 appearance-none pr-9" [(ngModel)]="newStatus">
                <option value="In Progress">In Progress</option>
                <option value="Resolved">Resolved</option>
              </select><span class="material-symbols-outlined absolute right-3 top-1/2 -translate-y-1/2 text-text-muted pointer-events-none">expand_more</span></div>
            </div>
            <div class="mb-4">
              <label class="block text-[0.78rem] font-semibold text-text-primary mb-1.5">Remarks <span class="text-text-muted font-normal">(required when resolving)</span></label>
              <textarea class="w-full px-3.5 py-2.5 border-[1.5px] border-input-border rounded-lg text-[0.85rem] text-input-text bg-input-bg outline-none transition-colors resize-y min-h-[100px] focus:border-[#0066CC] focus:ring-[3px] focus:ring-[#0066CC]/10 dark:focus:border-blue-500 dark:focus:ring-blue-500/20 placeholder:text-text-muted" [(ngModel)]="remarks" rows="3" placeholder="Enter your remarks..."></textarea>
            </div>
            <div class="mb-4">
              <label class="block text-[0.78rem] font-semibold text-text-primary mb-1.5">Date of Visit</label>
              <input class="w-full px-3.5 py-2.5 border-[1.5px] border-input-border rounded-lg text-[0.85rem] text-input-text bg-input-bg outline-none transition-colors focus:border-[#0066CC] focus:ring-[3px] focus:ring-[#0066CC]/10 dark:focus:border-blue-500 dark:focus:ring-blue-500/20 placeholder:text-text-muted" type="date" [(ngModel)]="visitDate">
            </div>
            <button class="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-lg text-[0.85rem] font-semibold cursor-pointer transition-all bg-gradient-to-br from-[#003087] to-[#0066CC] text-white border-none shadow-[0_4px_12px_rgba(0,102,204,0.3)] hover:shadow-[0_6px_16px_rgba(0,102,204,0.4)] hover:-translate-y-px disabled:opacity-50 disabled:cursor-not-allowed w-full py-3" (click)="submit()" [disabled]="submitting || (newStatus === 'Resolved' && !remarks)">
              @if (submitting) { <span class="material-symbols-outlined text-[1.2em] align-middle">hourglass_empty</span> Updating... } @else { <span class="material-symbols-outlined text-[1.2em] align-middle">edit</span> Submit Update }
            </button>
          </div>
        </div>
      }

      <!-- Action History Timeline -->
      <div class="bg-card rounded-2xl shadow-sm border border-border overflow-hidden w-full max-w-5xl">
        <div class="card-header"><h3>Action History</h3></div>
        <div class="card-body">
          <div class="space-y-4">
            @for (event of timeline; track event.date) {
              <div class="flex gap-3">
                <div class="flex flex-col items-center">
                  <div class="w-3 h-3 rounded-full" [class]="event.type === 'resolved' ? 'bg-success' : event.type === 'progress' ? 'bg-warning' : 'bg-accent'"></div>
                  <div class="w-0.5 flex-1 bg-border"></div>
                </div>
                <div class="pb-4">
                  <p class="text-sm font-semibold">{{ event.title }}</p>
                  <p class="text-xs text-text-muted">{{ event.date }}</p>
                  @if (event.note) {
                    <p class="text-xs text-text-muted mt-1 bg-surface rounded p-2">{{ event.note }}</p>
                  }
                </div>
              </div>
            }
          </div>
        </div>
      </div>
    }
  `
})
export class ActOnComplaintComponent implements OnInit {
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private complaintService = inject(ComplaintService);
  private toast = inject(ToastService);

  complaint?: Complaint;
  newStatus: 'In Progress' | 'Resolved' = 'In Progress';
  remarks = '';
  visitDate = '';
  submitting = false;

  timeline: { title: string; date: string; note?: string; type: string }[] = [];

  ngOnInit() {
    const id = this.route.snapshot.paramMap.get('id')!;
    this.complaintService.getById(id).subscribe(c => {
      this.complaint = c;
      this.buildTimeline();
    });
  }

  buildTimeline() {
    if (!this.complaint) return;
    this.timeline = [
      { title: 'Complaint Raised', date: this.complaint.dateRaised, note: this.complaint.description, type: 'open' },
    ];
    if (this.complaint.assignedSmeName) {
      this.timeline.push({ title: `Assigned to ${this.complaint.assignedSmeName}`, date: this.complaint.dateRaised, type: 'progress' });
    }
    if (this.complaint.resolutionNotes) {
      this.timeline.push({ title: 'Resolution Notes Added', date: this.complaint.dateOfVisit || this.complaint.dateRaised, note: this.complaint.resolutionNotes, type: this.complaint.status === 'Resolved' ? 'resolved' : 'progress' });
    }
  }

  submit() {
    if (!this.complaint) return;
    this.submitting = true;
    this.complaintService.resolve(this.complaint.id, this.remarks, this.visitDate, this.newStatus).subscribe(c => {
      this.complaint = c;
      this.buildTimeline();
      this.submitting = false;
      this.toast.success(`Complaint ${c.id} updated to ${c.status}`);
      this.remarks = '';
    });
  }
}





