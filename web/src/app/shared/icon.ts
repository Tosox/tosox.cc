import { Component, input } from '@angular/core';

export type IconName =
  | 'github'
  | 'star'
  | 'fork'
  | 'youtube'
  | 'moddb'
  | 'wgmods'
  | 'forge'
  | 'kofi'
  | 'email'
  | 'chevron';

@Component({
  selector: 'app-icon',
  template: `
    @switch (name()) {
      @case ('github') {
        <svg viewBox="0 0 24 24" fill="currentColor" [attr.width]="size()" [attr.height]="size()">
          <path d="M12 2C6.477 2 2 6.477 2 12c0 4.418 2.865 8.166 6.839 9.489.5.092.682-.217.682-.482 0-.237-.009-.868-.013-1.703-2.782.604-3.369-1.34-3.369-1.34-.454-1.155-1.11-1.463-1.11-1.463-.908-.62.069-.608.069-.608 1.003.07 1.531 1.03 1.531 1.03.892 1.529 2.341 1.087 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.11-4.555-4.943 0-1.091.39-1.984 1.029-2.683-.103-.253-.446-1.27.098-2.647 0 0 .84-.269 2.75 1.025A9.578 9.578 0 0112 6.836c.85.004 1.705.114 2.504.336 1.909-1.294 2.747-1.025 2.747-1.025.546 1.377.203 2.394.1 2.647.64.699 1.028 1.592 1.028 2.683 0 3.842-2.339 4.687-4.566 4.935.359.309.678.919.678 1.852 0 1.336-.012 2.415-.012 2.743 0 .267.18.578.688.48C19.138 20.163 22 16.418 22 12c0-5.523-4.477-10-10-10z"/>
        </svg>
      }
      @case ('star') {
        <svg viewBox="0 0 24 24" fill="currentColor" [attr.width]="size()" [attr.height]="size()">
          <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
        </svg>
      }
      @case ('fork') {
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9"
             stroke-linecap="round" stroke-linejoin="round"
             [attr.width]="size()" [attr.height]="size()">
          <circle cx="6" cy="5" r="2.4" fill="currentColor" stroke="none"/>
          <circle cx="18" cy="5" r="2.4" fill="currentColor" stroke="none"/>
          <circle cx="12" cy="19" r="2.4" fill="currentColor" stroke="none"/>
          <path d="M6 7.4v1.6a3 3 0 0 0 3 3h6a3 3 0 0 0 3-3V7.4"/>
          <path d="M12 12v4.6"/>
        </svg>
      }
      @case ('youtube') {
        <svg viewBox="0 0 24 24" fill="currentColor" [attr.width]="size()" [attr.height]="size()">
          <path d="M23.5 6.2a3 3 0 00-2.1-2.1C19.5 3.5 12 3.5 12 3.5s-7.5 0-9.4.6A3 3 0 00.5 6.2C0 8.1 0 12 0 12s0 3.9.6 5.8a3 3 0 002.1 2.1c1.9.6 9.4.6 9.4.6s7.5 0 9.4-.6a3 3 0 002.1-2.1C24 15.9 24 12 24 12s0-3.9-.5-5.8zM9.7 15.5V8.5l6.3 3.5-6.3 3.5z"/>
        </svg>
      }
      @case ('moddb') {
        <svg viewBox="0 0 24 24" fill="currentColor" [attr.width]="size()" [attr.height]="size()">
          <path d="M10.5 3.37L10.5 9L13.5 9L13.5 3.37A5.25 5.25 0 0 1 14.05 13.23L14.05 20.9A1.2 1.2 0 0 1 12.85 22.1L11.15 22.1A1.2 1.2 0 0 1 9.95 20.9L9.95 13.23A5.25 5.25 0 0 1 10.5 3.37Z"/>
        </svg>
      }
      @case ('wgmods') {
        <svg viewBox="0 0 24 24" fill="currentColor" fill-rule="evenodd" [attr.width]="size()" [attr.height]="size()">
          <path d="M9.47 2.55L10.12 0.15L13.88 0.15L14.53 2.55A9.78 9.78 0 0 1 16.89 3.53L19.05 2.29L21.71 4.95L20.47 7.11A9.78 9.78 0 0 1 21.45 9.47L23.85 10.12L23.85 13.88L21.45 14.53A9.78 9.78 0 0 1 20.47 16.89L21.71 19.05L19.05 21.71L16.89 20.47A9.78 9.78 0 0 1 14.53 21.45L13.88 23.85L10.12 23.85L9.47 21.45A9.78 9.78 0 0 1 7.11 20.47L4.95 21.71L2.29 19.05L3.53 16.89A9.78 9.78 0 0 1 2.55 14.53L0.15 13.88L0.15 10.12L2.55 9.47A9.78 9.78 0 0 1 3.53 7.11L2.29 4.95L4.95 2.29L7.11 3.53A9.78 9.78 0 0 1 9.47 2.55Z M9.3 4.55L14.7 4.55L18 7.8L13.56 7.8L13.56 20.65L12 22.15L10.44 20.65L10.44 7.8L6 7.8Z M6 8.6L8.96 8.6L8.96 14.64L10.37 16.05L8.22 18.06L6 16Z M18 8.6L15.04 8.6L15.04 14.64L13.63 16.05L15.78 18.06L18 16Z"/>
        </svg>
      }
      @case ('forge') {
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" [attr.width]="size()" [attr.height]="size()">
          <path d="m21 7.5-2.25-1.313M21 7.5v2.25m0-2.25-2.25 1.313M3 7.5l2.25-1.313M3 7.5l2.25 1.313M3 7.5v2.25m9 3 2.25-1.313M12 12.75l-2.25-1.313M12 12.75V15m0 6.75 2.25-1.313M12 21.75V19.5m0 2.25-2.25-1.313m0-16.875L12 2.25l2.25 1.313M21 14.25v2.25l-2.25 1.313m-13.5 0L3 16.5v-2.25"/>
        </svg>
      }
      @case ('kofi') {
        <svg viewBox="0 0 24 24" fill="currentColor" [attr.width]="size()" [attr.height]="size()">
          <path d="M23.881 8.948c-.773-4.085-4.859-4.593-4.859-4.593H.723c-.604 0-.679.798-.679.798s-.082 7.324-.022 11.822c.164 2.424 2.586 2.672 2.586 2.672s8.267-.023 11.966-.049c2.438-.426 2.683-2.566 2.658-3.734 4.352.24 7.422-2.831 6.649-6.916zm-11.062 3.511c-1.246 1.453-4.011 3.976-4.011 3.976s-.121.119-.31.023c-.076-.057-.108-.09-.108-.09-.443-.441-3.368-3.049-4.034-3.954-.709-.965-1.041-2.7-.091-3.71.951-1.01 3.005-1.086 4.363.407 0 0 1.565-1.782 3.468-.963 1.904.82 1.832 2.868.723 4.311zm6.173.478c-.928.116-1.682.028-1.682.028V7.284h1.77s1.971.551 1.971 2.638c0 1.913-.985 2.667-2.059 3.015z"/>
        </svg>
      }
      @case ('email') {
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" [attr.width]="size()" [attr.height]="size()">
          <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/>
          <polyline points="22,6 12,13 2,6"/>
        </svg>
      }
      @case ('chevron') {
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"
             stroke-linecap="round" stroke-linejoin="round" [attr.width]="size()" [attr.height]="size()">
          <polyline points="6 9 12 15 18 9" />
        </svg>
      }
    }
  `,
  styles: `:host { display: inline-flex; align-items: center; }`,
})
export class Icon {
  readonly name = input.required<IconName>();
  readonly size = input(14);
}
