import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { ComplaintService, Complaint } from '../../shared/services/complaint.service';

@Component({
  selector: 'app-search-complaint',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  template: `
    <div class="mb-6">
<h1 class="m-0 mb-1 text-[1.4rem] font-bold text-[#003087] dark:text-blue-400">Search Complaint</h1>
<p class="m-0 label">Find a complaint by ID or consumer name</p>
</div>

    <div class="bg-card rounded-2xl shadow-sm border border-border overflow-hidden mb-6 w-full max-w-5xl">
      <div class="card-body">
        <label class="block text-[0.78rem] font-semibold text-text-primary mb-1.5">Search Query</label>
        <div class="flex gap-3">
          <input class="w-full px-3.5 py-2.5 border-[1.5px] border-input-border rounded-lg text-[0.85rem] text-input-text bg-input-bg outline-none transition-colors focus:border-[#0066CC] focus:ring-[3px] focus:ring-[#0066CC]/10 dark:focus:border-blue-500 dark:focus:ring-blue-500/20 placeholder:text-text-muted flex-1" type="text" [(ngModel)]="query" placeholder="Complaint ID or Consumer Name">
          <button class="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-lg text-[0.85rem] font-semibold cursor-pointer transition-all bg-gradient-to-br from-[#003087] to-[#0066CC] text-white border-none shadow-[0_4px_12px_rgba(0,102,204,0.3)] hover:shadow-[0_6px_16px_rgba(0,102,204,0.4)] hover:-translate-y-px disabled:opacity-50 disabled:cursor-not-allowed" (click)="search()" [disabled]="!query">🔍 Search</button>
        </div>
      </div>
    </div>

    @if (results.length > 0) {
      <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
        @for (c of results; track c.id) {
          <div class="bg-card rounded-2xl shadow-sm border border-border overflow-hidden">
            <div class="card-header">
              <h3 class="text-accent">{{ c.id }}</h3>
              <span class="status-badge" [class]="c.status.toLowerCase().replace(' ', '-')">{{ c.status }}</span>
            </div>
            <div class="card-body">
              <div class="space-y-2 text-sm mb-4">
                <div class="flex justify-between"><span class="text-text-muted">Customer</span><span class="font-semibold">{{ c.customerName }}</span></div>
                <div class="flex justify-between"><span class="text-text-muted">Type</span><span class="font-semibold">{{ c.category }}</span></div>
                <div class="flex justify-between"><span class="text-text-muted">Priority</span>
                  <span class="font-semibold" [class]="c.priority === 'High' ? 'text-danger' : 'text-warning'">{{ c.priority }}</span>
                </div>
                <div class="flex justify-between"><span class="text-text-muted">Date</span><span class="font-semibold">{{ c.dateRaised }}</span></div>
              </div>
              <a [routerLink]="['/sme/complaints', c.id, 'action']" class="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-lg text-[0.85rem] font-semibold cursor-pointer transition-all bg-[#0066CC] text-white border-none hover:bg-[#003087] disabled:opacity-50 disabled:cursor-not-allowed w-full text-center">Act On →</a>
            </div>
          </div>
        }
      </div>
    }

    @if (searched && results.length === 0) {
      <div class="bg-card rounded-2xl shadow-sm border border-border overflow-hidden w-full max-w-5xl">
        <div class="card-body">
          <div class="empty-state">
            <div class="empty-icon">🔍</div>
            <h3>No Results</h3>
            <p>No complaints found matching "{{ query }}".</p>
          </div>
        </div>
      </div>
    }
  `
})
export class SearchComplaintComponent {
  private complaintService = inject(ComplaintService);

  query = '';
  results: Complaint[] = [];
  searched = false;

  search() {
    this.searched = true;
    this.complaintService.getAll().subscribe(all => {
      const q = this.query.toLowerCase();
      this.results = all.filter(c => c.id.toLowerCase().includes(q) || c.customerName.toLowerCase().includes(q));
    });
  }
}





