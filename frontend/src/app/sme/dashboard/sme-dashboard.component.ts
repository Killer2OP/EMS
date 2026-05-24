import { Component, inject } from '@angular/core';
import { RouterModule } from '@angular/router';
import { StatsCardComponent } from '../../shared/components/stats-card/stats-card.component';
import { ComplaintService, Complaint } from '../../shared/services/complaint.service';

@Component({
  selector: 'app-sme-dashboard',
  standalone: true,
  imports: [RouterModule, StatsCardComponent],
  template: `
    <div class="mb-6">
<h1 class="m-0 mb-1 text-[1.4rem] font-bold text-[#003087] dark:text-blue-400">SME Dashboard</h1>
<p class="m-0 label">Service & Maintenance overview</p>
</div>

    <div class="bg-gradient-to-br from-slate-900 via-slate-800 to-slate-700 rounded-2xl p-8 text-white mb-6 relative overflow-hidden after:content-['⚡'] after:absolute after:right-8 after:top-1/2 after:-translate-y-1/2 after:text-[5rem] after:opacity-10">
      <h2 class="m-0 mb-1 text-[1.5rem] font-bold">Welcome, SME! <span class="material-symbols-outlined text-[1.2em] align-middle">build</span></h2>
<p class="m-0 mb-4 text-white/70 text-[0.85rem]">Manage and resolve assigned complaints</p>
    </div>

    <!-- Stats -->
    <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
      <app-stats-card icon="assignment" label="Total Assigned" [value]="'' + totalAssigned" iconBg="#E8F4FD" borderColor="#003087" />
      <app-stats-card icon="circle" label="Open" [value]="'' + openCount" iconBg="#FEE2E2" borderColor="#EF4444" />
      <app-stats-card icon="circle" label="In Progress" [value]="'' + inProgressCount" iconBg="#FEF3C7" borderColor="#F59E0B" />
      <app-stats-card icon="check_circle" label="Resolved" [value]="'' + resolvedCount" iconBg="#DCFCE7" borderColor="#22C55E" />
    </div>

    <!-- Complaint Queue -->
    <div class="bg-card rounded-2xl shadow-sm border border-border overflow-hidden">
      <div class="card-header">
        <h3>Complaint Queue</h3>
        <a routerLink="/sme/complaints" class="text-xs text-accent font-semibold hover:underline">View All →</a>
      </div>
      <div class="ems-table-wrapper">
        <table class="ems-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Consumer</th>
              <th>Type</th>
              <th>Priority</th>
              <th>Status</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            @for (c of recentComplaints; track c.id) {
              <tr>
                <td class="font-medium text-accent">{{ c.id }}</td>
                <td>{{ c.customerName }}</td>
                <td>{{ c.category }}</td>
                <td>
                  <span class="text-xs font-semibold" [class]="c.priority === 'High' ? 'text-danger' : c.priority === 'Medium' ? 'text-warning' : 'text-success'">
                    {{ c.priority }}
                  </span>
                </td>
                <td><span class="status-badge" [class]="c.status.toLowerCase().replace(' ', '-')">{{ c.status }}</span></td>
                <td>
                  <a [routerLink]="['/sme/complaints', c.id, 'action']" class="text-xs text-accent font-semibold hover:underline">Act On →</a>
                </td>
              </tr>
            }
            @if (recentComplaints.length === 0) {
              <tr><td colspan="6" class="text-center py-8 text-text-muted">No complaints assigned</td></tr>
            }
          </tbody>
        </table>
      </div>
    </div>
  `
})
export class SmeDashboardComponent {
  private complaintService = inject(ComplaintService);

  allComplaints: Complaint[] = [];
  totalAssigned = 0;
  openCount = 0;
  inProgressCount = 0;
  resolvedCount = 0;
  recentComplaints: Complaint[] = [];

  constructor() {
    this.complaintService.getBySme(3).subscribe(c => {
      this.allComplaints = c;
      this.totalAssigned = c.length;
      this.openCount = c.filter(x => x.status === 'Open').length;
      this.inProgressCount = c.filter(x => x.status === 'In Progress').length;
      this.resolvedCount = c.filter(x => x.status === 'Resolved').length;
      this.recentComplaints = c.sort((a, b) => {
        const p: Record<string, number> = { High: 0, Medium: 1, Low: 2 };
        return (p[a.priority] ?? 1) - (p[b.priority] ?? 1);
      }).slice(0, 10);
    });
  }
}






