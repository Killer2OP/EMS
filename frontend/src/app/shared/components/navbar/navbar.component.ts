import { Component, Input, Output, EventEmitter, inject } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { ThemeService } from '../../services/theme.service';

@Component({
  selector: 'app-navbar',
  standalone: true,
  template: `
    <header id="top-navbar" class="h-16 bg-gradient-to-br from-[#003087] to-[#0066CC] dark:from-slate-900 dark:to-slate-800 flex items-center px-6 gap-4 shrink-0 text-white dark:text-slate-200">
      <button id="navbar-toggle-btn" class="bg-white/10 border-none cursor-pointer px-2.5 py-1.5 rounded-md text-inherit text-[1.1rem] transition-colors hover:bg-white/20" (click)="toggleSidebar.emit()">
        <span><span class="material-symbols-outlined text-[1.2em] align-middle">menu</span></span>
      </button>
      <div id="navbar-title-container" class="flex-1">
        <h2 id="navbar-title" class="m-0 text-base font-semibold text-inherit">{{ title }}</h2>
        <p id="navbar-subtitle" class="m-0 text-xs text-white/70">{{ subtitle }}</p>
      </div>
      <div id="navbar-actions" class="flex items-center gap-3">
        <button id="theme-toggle-btn" class="relative bg-white/10 border-none cursor-pointer p-2 rounded-lg text-inherit text-[1.1rem] transition-colors hover:bg-white/20" (click)="themeService.toggle()" title="Toggle theme">
          @if (themeService.isDark()) { <span class="material-symbols-outlined text-[1.2em] align-middle">light_mode</span> } @else { <span class="material-symbols-outlined text-[1.2em] align-middle">dark_mode</span> }
        </button>

        <button id="avatar-btn" class="flex items-center gap-2 bg-white/10 border border-white/20 px-3 py-1.5 rounded-lg cursor-pointer transition-colors hover:bg-white/20">
          <div id="avatar-initials" class="w-7 h-7 rounded-full bg-gradient-to-br from-[#F5C518] to-[#F59E0B] flex items-center justify-center text-[#003087] text-[0.7rem] font-bold">{{ initials }}</div>
          <span id="avatar-name" class="text-[0.78rem] font-semibold text-inherit">{{ firstName }}</span>
        </button>
      </div>
    </header>
  `
})
export class NavbarComponent {
  @Input() title = 'Dashboard';
  @Input() subtitle = '';
  @Output() toggleSidebar = new EventEmitter<void>();

  private auth = inject(AuthService);
  themeService = inject(ThemeService);

  get user() { return this.auth.getCurrentUser(); }
  get firstName() { return (this.user?.name?.split(' ') || [])[0] || 'User'; }
  get initials() {
    const n = this.user?.name || '';
    return n.split(' ').map((x: string) => x[0]).slice(0, 2).join('').toUpperCase();
  }
}
