import { Component, ElementRef, inject, viewChild } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { NavigationEnd, Router, RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { filter } from 'rxjs';
import { NAV_TABS } from './data/content';
import { Footer } from './shared/footer';

/**
 * App shell: fixed nav, a scroll container for the routed content, footer.
 *
 * The profile hero lives in the About page rather than here — keeping it above the router outlet
 * meant every other route pushed its own content below the fold.
 *
 * The page scrolls inside `.scroll-area` (which starts below the nav) rather than on the window, so
 * the scrollbar runs beneath the nav instead of cutting across it. Because that scroll lives on a
 * container the router's own scroll restoration can't reach, navigation resets it here instead.
 */
@Component({
  selector: 'app-root',
  imports: [RouterOutlet, RouterLink, RouterLinkActive, Footer],
  template: `
    <nav>
      <a class="nav-logo" routerLink="/about">tosox<span>.cc</span></a>
      <div class="nav-tabs">
        @for (t of tabs; track t.path) {
          <a class="nav-tab" [routerLink]="t.path" routerLinkActive="active">{{ t.label }}</a>
        }
      </div>
    </nav>

    <div class="scroll-area" #scroll>
      <div class="content">
        <router-outlet />

        <div class="divider" style="margin-top: 40px"></div>
        <app-footer />
      </div>
    </div>
  `,
})
export class App {
  protected readonly tabs = NAV_TABS;

  private readonly scroll = viewChild<ElementRef<HTMLElement>>('scroll');

  constructor() {
    // Switching tabs from halfway down a long page should land at the top of the next one.
    inject(Router)
      .events.pipe(
        filter((e) => e instanceof NavigationEnd),
        takeUntilDestroyed(),
      )
      .subscribe(() => this.scroll()?.nativeElement.scrollTo({ top: 0 }));
  }
}
