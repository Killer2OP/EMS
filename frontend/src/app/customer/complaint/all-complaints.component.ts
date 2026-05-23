import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ComplaintService, Complaint } from '../../shared/services/complaint.service';
import { AuthService } from '../../shared/services/auth.service';

@Component({
  selector: 'app-all-complaints',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="mb-6">
<h1 class="m-0 mb-1 text-[1.4rem] font-bold text-[#003087] dark:text-blue-400">My Complaints</h1>
<p class="m-0 label">View all your submitted complaints</p>
</div>

    <div class="bg-card rounded-2xl shadow-sm border border-border overflow-hidden">
      <div class="table-search-bar">
        <select class="w-full px-3.5 py-2.5 border-[1.5px] border-input-border rounded-lg text-[0.85rem] text-input-text bg-input-bg outline-none transition-colors focus:border-[#0066CC] focus:ring-[3px] focus:ring-[#0066CC]/10 dark:focus:border-blue-500 dark:focus:ring-blue-500/20 appearance-none pr-9 bg-[url('data:image/svg+xml,%3Csvg_xmlns=\'http://www.w3.org/2000/svg\'_width=\'12\'_height=\'12\'_viewBox=\'0_0_12_12\'%3E%3Cpath_d=\'M2_4l4_4_4-4\'_stroke=\'%2364748B\'_stroke-width=\'1.5\'_fill=\'none\'/%3E%3C/svg%3E')] bg-no-repeat bg-[right_12px_center]" style="max-width: 160px;" [(ngModel)]="statusFilter" (ngModelChange)="applyFilter()">
          <option value="All">All Status</option>
          <option value="Open">Open</option>
          <option value="In Progress">In Progress</option>
          <option value="Resolved">Resolved</option>
        </select>
      </div>

      <div class="ems-table-wrapper">
        <table class="ems-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Type</th>
              <th>Date</th>
              <th>Priority</th>
              <th>Status</th>
              <th>Remarks</th>
            </tr>
          </thead>
          <tbody>
            @for (c of filtered; track c.id) {
              <tr>
                <td class="font-medium text-accent">{{ c.id }}</td>
                <td>{{ c.category }}</td>
                <td>{{ c.dateRaised | date:'dd MMM yyyy' }}</td>
                <td>
                  <span class="text-xs font-semibold" [class]="c.priority === 'High' ? 'text-danger' : c.priority === 'Medium' ? 'text-warning' : 'text-success'">
                    {{ c.priority }}
                  </span>
                </td>
                <td><span class="status-badge" [class]="c.status.toLowerCase().replace(' ', '-')">{{ c.status }}</span></td>
                <td class="text-xs text-text-muted max-w-[200px] truncate">{{ c.resolutionNotes || '—' }}</td>
              </tr>
            }
            @if (filtered.length === 0) {
              <tr><td colspan="6" class="text-center py-8 text-text-muted">No complaints found</td></tr>
            }
          </tbody>
        </table>
      </div>
    </div>
  `
})
export class AllComplaintsComponent implements OnInit {
  private complaintService = inject(ComplaintService);
  private auth = inject(AuthService);

  allComplaints: Complaint[] = [];
  filtered: Complaint[] = [];
  statusFilter = 'All';

  ngOnInit() {
    const userId = this.auth.getCurrentUser()?.id || 1;
    this.complaintService.getByCustomer(userId).subscribe(c => {
      this.allComplaints = c;
      this.applyFilter();
    });
  }

  applyFilter() {
    this.filtered = this.statusFilter === 'All'
      ? [...this.allComplaints]
      : this.allComplaints.filter(c => c.status === this.statusFilter);
  }
}





