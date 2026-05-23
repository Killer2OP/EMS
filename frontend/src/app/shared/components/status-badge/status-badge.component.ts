import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

type StatusType = 'paid' | 'unpaid' | 'overdue' | 'active' | 'disconnected' | 'open' | 'in-progress' | 'resolved' | 'pending' | string;

@Component({
  selector: 'app-status-badge',
  standalone: true,
  imports: [CommonModule],
  template: `<span class="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[0.7rem] font-semibold uppercase tracking-[0.05em]" [ngClass]="colorClass">
    <span class="w-1.5 h-1.5 rounded-full bg-current"></span>
    {{ label }}
  </span>`
})
export class StatusBadgeComponent {
  @Input() status: StatusType = '';

  get colorClass(): string {
    const s = this.status.toLowerCase().replace(' ', '-').replace('_', '-');
    if (['paid', 'active', 'resolved', 'connected'].includes(s)) {
      return 'bg-green-500/15 text-green-500';
    }
    if (['unpaid', 'open', 'overdue', 'disconnected'].includes(s)) {
      return 'bg-red-500/15 text-red-500';
    }
    if (['in-progress', 'pending'].includes(s)) {
      return 'bg-amber-500/15 text-amber-500';
    }
    return 'bg-slate-500/15 text-slate-500'; // fallback
  }

  get label(): string {
    return this.status.replace(/-/g, ' ').replace(/\b\w/g, c => c.toUpperCase());
  }
}


