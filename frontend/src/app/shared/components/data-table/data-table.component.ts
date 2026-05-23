import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { StatusBadgeComponent } from '../status-badge/status-badge.component';
export interface TableColumn {
  key: string;
  label: string;
  sortable?: boolean;
  type?: 'text' | 'badge' | 'date' | 'currency' | 'actions';
}

@Component({
  selector: 'app-data-table',
  standalone: true,
  imports: [CommonModule, FormsModule, StatusBadgeComponent],
  template: `
    <div class="bg-card rounded-2xl shadow-sm border border-border overflow-hidden">
      <!-- Search & Filters -->
      @if (searchable) {
        <div class="px-6 py-4 border-b border-border flex gap-3 flex-wrap items-center">
          <div class="flex-1">
            <input
              class="w-full px-3.5 py-2.5 border-[1.5px] border-input-border rounded-lg text-[0.85rem] text-input-text bg-input-bg outline-none transition-colors focus:border-[#0066CC] focus:ring-[3px] focus:ring-[#0066CC]/10 dark:focus:border-blue-500 dark:focus:ring-blue-500/20 max-w-[320px]"
              [placeholder]="searchPlaceholder"
              [(ngModel)]="searchTerm"
              (ngModelChange)="onSearch()"
            />
          </div>
          <ng-content select="[tableFilters]"></ng-content>
        </div>
      }

      <!-- Table -->
      <div class="overflow-x-auto rounded-b-2xl">
        <table class="w-full border-collapse">
          <thead>
            <tr>
              @for (col of columns; track col.key) {
                <th
                  class="bg-[#F8FAFC] dark:bg-[#1E293B] px-4 py-3 text-[0.72rem] font-semibold uppercase tracking-[0.05em] text-text-secondary text-left border-b border-border transition-colors hover:bg-black/5 dark:hover:bg-white/5"
                  [class.cursor-pointer]="col.sortable"
                  (click)="col.sortable ? sort(col.key) : null"
                >
                  {{ col.label }}
                  @if (col.sortable && sortKey === col.key) {
                    <span>{{ sortDir === 'asc' ? ' ▲' : ' ▼' }}</span>
                  }
                </th>
              }
            </tr>
          </thead>
          <tbody>
            @if (pagedData.length === 0) {
              <tr>
                <td [attr.colspan]="columns.length" class="text-center py-8">
                  <div class="text-center p-12 text-text-muted">
                    <div class="text-5xl mb-4 opacity-50">📭</div>
                    <h3 class="text-base font-semibold text-text-secondary m-0 mb-2">No data found</h3>
                    <p class="text-[0.82rem] m-0">{{ emptyMessage }}</p>
                  </div>
                </td>
              </tr>
            }
            @for (row of pagedData; track $index) {
              <tr class="group hover:bg-black/5 dark:hover:bg-white/5 transition-colors border-b border-border/50 last:border-0">
                @for (col of columns; track col.key) {
                  <td class="px-4 py-3.5 text-[0.82rem] text-text-primary align-middle">
                    @switch (col.type) {
                      @case ('badge') {
                        <app-status-badge [status]="row[col.key]" />
                      }
                      @case ('currency') {
                        ₹{{ row[col.key] | number:'1.2-2' }}
                      }
                      @case ('date') {
                        {{ row[col.key] | date:'dd MMM yyyy' }}
                      }
                      @case ('actions') {
                        <ng-content select="[tableActions]"></ng-content>
                      }
                      @default {
                        {{ row[col.key] }}
                      }
                    }
                  </td>
                }
              </tr>
            }
          </tbody>
        </table>
      </div>

      <!-- Pagination -->
      @if (totalPages > 1) {
        <div class="flex items-center justify-between p-4 border-t border-border text-sm">
          <span class="text-text-muted text-xs">
            Showing {{ startIndex + 1 }} - {{ endIndex }} of {{ filteredData.length }} entries
          </span>
          <div class="flex items-center gap-1">
            <button
              class="inline-flex items-center justify-center gap-2 px-3 py-1.5 rounded-lg text-xs font-semibold cursor-pointer transition-all bg-card text-text-primary border border-border hover:bg-card-hover disabled:opacity-50 disabled:cursor-not-allowed"
              [disabled]="currentPage === 1"
              (click)="goToPage(currentPage - 1)"
            >Prev</button>
            @for (p of visiblePages; track p) {
              <button
                class="inline-flex items-center justify-center gap-2 px-2.5 py-1.5 rounded-lg text-xs font-semibold cursor-pointer transition-all"
                [ngClass]="p === currentPage ? 'bg-gradient-to-br from-[#003087] to-[#0066CC] text-white border-transparent' : 'bg-card text-text-primary border border-border hover:bg-card-hover'"
                (click)="goToPage(p)"
              >{{ p }}</button>
            }
            <button
              class="inline-flex items-center justify-center gap-2 px-3 py-1.5 rounded-lg text-xs font-semibold cursor-pointer transition-all bg-card text-text-primary border border-border hover:bg-card-hover disabled:opacity-50 disabled:cursor-not-allowed"
              [disabled]="currentPage === totalPages"
              (click)="goToPage(currentPage + 1)"
            >Next</button>
          </div>
        </div>
      }
    </div>
  `
})
export class DataTableComponent {
  @Input() columns: TableColumn[] = [];
  @Input() data: any[] = [];
  @Input() pageSize = 10;
  @Input() searchable = true;
  @Input() searchPlaceholder = 'Search...';
  @Input() emptyMessage = 'No records available.';
  @Output() rowAction = new EventEmitter<{ action: string; row: any }>();

  searchTerm = '';
  sortKey = '';
  sortDir: 'asc' | 'desc' = 'asc';
  currentPage = 1;

  get filteredData(): any[] {
    let result = [...this.data];
    if (this.searchTerm) {
      const term = this.searchTerm.toLowerCase();
      result = result.filter(row =>
        Object.values(row).some(val =>
          String(val).toLowerCase().includes(term)
        )
      );
    }
    if (this.sortKey) {
      result.sort((a, b) => {
        const aVal = a[this.sortKey] ?? '';
        const bVal = b[this.sortKey] ?? '';
        const cmp = String(aVal).localeCompare(String(bVal), undefined, { numeric: true });
        return this.sortDir === 'asc' ? cmp : -cmp;
      });
    }
    return result;
  }

  get totalPages(): number {
    return Math.ceil(this.filteredData.length / this.pageSize) || 1;
  }

  get startIndex(): number {
    return (this.currentPage - 1) * this.pageSize;
  }

  get endIndex(): number {
    return Math.min(this.startIndex + this.pageSize, this.filteredData.length);
  }

  get pagedData(): any[] {
    return this.filteredData.slice(this.startIndex, this.endIndex);
  }

  get visiblePages(): number[] {
    const pages: number[] = [];
    const start = Math.max(1, this.currentPage - 2);
    const end = Math.min(this.totalPages, start + 4);
    for (let i = start; i <= end; i++) pages.push(i);
    return pages;
  }

  onSearch(): void {
    this.currentPage = 1;
  }

  sort(key: string): void {
    if (this.sortKey === key) {
      this.sortDir = this.sortDir === 'asc' ? 'desc' : 'asc';
    } else {
      this.sortKey = key;
      this.sortDir = 'asc';
    }
  }

  goToPage(page: number): void {
    if (page >= 1 && page <= this.totalPages) {
      this.currentPage = page;
    }
  }

  getBadgeClass(status: string): string {
    if (!status) return '';
    return status.toLowerCase().replace(/ /g, '-').replace(/_/g, '-');
  }
}



