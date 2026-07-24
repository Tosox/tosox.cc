import { Component, computed, inject, input } from '@angular/core';
import { GithubService } from '../core/github.service';
import { LANGUAGE_COLORS } from '../data/content';
import { CatalogEntry } from '../data/catalog';
import { Repo } from '../core/models';
import { Icon } from './icon';

/**
 * Repository card. The title comes from the catalog; everything else is live GitHub data.
 *
 * Live data is looked up from the user's repos by name, unless `data` is supplied — org repos
 * (the featured showcase) live in a separate map, so those callers pass the resolved `Repo` in.
 *
 * Star/fork counts are hidden when both are zero — most repos have none, and twenty "0 0" rows
 * would bury the two repos that actually have traction.
 */
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
            <!-- Shown as a pair whenever either is non-zero; hidden entirely when both are 0. -->
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
  /** Pre-resolved live data. When set, it's used instead of the by-name lookup (see class doc). */
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
