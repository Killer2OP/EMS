import { Component, OnInit, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ConsumerService, Consumer } from '../../shared/services/consumer.service';
import { ToastService } from '../../shared/services/toast.service';

@Component({
  selector: 'app-edit-consumer',
  standalone: true,
  imports: [FormsModule],
  template: `
    <div class="mb-6">
<h1 class="m-0 mb-1 text-[1.4rem] font-bold text-[#003087] dark:text-blue-400">Update Consumer</h1>
<p class="m-0 label">Edit consumer connection details</p>
</div>

    @if (consumer) {
      <div class="bg-card rounded-2xl shadow-sm border border-border overflow-hidden w-full max-w-5xl">
        <div class="card-header"><h3>Edit — {{ consumer.consumerNumber }}</h3></div>
        <div class="card-body">
          <div class="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 mb-4">
            <div class="flex flex-col gap-1.5">
              <label class="block text-[0.78rem] font-semibold text-text-primary mb-1.5">Customer Name</label>
              <input class="w-full px-3.5 py-2.5 border-[1.5px] border-input-border rounded-lg text-[0.85rem] text-input-text bg-input-bg outline-none transition-colors focus:border-[#0066CC] focus:ring-[3px] focus:ring-[#0066CC]/10 dark:focus:border-blue-500 dark:focus:ring-blue-500/20 placeholder:text-text-muted" [(ngModel)]="consumer.customerName" readonly style="background: #F0F4F8;">
            </div>
            <div class="flex flex-col gap-1.5">
              <label class="block text-[0.78rem] font-semibold text-text-primary mb-1.5">Consumer Number</label>
              <input class="w-full px-3.5 py-2.5 border-[1.5px] border-input-border rounded-lg text-[0.85rem] text-input-text bg-input-bg outline-none transition-colors focus:border-[#0066CC] focus:ring-[3px] focus:ring-[#0066CC]/10 dark:focus:border-blue-500 dark:focus:ring-blue-500/20 placeholder:text-text-muted" [(ngModel)]="consumer.consumerNumber" readonly style="background: #F0F4F8;">
            </div>
          </div>
          <div class="mb-4">
            <label class="block text-[0.78rem] font-semibold text-text-primary mb-1.5">Address</label>
            <textarea class="w-full px-3.5 py-2.5 border-[1.5px] border-input-border rounded-lg text-[0.85rem] text-input-text bg-input-bg outline-none transition-colors resize-y min-h-[100px] focus:border-[#0066CC] focus:ring-[3px] focus:ring-[#0066CC]/10 dark:focus:border-blue-500 dark:focus:ring-blue-500/20 placeholder:text-text-muted" [(ngModel)]="consumer.address" rows="2"></textarea>
          </div>
          <div class="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 mb-4">
            <div class="flex flex-col gap-1.5">
              <label class="block text-[0.78rem] font-semibold text-text-primary mb-1.5">Connection Type</label>
              <select class="w-full px-3.5 py-2.5 border-[1.5px] border-input-border rounded-lg text-[0.85rem] text-input-text bg-input-bg outline-none transition-colors focus:border-[#0066CC] focus:ring-[3px] focus:ring-[#0066CC]/10 dark:focus:border-blue-500 dark:focus:ring-blue-500/20 appearance-none pr-9 bg-[url('data:image/svg+xml,%3Csvg_xmlns=\'http://www.w3.org/2000/svg\'_width=\'12\'_height=\'12\'_viewBox=\'0_0_12_12\'%3E%3Cpath_d=\'M2_4l4_4_4-4\'_stroke=\'%2364748B\'_stroke-width=\'1.5\'_fill=\'none\'/%3E%3C/svg%3E')] bg-no-repeat bg-[right_12px_center]" [(ngModel)]="consumer.connectionType">
                <option value="Domestic">Residential</option>
                <option value="Commercial">Commercial</option>
              </select>
            </div>
            <div class="flex flex-col gap-1.5">
              <label class="block text-[0.78rem] font-semibold text-text-primary mb-1.5">Sanctioned Load (kW)</label>
              <input class="w-full px-3.5 py-2.5 border-[1.5px] border-input-border rounded-lg text-[0.85rem] text-input-text bg-input-bg outline-none transition-colors focus:border-[#0066CC] focus:ring-[3px] focus:ring-[#0066CC]/10 dark:focus:border-blue-500 dark:focus:ring-blue-500/20 placeholder:text-text-muted" type="number" [(ngModel)]="consumer.sanctionedLoad">
            </div>
          </div>
          <div class="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 mb-4">
            <div class="flex flex-col gap-1.5">
              <label class="block text-[0.78rem] font-semibold text-text-primary mb-1.5">Zone</label>
              <select class="w-full px-3.5 py-2.5 border-[1.5px] border-input-border rounded-lg text-[0.85rem] text-input-text bg-input-bg outline-none transition-colors focus:border-[#0066CC] focus:ring-[3px] focus:ring-[#0066CC]/10 dark:focus:border-blue-500 dark:focus:ring-blue-500/20 appearance-none pr-9 bg-[url('data:image/svg+xml,%3Csvg_xmlns=\'http://www.w3.org/2000/svg\'_width=\'12\'_height=\'12\'_viewBox=\'0_0_12_12\'%3E%3Cpath_d=\'M2_4l4_4_4-4\'_stroke=\'%2364748B\'_stroke-width=\'1.5\'_fill=\'none\'/%3E%3C/svg%3E')] bg-no-repeat bg-[right_12px_center]" [(ngModel)]="consumer.zone">
                <option value="Vijay Nagar">Vijay Nagar</option>
                <option value="Palasia">Palasia</option>
                <option value="Rau">Rau</option>
              </select>
            </div>
            <div class="flex flex-col gap-1.5">
              <label class="block text-[0.78rem] font-semibold text-text-primary mb-1.5">Tariff Category</label>
              <select class="w-full px-3.5 py-2.5 border-[1.5px] border-input-border rounded-lg text-[0.85rem] text-input-text bg-input-bg outline-none transition-colors focus:border-[#0066CC] focus:ring-[3px] focus:ring-[#0066CC]/10 dark:focus:border-blue-500 dark:focus:ring-blue-500/20 appearance-none pr-9 bg-[url('data:image/svg+xml,%3Csvg_xmlns=\'http://www.w3.org/2000/svg\'_width=\'12\'_height=\'12\'_viewBox=\'0_0_12_12\'%3E%3Cpath_d=\'M2_4l4_4_4-4\'_stroke=\'%2364748B\'_stroke-width=\'1.5\'_fill=\'none\'/%3E%3C/svg%3E')] bg-no-repeat bg-[right_12px_center]" [(ngModel)]="consumer.tariffCategory">
                <option value="LT-1">LT-1</option>
                <option value="HT-1">HT-1</option>
                <option value="HT-2">HT-2</option>
              </select>
            </div>
          </div>

          <div class="flex gap-3 mt-4">
            <button class="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-lg text-[0.85rem] font-semibold cursor-pointer transition-all bg-gradient-to-br from-[#003087] to-[#0066CC] text-white border-none shadow-[0_4px_12px_rgba(0,102,204,0.3)] hover:shadow-[0_6px_16px_rgba(0,102,204,0.4)] hover:-translate-y-px disabled:opacity-50 disabled:cursor-not-allowed flex-1 py-3" (click)="save()" [disabled]="saving">
              {{ saving ? '⏳ Saving...' : '💾 Save Changes' }}
            </button>
            <button class="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-lg text-[0.85rem] font-semibold cursor-pointer transition-all bg-card text-text-primary border border-border hover:bg-card-hover disabled:opacity-50 disabled:cursor-not-allowed" (click)="goBack()">Cancel</button>
          </div>
        </div>
      </div>
    }
  `
})
export class EditConsumerComponent implements OnInit {
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private consumerService = inject(ConsumerService);
  private toast = inject(ToastService);

  consumer?: Consumer;
  saving = false;

  ngOnInit() {
    const id = Number(this.route.snapshot.paramMap.get('id'));
    this.consumerService.getById(id).subscribe(c => this.consumer = c);
  }

  save() {
    if (!this.consumer) return;
    this.saving = true;
    this.consumerService.update(this.consumer.id, this.consumer).subscribe(() => {
      this.saving = false;
      this.toast.success('Consumer updated successfully!');
      this.router.navigate(['/admin/consumers']);
    });
  }

  goBack() { this.router.navigate(['/admin/consumers']); }
}





