import { HttpClient } from '@angular/common/http';
import { Injectable, computed, inject, isDevMode, signal } from '@angular/core';
import { CATALOG } from '../data/catalog';
import { FEATURED_PROJECTS } from '../data/featured';
import { Contribution, Repo, Snapshot } from './models';

@Injectable({ providedIn: 'root' })
export class GithubService {
  private readonly http = inject(HttpClient);

  readonly snapshot = signal<Snapshot | null>(null);
  readonly loading = signal(true);
  readonly failed = signal(false);

  readonly profile = computed(() => this.snapshot()?.profile ?? null);
  readonly contributions = computed<Contribution[]>(() => this.snapshot()?.contributions ?? []);

  readonly totalStars = computed(() => {
    const repos = this.snapshot()?.repos;
    if (!repos) return 0;
    return Object.values(repos).reduce((sum, r) => sum + r.stars, 0);
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
        // A renamed, deleted or privated repo would otherwise just vanish from the site
        if (isDevMode()) {
          const missing = [
            ...CATALOG.flatMap((g) => g.repos.map((r) => r.repo)).filter((name) => !snap.repos[name]),
            ...FEATURED_PROJECTS.flatMap((p) =>
              p.repos.filter((r) => !snap.orgs[p.org]?.[r.repo]).map((r) => `${p.org}/${r.repo}`),
            ),
          ];
          if (missing.length) console.warn('Curated repos not found on GitHub:', missing);
        }
      },
      error: () => {
        this.failed.set(true);
        this.loading.set(false);
      },
    });
  }

  repo(name: string): Repo | undefined {
    return this.snapshot()?.repos?.[name];
  }

  orgRepo(org: string, name: string): Repo | undefined {
    return this.snapshot()?.orgs?.[org]?.[name];
  }
}
