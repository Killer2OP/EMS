import { Component, Input, inject } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../services/auth.service';

interface NavItem {
  id: string;
  label: string;
  icon: string;
  route: string;
}

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [RouterModule, CommonModule],
  template: `
    <aside id="app-sidebar" 
           class="flex flex-col bg-sidebar-bg border-r border-sidebar-border transition-all duration-300 z-[100]"
           [ngClass]="collapsed ? 'w-[68px] min-w-[68px]' : 'w-[270px] min-w-[270px]'">
      
      <div id="sidebar-brand" class="p-5 flex items-center gap-3 border-b border-sidebar-border">
        <div id="brand-icon" class="w-10 h-10 rounded-xl flex items-center justify-center text-xl text-primary font-extrabold shrink-0 bg-gradient-to-br from-[#F5C518] to-[#F59E0B]">⚡</div>
        <div id="brand-text" [class.hidden]="collapsed">
          <h2 id="brand-title" class="m-0 text-base font-extrabold tracking-tight text-text-primary">VidyutSeva</h2>
          <p id="brand-subtitle" class="m-0 text-[0.6rem] uppercase tracking-wider text-text-muted">Electricity Management</p>
        </div>
      </div>

      <div id="sidebar-user" class="p-4 flex items-center gap-3 border-b border-sidebar-border">
        <div id="user-avatar" class="w-9 h-9 rounded-full bg-gradient-to-br from-accent to-primary flex items-center justify-center text-white font-bold text-sm shrink-0">{{ initials }}</div>
        <div id="user-info" [class.hidden]="collapsed">
          <h4 id="user-name" class="m-0 text-xs font-semibold text-text-primary whitespace-nowrap overflow-hidden text-ellipsis max-w-[150px]">{{ user?.name }}</h4>
          <span id="user-role" class="text-[0.6rem] font-semibold uppercase tracking-wider px-1.5 py-0.5 rounded inline-block mt-0.5" 
            [ngClass]="{
              'bg-green-500/20 text-green-500': user?.role === 'CUSTOMER',
              'bg-red-500/20 text-red-500': user?.role === 'ADMIN',
              'bg-yellow-500/20 text-electric': user?.role === 'SME'
            }">{{ user?.role }}</span>
        </div>
      </div>

      <nav id="sidebar-nav" class="flex-1 py-3 overflow-y-auto">
        <div id="nav-section-title" class="px-4 pt-2 pb-1 text-[0.6rem] font-semibold uppercase tracking-widest text-sidebar-text-muted" [class.hidden]="collapsed">Navigation</div>
        @for (item of navItems; track item.route) {
          <a
            [id]="item.id"
            class="flex items-center gap-3 py-2.5 px-4 text-sidebar-text no-underline cursor-pointer transition-colors duration-150 relative mx-2 rounded-lg hover:bg-sidebar-hover hover:text-sidebar-active-text [&.active]:bg-sidebar-active [&.active]:text-sidebar-active-text group"
            [ngClass]="collapsed ? 'justify-center p-3' : ''"
            [routerLink]="item.route"
            routerLinkActive="active"
          >
            <!-- Active indicator -->
            <div class="hidden group-[.active]:block absolute left-0 top-1/2 -translate-y-1/2 w-[3px] h-[60%] bg-electric rounded-r-[3px]"></div>

            <span [id]="item.id + '-icon'" class="text-[1.1rem] shrink-0" [innerHTML]="item.icon"></span>
            <span [id]="item.id + '-label'" class="text-[0.82rem] font-medium whitespace-nowrap" [class.hidden]="collapsed">{{ item.label }}</span>
          </a>
        }
      </nav>

      <div id="sidebar-footer" class="mt-auto p-3 border-t border-sidebar-border">
        <button id="logout-btn" class="flex items-center gap-3 w-full py-2.5 px-3 bg-transparent border border-red-500/25 text-red-400 rounded-lg cursor-pointer text-[0.82rem] font-medium transition-colors hover:bg-red-500/10"
                [ngClass]="collapsed ? 'justify-center p-3' : ''"
                (click)="logout()">
          <span id="logout-icon"><span class="material-symbols-outlined text-[1.2em] align-middle">logout</span></span>
          <span id="logout-label" [class.hidden]="collapsed">Logout</span>
        </button>
      </div>
    </aside>
  `
})
export class SidebarComponent {
  @Input() collapsed = false;

