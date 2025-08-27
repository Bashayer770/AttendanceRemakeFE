import { Component } from '@angular/core';

@Component({
  selector: 'app-home-total-minutes-svg',
  standalone: true,
  template: `
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      class="w-10 h-10 text-primary"
    >
      <path
        fill="none"
        stroke="currentColor"
        stroke-linecap="round"
        stroke-linejoin="round"
        stroke-width="2"
        d="m19 7l-1.343 1.343m0 0A8 8 0 1 0 6.343 19.657A8 8 0 0 0 17.657 8.343M12 10v4M9 3h6"
      ></path>
    </svg>
  `,
})
export class HomeTotalMinutesSvgComponent {}
