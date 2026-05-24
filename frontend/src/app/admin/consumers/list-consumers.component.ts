import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { ConsumerService, Consumer } from '../../shared/services/consumer.service';
import { ToastService } from '../../shared/services/toast.service';
import { ConfirmDialogComponent } from '../../shared/components/confirm-dialog/confirm-dialog.component';

@Component({
  selector: 'app-list-consumers',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule, ConfirmDialogComponent],
  template: `
    <div class="mb-6">
<h1 class="m-0 mb-1 text-[1.4rem] font-bold text-[#003087] dark:text-blue-400">List Consumers</h1>
<p class="m-0 label">Manage all electricity consumers</p>
</div>

    <div class="bg-card rounded-2xl shadow-sm border border-border overflow-hidden">
      <div class="table-search-bar">
        <input class="w-full px-3.5 py-2.5 border-[1.5px] border-input-border rounded-lg text-[0.85rem] text-input-text bg-input-bg outline-none transition-colors focus:border-[#0066CC] focus:ring-[3px] focus:ring-[#0066CC]/10 dark:focus:border-blue-500 dark:focus:ring-blue-500/20 placeholder:text-text-muted" style="max-width: 280px;" placeholder="Search by name, consumer no, email..." [(ngModel)]="search" (ngModelChange)="applyFilters()">
        <div class="relative inline-block w-full align-middle" style="max-width: 160px;"><select class="w-full px-3.5 py-2.5 border-[1.5px] border-input-border rounded-lg text-[0.85rem] text-input-text bg-input-bg outline-none transition-colors focus:border-[#0066CC] focus:ring-[3px] focus:ring-[#0066CC]/10 dark:focus:border-blue-500 dark:focus:ring-blue-500/20 appearance-none pr-9" style="max-width: 160px;" [(ngModel)]="statusFilter" (ngModelChange)="applyFilters()">
          <option value="All">All Status</option>
          <option value="Active">Active</option>
          <option value="Disconnected">Disconnected</option>
        </select><span class="material-symbols-outlined absolute right-3 top-1/2 -translate-y-1/2 text-text-muted pointer-events-none">expand_more</span></div>
        <div class="relative inline-block w-full align-middle" style="max-width: 160px;"><select class="w-full px-3.5 py-2.5 border-[1.5px] border-input-border rounded-lg text-[0.85rem] text-input-text bg-input-bg outline-none transition-colors focus:border-[#0066CC] focus:ring-[3px] focus:ring-[#0066CC]/10 dark:focus:border-blue-500 dark:focus:ring-blue-500/20 appearance-none pr-9" style="max-width: 160px;" [(ngModel)]="typeFilter" (ngModelChange)="applyFilters()">
          <option value="All">All Types</option>
          <option value="Domestic">Residential</option>
          <option value="Commercial">Commercial</option>
        </select><span class="material-symbols-outlined absolute right-3 top-1/2 -translate-y-1/2 text-text-muted pointer-events-none">expand_more</span></div>
      </div>

      <div class="ems-table-wrapper">
        <table class="ems-table">
          <thead>
            <tr>
              <th>Consumer No</th>
              <th>Name</th>
              <th>Address</th>
              <th>Type</th>
              <th>Zone</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            @for (c of pagedConsumers; track c.id) {
              <tr>
                <td class="font-medium text-accent">{{ c.consumerNumber }}</td>
                <td class="font-medium">{{ c.customerName }}</td>
                <td class="text-xs text-text-muted max-w-[180px] truncate">{{ c.address }}</td>
                <td><span class="text-xs font-semibold px-2 py-0.5 rounded bg-sky text-primary">{{ c.connectionType }}</span></td>
                <td>{{ c.zone }}</td>
                <td><span class="status-badge" [class]="c.status.toLowerCase()">{{ c.status }}</span></td>
                <td>
                  <div class="flex gap-2">
                    <a [routerLink]="['/admin/consumers/edit', c.id]" class="text-xs text-accent font-semibold hover:underline">Edit</a>
                    <a [routerLink]="['/admin/consumers/status', c.id]" class="text-xs font-semibold hover:underline"
                      [class]="c.status === 'Active' ? 'text-danger' : 'text-success'">
                      {{ c.status === 'Active' ? 'Disconnect' : 'Reconnect' }}
                    </a>
                  </div>
                </td>
              </tr>
            }
            @if (filtered.length === 0) {
              <tr><td colspan="7" class="text-center py-8 text-text-muted">No consumers found</td></tr>
            }
          </tbody>
        </table>
      </div>

      @if (totalPages > 1) {
        <div class="flex items-center justify-between p-4 border-t border-border text-sm">
          <span class="text-text-muted text-xs">Showing {{ startIdx + 1 }} - {{ endIdx }} of {{ filtered.length }}</span>
          <div class="flex items-center gap-1">
            <button class="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-lg text-[0.85rem] font-semibold cursor-pointer transition-all bg-card text-text-primary border border-border hover:bg-card-hover disabled:opacity-50 disabled:cursor-not-allowed" style="padding:0.35rem 0.75rem;font-size:0.75rem;" [disabled]="page===1" (click)="page=page-1">Prev</button>
            @for (p of pages; track p) {
              <button class="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-lg text-[0.85rem] font-semibold cursor-pointer transition-all border border-border hover:bg-black/5 disabled:opacity-50 disabled:cursor-not-allowed" [class.primary]="p===page" [class.secondary]="p!==page" style="padding:0.35rem 0.65rem;font-size:0.75rem;" (click)="page=p">{{ p }}</button>
            }
            <button class="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-lg text-[0.85rem] font-semibold cursor-pointer transition-all bg-card text-text-primary border border-border hover:bg-card-hover disabled:opacity-50 disabled:cursor-not-allowed" style="padding:0.35rem 0.75rem;font-size:0.75rem;" [disabled]="page===totalPages" (click)="page=page+1">Next</button>
          </div>
        </div>
      }
    </div>
  `
})
export class ListConsumersComponent implements OnInit {
  private consumerService = inject(ConsumerService);

  all: Consumer[] = [];
  filtered: Consumer[] = [];
  search = '';
  statusFilter = 'All';
  typeFilter = 'All';
  page = 1;
  pageSize = 10;

  ngOnInit() {
    this.consumerService.getAll().subscribe(c => { this.all = c; this.applyFilters(); });
  }

  applyFilters() {
    let result = [...this.all];
    if (this.statusFilter !== 'All') result = result.filter(c => c.status === this.statusFilter);
    if (this.typeFilter !== 'All') result = result.filter(c => c.connectionType === this.typeFilter);
    if (this.search) {
      const s = this.search.toLowerCase();
      result = result.filter(c => c.customerName.toLowerCase().includes(s) || c.consumerNumber.toLowerCase().includes(s) || c.address.toLowerCase().includes(s));
    }
    this.filtered = result;
    this.page = 1;
  }

  get totalPages() { return Math.ceil(this.filtered.length / this.pageSize) || 1; }
  get startIdx() { return (this.page - 1) * this.pageSize; }
  get endIdx() { return Math.min(this.startIdx + this.pageSize, this.filtered.length); }
  get pagedConsumers() { return this.filtered.slice(this.startIdx, this.endIdx); }
  get pages() {
    const p: number[] = [];
    for (let i = Math.max(1, this.page - 2); i <= Math.min(this.totalPages, this.page + 2); i++) p.push(i);
    return p;
  }
}





