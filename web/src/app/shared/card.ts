import { Component, computed, inject, input } from '@angular/core';
import { GithubService } from '../core/github.service';
import { LANGUAGE_COLORS } from '../data/content';
import { CatalogEntry } from '../data/catalog';
import { Repo } from '../core/models';
import { Icon } from './icon';

@Component({
  selector: 'app-card',
  imports: [Icon],
  template: `
    @if (repo(); as r) {
      <a class="mod-card" [href]="r.url" target="_blank" rel="noopener noreferrer"
         [style.animationDelay.ms]="delay()">
        <div class="mod-card-name">
          <app-icon name="github" />
          {{ entry().title }}
        </div>

        @if (r.description) {
          <div class="mod-card-desc">{{ r.description }}</div>
        }

        <div class="card-meta">
          @if (r.language) {
            <span class="meta-lang">
              <span class="dot" [style.background]="langColor()"></span>{{ r.language }}
            </span>
          }
          @if (r.archived) {
            <span class="meta-archived">Archived</span>
          }
          @if (hasStats()) {
            <span class="meta-stats">
              <span class="meta-stat stars"><app-icon name="star" [size]="13" /><b>{{ r.stars }}</b></span>
              <span class="meta-stat"><app-icon name="fork" [size]="13" /><b>{{ r.forks }}</b></span>
            </span>
          }
        </div>
      </a>
    }
  `,
})
export class Card {
  private readonly github = inject(GithubService);

  readonly entry = input.required<CatalogEntry>();
  readonly delay = input(0);
  /** Org repos aren't in the user's repo map, so their callers pass the data in. */
  readonly data = input<Repo | undefined>(undefined);

  readonly repo = computed(() => this.data() ?? this.github.repo(this.entry().repo));
  readonly hasStats = computed(() => {
    const r = this.repo();
    return !!r && (r.stars > 0 || r.forks > 0);
  });
  readonly langColor = computed(() => {
    const lang = this.repo()?.language;
    return (lang && LANGUAGE_COLORS[lang]) || 'var(--tx3)';
  });
}
