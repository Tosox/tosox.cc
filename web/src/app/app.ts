import { Component, ElementRef, inject, viewChild } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { NavigationEnd, Router, RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { filter } from 'rxjs';
import { NAV_TABS } from './data/content';
import { Footer } from './shared/footer';

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
    // .scroll-area scrolls, not the window, so the router's scroll restoration can't reset it
    inject(Router)
      .events.pipe(
        filter((e) => e instanceof NavigationEnd),
        takeUntilDestroyed(),
      )
      .subscribe(() => this.scroll()?.nativeElement.scrollTo({ top: 0 }));
  }
}
