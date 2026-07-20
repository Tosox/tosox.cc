import { HttpClient } from '@angular/common/http';
import { Injectable, computed, inject, isDevMode, signal } from '@angular/core';
import { CATALOG_REPOS } from '../data/catalog';
import { Contribution, Repo, Snapshot } from './models';

/**
 * Loads the cached GitHub snapshot from the backend (GET /api/github) once and exposes it as signals.
 * Components read live repository data via {@link repo}, keyed on the names in `data/catalog.ts`.
 */
@Injectable({ providedIn: 'root' })
export class GithubService {
  private readonly http = inject(HttpClient);

  readonly snapshot = signal<Snapshot | null>(null);
  readonly loading = signal(true);
  readonly failed = signal(false);

  readonly profile = computed(() => this.snapshot()?.profile ?? null);
  readonly contributions = computed<Contribution[]>(() => this.snapshot()?.contributions ?? []);

  /** Total stars across all of the user's public repositories. */
  readonly totalStars = computed(() => {
    const repos = this.snapshot()?.repos;
    if (!repos) return 0;
    return Object.values(repos).reduce((sum, r) => sum + r.stars, 0);
  });

  /**
   * Curated repo names with no match in the live data — normally caused by a rename, a delete, or a
   * repo being made private. Without this a renamed repo would silently vanish from the site.
   */
  readonly missingRepos = computed<string[]>(() => {
    const repos = this.snapshot()?.repos;
    if (!repos) return [];
    return CATALOG_REPOS.filter((name) => !(name in repos));
  });

  constructor() {
    this.load();
  }

  load(): void {
    this.loading.set(true);
    this.failed.set(false);
    this.http.get<Snapshot>('/api/github').subscribe({
      next: (snap) => {
        this.snapshot.set(snap);
        this.loading.set(false);
        const missing = this.missingRepos();
        if (isDevMode() && missing.length) {
          console.warn(
            `[catalog] ${missing.length} curated repo(s) not found on GitHub — renamed, deleted or ` +
              `made private? Update web/src/app/data/catalog.ts:\n  ${missing.join('\n  ')}`,
          );
        }
      },
      error: () => {
        this.failed.set(true);
        this.loading.set(false);
      },
    });
  }

  /** Live data for a repository by name (e.g. "Autocomplete-Tasks"), or undefined if not loaded. */
  repo(name: string): Repo | undefined {
    return this.snapshot()?.repos?.[name];
  }
}
