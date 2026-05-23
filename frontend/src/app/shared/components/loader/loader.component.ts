import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-loader',
  standalone: true,
  template: `
    @if (show) {
      <div class="fixed inset-0 bg-black/30 backdrop-blur-sm flex items-center justify-center z-[9999]">
        <div class="text-center">
          <div class="w-16 h-16 flex items-center justify-center mx-auto mb-4 text-[2.5rem] animate-[boltSpin_1.2s_linear_infinite] drop-shadow-[0_0_12px_rgba(245,197,24,0.5)]">⚡</div>
          <p class="text-white text-[0.9rem] font-medium m-0">{{ message }}</p>
        </div>
      </div>
    }
  `
})
export class LoaderComponent {
  @Input() show = false;
  @Input() message = 'Loading...';
}
