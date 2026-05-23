import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ToastService } from '../../services/toast.service';

@Component({
  selector: 'app-toast',
  standalone: true,
  imports: [CommonModule],
  template: `
    @if (toastService.toasts().length > 0) {
      <div class="fixed top-5 right-5 flex flex-col gap-2.5 z-[9999]">
        @for (toast of toastService.toasts(); track toast.id) {
          <div class="flex items-center gap-3 px-4 py-3.5 rounded-lg bg-card text-text-primary shadow-[0_8px_30px_rgba(0,0,0,0.12)] border border-border border-l-4 text-[0.88rem] font-medium min-w-[300px] max-w-[400px] animate-[slideInRight_0.4s_ease-out]"
               [ngClass]="{
                 'border-l-green-500': toast.type === 'success',
                 'border-l-red-500': toast.type === 'error',
                 'border-l-blue-500': toast.type === 'info',
                 'border-l-amber-500': toast.type === 'warning'
               }">
            <span>
              @switch (toast.type) {
                @case ('success') { ✅ }
                @case ('error') { ❌ }
                @case ('info') { ℹ️ }
                @case ('warning') { ⚠️ }
              }
            </span>
            <span>{{ toast.message }}</span>
            <button class="ml-auto bg-transparent border-none text-text-muted cursor-pointer p-1 rounded transition-colors hover:bg-black/5 dark:hover:bg-white/10 hover:text-text-primary" (click)="toastService.dismiss(toast.id)">✕</button>
          </div>
        }
      </div>
    }
  `
})
export class ToastComponent {
  toastService = inject(ToastService);
}
