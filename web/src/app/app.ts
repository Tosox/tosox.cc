import { Component } from '@angular/core';
import { RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';

/**
 * App shell: fixed nav, routed content, footer.
 *
 * The profile hero lives in the About page rather than here — keeping it above the router outlet
 * meant every other route pushed its own content below the fold.
 */
@Component({
  selector: 'app-root',
  imports: [RouterOutlet, RouterLink, RouterLinkActive],
  template: `
    <nav>
      <a class="nav-logo" routerLink="/about">tosox<span>.cc</span></a>
      <div class="nav-tabs">
        @for (t of tabs; track t.path) {
          <a class="nav-tab" [routerLink]="t.path" routerLinkActive="active">{{ t.label }}</a>
        }
      </div>
    </nav>

    <div class="content">
      <router-outlet />

      <div class="divider" style="margin-top: 40px"></div>
      <footer><span>tosox.cc — {{ year }}</span></footer>
    </div>
  `,
})
export class App {
  protected readonly year = new Date().getFullYear();

  protected readonly tabs = [
    { path: 'about', label: 'About' },
    { path: 'work', label: 'My Work' },
    { path: 'contributions', label: 'Contributions' },
    { path: 'skills', label: 'Skills' },
  ];
}
