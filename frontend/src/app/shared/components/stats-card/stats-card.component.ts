import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-stats-card',
  standalone: true,
  template: `
    <div class="bg-card rounded-2xl p-5 flex items-start gap-4 shadow-sm border border-border transition-all duration-200 cursor-default hover:-translate-y-0.5 hover:shadow-lg" [style.border-left]="'4px solid ' + borderColor">
      <div class="w-12 h-12 rounded-xl flex items-center justify-center text-xl shrink-0" [style.background]="iconBg">{{ icon }}</div>
      <div class="flex-1">
        <div class="text-[0.72rem] font-medium text-text-secondary uppercase tracking-[0.05em] mb-1">{{ label }}</div>
        <div class="text-2xl font-bold text-text-primary leading-none">{{ value }}</div>
        @if (trendText) {
          <div class="text-[0.72rem] mt-1" [class.text-green-500]="trend === 'up'" [class.text-red-500]="trend === 'down'">
            {{ trend === 'up' ? '▲' : '▼' }} {{ trendText }}
          </div>
        }
      </div>
    </div>
  `
})
export class StatsCardComponent {
  @Input() icon = '📊';
  @Input() label = 'Label';
  @Input() value = '0';
  @Input() iconBg = '#E8F4FD';
  @Input() borderColor = '#003087';
  @Input() trend: 'up' | 'down' | '' = '';
  @Input() trendText = '';
}



