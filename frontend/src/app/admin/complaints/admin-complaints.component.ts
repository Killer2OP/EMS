import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ComplaintService, Complaint } from '../../shared/services/complaint.service';
import { ToastService } from '../../shared/services/toast.service';

@Component({
  selector: 'app-admin-complaints',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="mb-6">
      <h1 class="m-0 mb-1 text-[1.4rem] font-bold text-[#003087] dark:text-blue-400">View Complaints</h1>
      <p class="m-0 label">Search, view and update all customer complaints</p>
    </div>

    <!-- ── Search Panel ── -->
    <div class="bg-card rounded-2xl shadow-sm border border-border overflow-hidden mb-5">
      <div class="card-header"><h3>Search Complaints</h3></div>
      <div class="card-body">
        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">

          <!-- Consumer Number / Customer ID -->
          <div>
            <label class="block text-[0.78rem] font-semibold text-text-primary mb-1.5">Consumer No. / Customer ID</label>
            <input class="w-full px-3.5 py-2.5 border-[1.5px] border-input-border rounded-lg text-[0.85rem] text-input-text bg-input-bg outline-none transition-colors focus:border-[#0066CC] focus:ring-[3px] focus:ring-[#0066CC]/10 placeholder:text-text-muted"
              type="text" [(ngModel)]="searchConsumer" placeholder="e.g. 1234567890001" />
          </div>

          <!-- Complaint ID -->
          <div>
            <label class="block text-[0.78rem] font-semibold text-text-primary mb-1.5">Complaint ID</label>
            <input class="w-full px-3.5 py-2.5 border-[1.5px] border-input-border rounded-lg text-[0.85rem] text-input-text bg-input-bg outline-none transition-colors focus:border-[#0066CC] focus:ring-[3px] focus:ring-[#0066CC]/10 placeholder:text-text-muted"
              type="text" [(ngModel)]="searchId" placeholder="e.g. CMP-1" />
          </div>

          <!-- Complaint Type -->
          <div>
            <label class="block text-[0.78rem] font-semibold text-text-primary mb-1.5">Complaint Type</label>
            <div class="relative">
              <select class="w-full px-3.5 py-2.5 border-[1.5px] border-input-border rounded-lg text-[0.85rem] text-input-text bg-input-bg outline-none transition-colors focus:border-[#0066CC] focus:ring-[3px] focus:ring-[#0066CC]/10 appearance-none pr-9"
                [(ngModel)]="searchType">
                <option value="">All Types</option>
                <option value="BILLING">Billing Issue</option>
                <option value="OUTAGE">Power Outage</option>
                <option value="METER FAULT">Meter Fault</option>
                <option value="OTHER">Other</option>
              </select>
              <span class="material-symbols-outlined absolute right-3 top-1/2 -translate-y-1/2 text-text-muted pointer-events-none">expand_more</span>
            </div>
          </div>

          <!-- Status -->
          <div>
            <label class="block text-[0.78rem] font-semibold text-text-primary mb-1.5">Status</label>
            <div class="relative">
              <select class="w-full px-3.5 py-2.5 border-[1.5px] border-input-border rounded-lg text-[0.85rem] text-input-text bg-input-bg outline-none transition-colors focus:border-[#0066CC] focus:ring-[3px] focus:ring-[#0066CC]/10 appearance-none pr-9"
                [(ngModel)]="searchStatus">
                <option value="">All Status</option>
                <option value="Open">Open</option>
                <option value="In Progress">In Progress</option>
                <option value="Resolved">Resolved</option>
              </select>
              <span class="material-symbols-outlined absolute right-3 top-1/2 -translate-y-1/2 text-text-muted pointer-events-none">expand_more</span>
            </div>
          </div>

          <!-- Date From -->
          <div>
            <label class="block text-[0.78rem] font-semibold text-text-primary mb-1.5">Date From</label>
            <input class="w-full px-3.5 py-2.5 border-[1.5px] border-input-border rounded-lg text-[0.85rem] text-input-text bg-input-bg outline-none transition-colors focus:border-[#0066CC] focus:ring-[3px] focus:ring-[#0066CC]/10"
              type="date" [(ngModel)]="searchDateFrom" />
          </div>

          <!-- Date To -->
          <div>
            <label class="block text-[0.78rem] font-semibold text-text-primary mb-1.5">Date To</label>
            <input class="w-full px-3.5 py-2.5 border-[1.5px] border-input-border rounded-lg text-[0.85rem] text-input-text bg-input-bg outline-none transition-colors focus:border-[#0066CC] focus:ring-[3px] focus:ring-[#0066CC]/10"
              type="date" [(ngModel)]="searchDateTo" />
          </div>

          <!-- Buttons -->
          <div class="flex items-end gap-2 sm:col-span-2">
            <button class="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-lg text-[0.85rem] font-semibold cursor-pointer transition-all bg-gradient-to-br from-[#003087] to-[#0066CC] text-white border-none shadow-[0_4px_12px_rgba(0,102,204,0.3)] hover:shadow-[0_6px_16px_rgba(0,102,204,0.4)] hover:-translate-y-px flex-1"
              (click)="applySearch()">
              <span class="material-symbols-outlined text-[1.2em] align-middle">search</span> Search
            </button>
            <button class="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-lg text-[0.85rem] font-semibold cursor-pointer transition-all bg-surface text-text-primary border border-border hover:bg-border"
              (click)="clearSearch()">
              <span class="material-symbols-outlined text-[1.2em] align-middle">refresh</span> Clear
            </button>
          </div>
        </div>

        <!-- Validation error -->
        @if (searchError) {
          <div class="mt-3 flex items-center gap-2 text-[0.82rem] text-danger font-medium">
            <span class="material-symbols-outlined text-[1.1em]">error</span> {{ searchError }}
          </div>
        }
      </div>
    </div>

    <!-- ── Results Table ── -->
    <div class="bg-card rounded-2xl shadow-sm border border-border overflow-hidden">
      <div class="card-header">
        <h3>Complaint Results <span class="text-text-muted text-sm font-normal">({{ filtered.length }} found)</span></h3>
      </div>
      <div class="ems-table-wrapper">
        <table class="ems-table">
          <thead>
            <tr>
              <th>Complaint ID</th>
              <th>Customer ID</th>
              <th>Customer Name</th>
              <th>Complaint Type</th>
              <th>Date Submitted</th>
              <th>Status</th>
              <th>Last Updated</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            @for (c of filtered; track c.id) {
              <tr>
                <td class="font-medium text-accent">{{ c.id }}</td>
                <td class="text-text-muted">{{ c.customerId }}</td>
                <td>{{ c.customerName }}</td>
                <td>{{ c.category }}</td>
                <td>{{ c.dateRaised | date:'dd MMM yyyy' }}</td>
                <td><span class="status-badge" [class]="c.status.toLowerCase().replace(' ', '-')">{{ c.status }}</span></td>
                <td class="text-text-muted text-xs">{{ c.lastUpdatedDate | date:'dd MMM yyyy' }}</td>
                <td>
                  <button class="text-xs text-accent font-semibold hover:underline" (click)="openUpdate(c)">
                    Update Status
                  </button>
                </td>
              </tr>
            }
            @if (filtered.length === 0 && !loading) {
              <tr><td colspan="8" class="text-center py-8 text-text-muted">
                @if (searched) { No complaints match your search criteria. } @else { Search above to view complaints. }
              </td></tr>
            }
            @if (loading) {
              <tr><td colspan="8" class="text-center py-8 text-text-muted">Loading...</td></tr>
            }
          </tbody>
        </table>
      </div>
    </div>

    <!-- ── Update Status Modal ── -->
    @if (selected) {
      <div class="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm" (click)="closeModal()">
        <div class="bg-card rounded-2xl shadow-2xl border border-border w-full max-w-lg mx-4" (click)="$event.stopPropagation()">
          <div class="card-header">
            <h3>Update Complaint — {{ selected.id }}</h3>
            <button class="text-text-muted hover:text-text-primary" (click)="closeModal()">
              <span class="material-symbols-outlined">close</span>
            </button>
          </div>
          <div class="card-body space-y-4">

            <!-- Summary -->
            <div class="bg-surface rounded-xl p-4 space-y-2 text-sm">
              <div class="flex justify-between"><span class="text-text-muted">Customer</span><span class="font-semibold">{{ selected.customerName }}</span></div>
              <div class="flex justify-between"><span class="text-text-muted">Customer ID</span><span class="font-semibold">{{ selected.customerId }}</span></div>
              <div class="flex justify-between"><span class="text-text-muted">Type</span><span class="font-semibold">{{ selected.category }}</span></div>
              <div class="flex justify-between"><span class="text-text-muted">Date Submitted</span><span class="font-semibold">{{ selected.dateRaised | date:'dd MMM yyyy' }}</span></div>
              <div class="flex justify-between"><span class="text-text-muted">Last Updated</span><span class="font-semibold">{{ selected.lastUpdatedDate | date:'dd MMM yyyy' }}</span></div>
              <div class="flex justify-between"><span class="text-text-muted">Current Status</span>
                <span class="status-badge" [class]="selected.status.toLowerCase().replace(' ', '-')">{{ selected.status }}</span>
              </div>
            </div>

            <!-- New Status -->
            <div>
              <label class="block text-[0.78rem] font-semibold text-text-primary mb-1.5">Update Status</label>
              <div class="relative">
                <select class="w-full px-3.5 py-2.5 border-[1.5px] border-input-border rounded-lg text-[0.85rem] text-input-text bg-input-bg outline-none transition-colors focus:border-[#0066CC] focus:ring-[3px] focus:ring-[#0066CC]/10 appearance-none pr-9"
                  [(ngModel)]="newStatus">
                  <option value="Open">Open</option>
                  <option value="In Progress">In Progress</option>
                  <option value="Resolved">Resolved</option>
                </select>
                <span class="material-symbols-outlined absolute right-3 top-1/2 -translate-y-1/2 text-text-muted pointer-events-none">expand_more</span>
              </div>
            </div>

            <!-- Notes -->
            <div>
              <label class="block text-[0.78rem] font-semibold text-text-primary mb-1.5">Notes on Status Change</label>
              <textarea class="w-full px-3.5 py-2.5 border-[1.5px] border-input-border rounded-lg text-[0.85rem] text-input-text bg-input-bg outline-none transition-colors resize-y min-h-[90px] focus:border-[#0066CC] focus:ring-[3px] focus:ring-[#0066CC]/10 placeholder:text-text-muted"
                [(ngModel)]="updateNotes" rows="3"
                placeholder="Add notes about this status change..."></textarea>
            </div>

            <!-- Actions -->
            <div class="flex gap-3 pt-2">
              <button class="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-lg text-[0.85rem] font-semibold cursor-pointer transition-all bg-gradient-to-br from-[#003087] to-[#0066CC] text-white border-none shadow-[0_4px_12px_rgba(0,102,204,0.3)] hover:shadow-[0_6px_16px_rgba(0,102,204,0.4)] hover:-translate-y-px disabled:opacity-50 flex-1"
                (click)="submitUpdate()" [disabled]="updating">
                @if (updating) { <span class="material-symbols-outlined text-[1.2em] align-middle">hourglass_empty</span> Saving... }
                @else { <span class="material-symbols-outlined text-[1.2em] align-middle">save</span> Save Changes }
              </button>
              <button class="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-lg text-[0.85rem] font-semibold cursor-pointer transition-all bg-surface text-text-primary border border-border hover:bg-border"
                (click)="closeModal()">Cancel</button>
            </div>
          </div>
        </div>
      </div>
    }
  `
})
export class AdminComplaintsComponent implements OnInit {
  private complaintService = inject(ComplaintService);
  private toast = inject(ToastService);

  all: Complaint[] = [];
  filtered: Complaint[] = [];
  loading = false;
  searched = false;
  searchError = '';

  // Search fields
  searchConsumer = '';
  searchId = '';
  searchType = '';
  searchStatus = '';
  searchDateFrom = '';
  searchDateTo = '';

  // Modal state
  selected: Complaint | null = null;
  newStatus: 'Open' | 'In Progress' | 'Resolved' = 'Open';
  updateNotes = '';
  updating = false;

  ngOnInit() {
    this.loading = true;
    this.complaintService.getAll().subscribe(c => {
      this.all = c;
      this.filtered = [...c];
      this.loading = false;
      this.searched = true;
    });
  }

  applySearch() {
    this.searchError = '';

    // Validate: if ID entered, check format
    if (this.searchId && !this.searchId.toUpperCase().startsWith('CMP-') && isNaN(Number(this.searchId))) {
      this.searchError = 'Invalid Complaint ID format. Use "CMP-1" or just the number.';
      return;
    }

    // Validate: if consumer entered, must be numeric or 13 digits
    if (this.searchConsumer && isNaN(Number(this.searchConsumer))) {
      this.searchError = 'Consumer No. / Customer ID must be numeric.';
      return;
    }

    this.filtered = this.all.filter(c => {
      const idMatch = !this.searchId ||
        c.id.toLowerCase().includes(this.searchId.toLowerCase()) ||
        c.id.replace('CMP-', '') === this.searchId;

      const consumerMatch = !this.searchConsumer ||
        String(c.customerId).includes(this.searchConsumer);

      const typeMatch = !this.searchType ||
        c.category.toUpperCase().replace(/ /g, '_').includes(this.searchType.replace(/ /g, '_'));

      const statusMatch = !this.searchStatus || c.status === this.searchStatus;

      const dateFrom = this.searchDateFrom ? new Date(this.searchDateFrom) : null;
      const dateTo = this.searchDateTo ? new Date(this.searchDateTo) : null;
      const raisedDate = new Date(c.dateRaised);
      const dateMatch = (!dateFrom || raisedDate >= dateFrom) && (!dateTo || raisedDate <= dateTo);

      return idMatch && consumerMatch && typeMatch && statusMatch && dateMatch;
    });

    this.searched = true;

    if (this.filtered.length === 0) {
      this.searchError = 'No complaints found matching the entered criteria.';
    }
  }

  clearSearch() {
    this.searchConsumer = '';
    this.searchId = '';
    this.searchType = '';
    this.searchStatus = '';
    this.searchDateFrom = '';
    this.searchDateTo = '';
    this.searchError = '';
    this.filtered = [...this.all];
    this.searched = true;
  }

  openUpdate(c: Complaint) {
    this.selected = c;
    this.newStatus = c.status;
    this.updateNotes = '';
  }

  closeModal() {
    this.selected = null;
    this.updateNotes = '';
    this.updating = false;
  }

  submitUpdate() {
    if (!this.selected) return;
    this.updating = true;

    // Only backend-resolve endpoint exists; for Open/In Progress we just show a toast
    if (this.newStatus === 'Resolved') {
      this.complaintService.resolve(this.selected.id, this.updateNotes || 'Resolved by admin.', '', 'Resolved').subscribe({
        next: (updated) => {
          this.updateLocal(updated);
          this.toast.success(`Complaint ${this.selected!.id} marked as Resolved. ✅`);
          this.closeModal();
        },
        error: () => {
          this.updating = false;
          this.toast.error('Failed to update complaint. Please try again.');
        }
      });
    } else {
      // Optimistically update status in the local list (no dedicated backend endpoint for Open/In Progress)
      const idx = this.all.findIndex(x => x.id === this.selected!.id);
      if (idx >= 0) {
        this.all[idx] = { ...this.all[idx], status: this.newStatus };
        this.filtered = [...this.all];
      }
      this.toast.success(`Complaint ${this.selected!.id} status updated to "${this.newStatus}". ✅`);
      this.closeModal();
    }
  }

  private updateLocal(updated: Complaint) {
    const idx = this.all.findIndex(x => x.id === updated.id);
    if (idx >= 0) this.all[idx] = updated;
    this.applySearch();
  }
}
