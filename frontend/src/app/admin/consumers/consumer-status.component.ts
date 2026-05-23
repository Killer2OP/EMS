import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ConsumerService, Consumer } from '../../shared/services/consumer.service';
import { ToastService } from '../../shared/services/toast.service';
import { ConfirmDialogComponent } from '../../shared/components/confirm-dialog/confirm-dialog.component';

@Component({
  selector: 'app-consumer-status',
  standalone: true,
  imports: [CommonModule, FormsModule, ConfirmDialogComponent],
  template: `
    <div class="mb-6">
<h1 class="m-0 mb-1 text-[1.4rem] font-bold text-[#003087] dark:text-blue-400">Consumer Connection Status</h1>
<p class="m-0 label">Manage connection status for a consumer</p>
</div>

    @if (consumer) {
      <!-- Consumer Detail Card -->
      <div class="bg-card rounded-2xl shadow-sm border border-border overflow-hidden mb-6 w-full max-w-5xl">
        <div class="card-header">
          <h3>{{ consumer.customerName }}</h3>
          <span class="status-badge" [class]="consumer.status.toLowerCase()">{{ consumer.status }}</span>
        </div>
        <div class="card-body">
          <div class="grid grid-cols-2 gap-4 text-sm">
            <div><span class="text-text-muted">Consumer No.</span><p class="font-semibold">{{ consumer.consumerNumber }}</p></div>
            <div><span class="text-text-muted">Connection Type</span><p class="font-semibold">{{ consumer.connectionType }}</p></div>
            <div><span class="text-text-muted">Zone</span><p class="font-semibold">{{ consumer.zone }}</p></div>
            <div><span class="text-text-muted">Load</span><p class="font-semibold">{{ consumer.sanctionedLoad }} kW</p></div>
          </div>
        </div>
      </div>

      <!-- Status Toggle -->
      <div class="bg-card rounded-2xl shadow-sm border border-border overflow-hidden w-full max-w-5xl">
        <div class="card-body text-center py-8">
          <div class="text-4xl mb-3">
            {{ consumer.status === 'Active' ? '🟢' : '🔴' }}
          </div>
          <h3 class="text-lg font-bold mb-1">
            Connection is currently <span [class]="consumer.status === 'Active' ? 'text-success' : 'text-danger'">{{ consumer.status }}</span>
          </h3>
          <p class="text-text-muted text-sm mb-6">
            {{ consumer.status === 'Active' ? 'Disconnect this consumer to stop electricity supply.' : 'Reconnect this consumer to restore electricity supply.' }}
          </p>

          @if (consumer.status === 'Active') {
            <div class="mb-4 text-left" style="max-width: 400px; margin: 0 auto;">
              <label class="block text-[0.78rem] font-semibold text-text-primary mb-1.5">Reason for Disconnection</label>
              <textarea class="w-full px-3.5 py-2.5 border-[1.5px] border-input-border rounded-lg text-[0.85rem] text-input-text bg-input-bg outline-none transition-colors resize-y min-h-[100px] focus:border-[#0066CC] focus:ring-[3px] focus:ring-[#0066CC]/10 dark:focus:border-blue-500 dark:focus:ring-blue-500/20 placeholder:text-text-muted" [(ngModel)]="reason" rows="3" placeholder="Enter reason (required)..."></textarea>
            </div>
            <button class="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-lg text-[0.85rem] font-semibold cursor-pointer transition-all bg-red-500 text-white border-none hover:bg-red-600 disabled:opacity-50 disabled:cursor-not-allowed py-3 px-8" (click)="showConfirm = true" [disabled]="!reason">
              ⚠️ Disconnect Consumer
            </button>
          } @else {
            <button class="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-lg text-[0.85rem] font-semibold cursor-pointer transition-all bg-green-500 text-white border-none hover:bg-green-600 disabled:opacity-50 disabled:cursor-not-allowed py-3 px-8" (click)="showConfirm = true">
              ✅ Reconnect Consumer
            </button>
          }
        </div>
      </div>

      <app-confirm-dialog
        [open]="showConfirm"
        [data]="{
          title: consumer.status === 'Active' ? 'Disconnect Consumer?' : 'Reconnect Consumer?',
          message: consumer.status === 'Active' ? 'This will stop electricity supply to ' + consumer.customerName + '.' : 'This will restore electricity supply to ' + consumer.customerName + '.',
          confirmLabel: consumer.status === 'Active' ? 'Disconnect' : 'Reconnect',
          danger: consumer.status === 'Active'
        }"
        (confirmed)="onConfirm($event)"
      />
    }
  `
})
export class ConsumerStatusComponent implements OnInit {
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private consumerService = inject(ConsumerService);
  private toast = inject(ToastService);

  consumer?: Consumer;
  reason = '';
  showConfirm = false;

  ngOnInit() {
    const id = Number(this.route.snapshot.paramMap.get('id'));
    this.consumerService.getById(id).subscribe(c => this.consumer = c);
  }

  onConfirm(result: { confirmed: boolean }) {
    this.showConfirm = false;
    if (!result.confirmed || !this.consumer) return;

    this.consumerService.toggleStatus(this.consumer.id, this.reason).subscribe(updated => {
      this.consumer = updated;
      this.toast.success(
        updated.status === 'Active' ? 'Consumer reconnected successfully!' : 'Consumer disconnected.'
      );
      this.reason = '';
    });
  }
}





