import { Component, computed, inject, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { ActivatedRoute, Router } from '@angular/router';
import { GithubService } from '../../core/github.service';
import { CATALOG, CatalogEntry } from '../../data/catalog';
import { Card } from '../../shared/card';

interface Block {
  label: string;
  entries: CatalogEntry[];
}

const ALL = 'All';

@Component({
  selector: 'app-work',
  imports: [Card],
  template: `
    <div class="section">
      <div class="section-header">
        <div class="section-label">My Work</div>
        <div class="section-title">Projects &amp; Mods</div>
        <div class="section-desc">Everything I've built — game mods, tools and open-source projects.</div>
      </div>

      <div class="cat-tabs">
        @for (t of tabs(); track t.label) {
          <button class="cat-tab" [class.active]="activeCat() === t.label" (click)="select(t.label)"
                  [attr.aria-pressed]="activeCat() === t.label">
            {{ t.label }} ({{ t.count }})
          </button>
        }
      </div>

      @if (github.loading()) {
        <div class="state-text-muted">Loading projects…</div>
      } @else {
        @for (b of blocks(); track b.label) {
          @if (showHeaders()) {
            <div class="section-label" style="margin: 32px 0 14px">{{ b.label }}</div>
          }
          <!--
            anim-alt flips on every tab change. A CSS animation only runs when an element is
            created, and switching between "All" and a category reuses the nodes that category
            already had — so the fade-in would silently skip. Toggling the class swaps
            animation-name between two identical keyframes, which restarts the animation whether
            the node is new or reused.
          -->
          <div class="cards-grid" [class.anim-alt]="animAlt()">
            @for (e of b.entries; track e.repo) {
              <app-card [entry]="e" [delay]="$index * 50" />
            }
          </div>
        }
      }
    </div>
  `,
})
export class Work {
  protected readonly github = inject(GithubService);
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);

  private readonly cat = signal(ALL);

  /** Flipped on every tab change; see the anim-alt comment in the template. */
  protected readonly animAlt = signal(false);

  constructor() {
    // The URL is the single source of truth: tabs navigate, and this drives the state. That makes a
    // filtered view shareable and lets About deep-link straight into a category.
    this.route.queryParamMap.pipe(takeUntilDestroyed()).subscribe((params) => {
      const next = params.get('cat') ?? ALL;
      if (next === this.cat()) return;
      this.cat.set(next);
      this.animAlt.update((v) => !v);
    });
  }

  protected select(label: string): void {
    if (label === this.activeCat()) return;
    this.router.navigate([], {
      relativeTo: this.route,
      queryParams: { cat: label === ALL ? null : label },
      replaceUrl: true, // flicking through tabs shouldn't fill the back stack
    });
  }

  /** Falls back to "All" for a `cat` that matches no group, so a stale link never renders empty. */
  protected readonly activeCat = computed(() => {
    const cat = this.cat();
    return this.resolved().some((g) => g.label === cat) ? cat : ALL;
  });

  /**
   * Catalog groups with entries that have no live data removed, so a renamed or deleted repo leaves
   * no empty card. Groups that end up empty disappear entirely.
   */
  private readonly resolved = computed<Block[]>(() =>
    CATALOG.map((g) => ({
      label: g.label,
      entries: g.repos.filter((e) => !!this.github.repo(e.repo)),
    })).filter((b) => b.entries.length > 0),
  );

  protected readonly tabs = computed(() => {
    const groups = this.resolved();
    const total = groups.reduce((n, g) => n + g.entries.length, 0);
    return [{ label: ALL, count: total }, ...groups.map((g) => ({ label: g.label, count: g.entries.length }))];
  });

  protected readonly blocks = computed<Block[]>(() => {
    const cat = this.activeCat();
    const groups = this.resolved();
    return cat === ALL ? groups : groups.filter((g) => g.label === cat);
  });

  /** In "All" the group headers organise the page; in a filtered view the tab already says it. */
  protected readonly showHeaders = computed(() => this.activeCat() === ALL);
}