  private auth = inject(AuthService);
  private router = inject(Router);

  get user() { return this.auth.getCurrentUser(); }

  get initials() {
    const n = this.user?.name || '';
    return n.split(' ').map(x => x[0]).slice(0, 2).join('').toUpperCase();
  }

  get navItems(): NavItem[] {
    const role = this.user?.role;
    if (role === 'CUSTOMER') return [
      { id: 'nav-cust-dashboard', label: 'Dashboard', icon: '<span class="material-symbols-outlined text-[1.2em] align-middle">home</span>', route: '/customer/dashboard' },
      { id: 'nav-cust-view-bill', label: 'View Bill', icon: '<span class="material-symbols-outlined text-[1.2em] align-middle">description</span>', route: '/customer/view-bill' },
      { id: 'nav-cust-bill-summary', label: 'Bill Summary', icon: '<span class="material-symbols-outlined text-[1.2em] align-middle">bar_chart</span>', route: '/customer/bill-summary' },
      { id: 'nav-cust-pay-bill', label: 'Pay Bill', icon: '<span class="material-symbols-outlined text-[1.2em] align-middle">credit_card</span>', route: '/customer/pay-bill' },
      { id: 'nav-cust-bill-history', label: 'Bill History', icon: '<span class="material-symbols-outlined text-[1.2em] align-middle">folder_special</span>', route: '/customer/bill-history' },
      { id: 'nav-cust-reg-complaint', label: 'Register Complaint', icon: '<span class="material-symbols-outlined text-[1.2em] align-middle">edit</span>', route: '/customer/register-complaint' },
      { id: 'nav-cust-comp-status', label: 'Complaint Status', icon: '<span class="material-symbols-outlined text-[1.2em] align-middle">search</span>', route: '/customer/complaint-status' },
      { id: 'nav-cust-my-complaints', label: 'View Complaints', icon: '<span class="material-symbols-outlined text-[1.2em] align-middle">assignment</span>', route: '/customer/my-complaints' },
    ];
    if (role === 'ADMIN') return [
      { id: 'nav-admin-dashboard', label: 'Dashboard', icon: '<span class="material-symbols-outlined text-[1.2em] align-middle">home</span>', route: '/admin/dashboard' },
      { id: 'nav-admin-add-cust', label: 'Add Customer', icon: '<span class="material-symbols-outlined text-[1.2em] align-middle">person</span>', route: '/admin/add-customer' },
      { id: 'nav-admin-add-cons', label: 'Add Consumer', icon: '<span class="material-symbols-outlined text-[1.2em] align-middle">add</span>', route: '/admin/add-consumer' },
      { id: 'nav-admin-list-cons', label: 'List Consumers', icon: '<span class="material-symbols-outlined text-[1.2em] align-middle">group</span>', route: '/admin/consumers' },
      { id: 'nav-admin-add-bill', label: 'Add Bill', icon: '<span class="material-symbols-outlined text-[1.2em] align-middle">edit</span>', route: '/admin/add-bill' },
      { id: 'nav-admin-view-bills', label: 'View Bills', icon: '<span class="material-symbols-outlined text-[1.2em] align-middle">description</span>', route: '/admin/bills' },
      { id: 'nav-admin-view-comps', label: 'View Complaints', icon: '<span class="material-symbols-outlined text-[1.2em] align-middle">assignment</span>', route: '/admin/complaints' },
    ];
    if (role === 'SME') return [
      { id: 'nav-sme-dashboard', label: 'Dashboard', icon: '<span class="material-symbols-outlined text-[1.2em] align-middle">home</span>', route: '/sme/dashboard' },
      { id: 'nav-sme-complaints', label: 'My Complaints', icon: '<span class="material-symbols-outlined text-[1.2em] align-middle">assignment</span>', route: '/sme/complaints' },
      { id: 'nav-sme-search-comp', label: 'Search Complaint', icon: '<span class="material-symbols-outlined text-[1.2em] align-middle">search</span>', route: '/sme/search-complaint' },
    ];
    return [];
  }

  logout() { this.auth.logout(); }
}



