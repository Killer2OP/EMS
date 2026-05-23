import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { SidebarComponent } from '../shared/components/sidebar/sidebar.component';
import { NavbarComponent } from '../shared/components/navbar/navbar.component';

@Component({
  selector: 'app-sme-shell',
  standalone: true,
  imports: [RouterOutlet, SidebarComponent, NavbarComponent],
  template: `
    <div class="flex min-h-screen">
      <app-sidebar [collapsed]="sidebarCollapsed" />
      <div class="flex-1 flex flex-col overflow-hidden min-w-0">
        <app-navbar [title]="'SME Portal'" [subtitle]="'Service & Maintenance Dashboard'"
          (toggleSidebar)="sidebarCollapsed = !sidebarCollapsed" />
        <main class="flex-1 p-6 overflow-y-auto">
          <router-outlet />
        </main>
        <footer class="py-4 px-6 text-center text-xs text-text-secondary border-t border-border bg-card">
          VidyutSeva — Powered by TCS ILP Team 10 | 2026
        </footer>
      </div>
    </div>
  `
})
export class SmeShellComponent {
  sidebarCollapsed = false;
}
