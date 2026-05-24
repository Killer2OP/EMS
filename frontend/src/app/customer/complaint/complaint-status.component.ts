import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ComplaintService, Complaint } from '../../shared/services/complaint.service';

@Component({
  selector: 'app-complaint-status',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="mb-6">
<h1 class="m-0 mb-1 text-[1.4rem] font-bold text-[#003087] dark:text-blue-400">Complaint Status</h1>
<p class="m-0 label">Track the status of your complaint</p>
</div>

    <div class="bg-card rounded-2xl shadow-sm border border-border overflow-hidden mb-6 w-full max-w-5xl">
      <div class="card-body">
        <label class="block text-[0.78rem] font-semibold text-text-primary mb-1.5">Enter Complaint ID</label>
        <div class="flex gap-3">
          <input class="w-full px-3.5 py-2.5 border-[1.5px] border-input-border rounded-lg text-[0.85rem] text-input-text bg-input-bg outline-none transition-colors focus:border-[#0066CC] focus:ring-[3px] focus:ring-[#0066CC]/10 dark:focus:border-blue-500 dark:focus:ring-blue-500/20 placeholder:text-text-muted flex-1" type="text" [(ngModel)]="complaintId" placeholder="e.g., CMP-001">
          <button class="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-lg text-[0.85rem] font-semibold cursor-pointer transition-all bg-gradient-to-br from-[#003087] to-[#0066CC] text-white border-none shadow-[0_4px_12px_rgba(0,102,204,0.3)] hover:shadow-[0_6px_16px_rgba(0,102,204,0.4)] hover:-translate-y-px disabled:opacity-50 disabled:cursor-not-allowed" (click)="search()" [disabled]="!complaintId"><span class="material-symbols-outlined text-[1.2em] align-middle">search</span> Search</button>
        </div>
      </div>
    </div>

    @if (complaint) {
      <div class="bg-card rounded-2xl shadow-sm border border-border overflow-hidden w-full max-w-5xl">
        <div class="card-header">
          <h3>Complaint {{ complaint.id }}</h3>
          <span class="status-badge" [class]="complaint.status.toLowerCase().replace(' ', '-')">{{ complaint.status }}</span>
        </div>
        <div class="card-body">
          <div class="space-y-3">
            <div class="flex justify-between text-sm border-b border-dashed border-border pb-2">
              <span class="text-text-muted">Category</span>
              <span class="font-semibold">{{ complaint.category }}</span>
            </div>
            <div class="flex justify-between text-sm border-b border-dashed border-border pb-2">
              <span class="text-text-muted">Date Raised</span>
              <span class="font-semibold">{{ complaint.dateRaised | date:'dd MMM yyyy' }}</span>
            </div>
            <div class="flex justify-between text-sm border-b border-dashed border-border pb-2">
              <span class="text-text-muted">Priority</span>
              <span class="font-semibold" [class]="complaint.priority === 'High' ? 'text-danger' : complaint.priority === 'Medium' ? 'text-warning' : 'text-success'">
                {{ complaint.priority }}
              </span>
            </div>
            @if (complaint.assignedSmeName) {
              <div class="flex justify-between text-sm border-b border-dashed border-border pb-2">
                <span class="text-text-muted">Assigned SME</span>
                <span class="font-semibold">{{ complaint.assignedSmeName }}</span>
              </div>
            }
            @if (complaint.resolutionNotes) {
              <div class="mt-3">
                <span class="text-text-muted text-xs font-semibold uppercase">Remarks</span>
                <p class="text-sm mt-1 bg-surface rounded-lg p-3">{{ complaint.resolutionNotes }}</p>
              </div>
            }
            <div class="text-xs text-text-muted mt-3">
              <p class="italic">{{ complaint.description }}</p>
            </div>
          </div>
        </div>
      </div>
    }

    @if (searched && !complaint) {
      <div class="bg-card rounded-2xl shadow-sm border border-border overflow-hidden w-full max-w-5xl">
        <div class="card-body">
          <div class="empty-state">
            <div class="empty-icon"><span class="material-symbols-outlined text-[1.2em] align-middle">search</span></div>
            <h3>Complaint Not Found</h3>
            <p>No complaint found with ID "{{ complaintId }}". Please check and try again.</p>
          </div>
        </div>
      </div>
    }
  `
})
export class ComplaintStatusComponent {
  private complaintService = inject(ComplaintService);

  complaintId = '';
  complaint?: Complaint;
  searched = false;

  search() {
    this.searched = true;
    this.complaint = undefined;
    this.complaintService.getById(this.complaintId).subscribe(c => this.complaint = c);
  }
}





