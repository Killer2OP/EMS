import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

export interface ConfirmDialogData {
  title: string;
  message: string;
  confirmLabel?: string;
  cancelLabel?: string;
  showReason?: boolean;
  danger?: boolean;
}

@Component({
  selector: 'app-confirm-dialog',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    @if (open) {
      <div class="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50 animate-fade-in" (click)="cancel()">
        <div class="bg-white rounded-2xl shadow-2xl p-6 w-full max-w-md mx-4" (click)="$event.stopPropagation()">
          <h2 class="text-lg font-bold text-text-primary mb-2">{{ data.title }}</h2>
          <p class="text-sm text-text-muted mb-5">{{ data.message }}</p>

          @if (data.showReason) {
            <div class="mb-4">
              <label class="block text-[0.78rem] font-semibold text-text-primary mb-1.5">Reason</label>
              <textarea class="w-full px-3.5 py-2.5 border-[1.5px] border-input-border rounded-lg text-[0.85rem] text-input-text bg-input-bg outline-none transition-colors resize-y min-h-[100px] focus:border-[#0066CC] focus:ring-[3px] focus:ring-[#0066CC]/10 dark:focus:border-blue-500 dark:focus:ring-blue-500/20" [(ngModel)]="reason" rows="3" placeholder="Enter reason..."></textarea>
            </div>
          }

          <div class="flex gap-3 justify-end">
            <button class="inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg text-[0.85rem] font-semibold cursor-pointer transition-all bg-card-hover text-text-primary border-[1.5px] border-border hover:bg-border" (click)="cancel()">{{ data.cancelLabel || 'Cancel' }}</button>
            <button class="inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg text-[0.85rem] font-semibold cursor-pointer transition-all text-white hover:-translate-y-px" [ngClass]="data.danger ? 'bg-gradient-to-br from-red-600 to-red-500 shadow-[0_4px_12px_rgba(239,68,68,0.3)] hover:shadow-[0_6px_16px_rgba(239,68,68,0.4)]' : 'bg-gradient-to-br from-[#003087] to-[#0066CC] shadow-[0_4px_12px_rgba(0,102,204,0.3)] hover:shadow-[0_6px_16px_rgba(0,102,204,0.4)]'" (click)="confirm()">
              {{ data.confirmLabel || 'Confirm' }}
            </button>
          </div>
        </div>
      </div>
    }
  `
})
export class ConfirmDialogComponent {
  @Input() open = false;
  @Input() data: ConfirmDialogData = { title: 'Confirm', message: 'Are you sure?' };
  @Output() confirmed = new EventEmitter<{ confirmed: boolean; reason?: string }>();

  reason = '';

  confirm() {
    this.confirmed.emit({ confirmed: true, reason: this.reason });
    this.reason = '';
  }

  cancel() {
    this.confirmed.emit({ confirmed: false });
    this.reason = '';
  }
}



