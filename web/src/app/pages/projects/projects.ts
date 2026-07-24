import { Component, computed, inject, signal } from '@angular/core';
import { GithubService } from '../../core/github.service';
import { Repo } from '../../core/models';
import { CatalogEntry } from '../../data/catalog';
import { LANGUAGE_COLORS } from '../../data/content';
import { FEATURED_PROJECTS } from '../../data/featured';
import { Card } from '../../shared/card';
import { Icon } from '../../shared/icon';

interface Member {
  entry: CatalogEntry;
  data: Repo;
}

interface Project {
  org: string;
  name: string;
  tagline: string;
  url: string;
  langs: string[];
  members: Member[];
}

/**
 * The "Frameworks & SDKs" page. Each configured organization (see `data/featured.ts`) renders as a
 * collapsible block: the project's identity is always visible, and expanding reveals a grid of its
 * member repos, reusing the standard {@link Card}. Members with no live data drop out, and a project
 * with none disappears entirely — so nothing renders empty while loading or after a rename.
 *
 * Blocks are collapsed by default: the page is an index of projects first, and the repos are the
 * detail you opt into.
 */
@Component({
  selector: 'app-projects',
  imports: [Card, Icon],
  template: `
    <div class="section">
      <div class="section-header">
        <div class="section-label">My Projects</div>
        <div class="section-title">Project Suites</div>
        <div class="section-desc">The larger things I've built — each a set of repositories working as one product.</div>
      </div>

      @if (github.loading()) {
        <div class="state-text-muted">Loading projects…</div>
      } @else if (!projects().length) {
        <div class="state-text-muted">No projects to show.</div>
      } @else {
        <div class="projects-showcase">
          @for (p of projects(); track p.url) {
            <div class="project-block" [class.open]="isOpen(p.url)">
              <div class="project-head">
                <button type="button" class="project-toggle" (click)="toggle(p.url)"
                        [attr.aria-expanded]="isOpen(p.url)" [attr.aria-controls]="'proj-' + p.org">
                  <div class="project-name">{{ p.name }}</div>
                  <div class="project-tagline">{{ p.tagline }}</div>
                  @if (p.langs.length) {
                    <div class="project-langs">
                      @for (l of p.langs; track l) {
                        <span class="project-lang">
                          <span class="dot" [style.background]="langColor(l)"></span>{{ l }}
                        </span>
                      }
                    </div>
                  }
                </button>

                <div class="project-head-aside">
                  <span class="project-count">{{ p.members.length }} {{ p.members.length === 1 ? 'repo' : 'repos' }}</span>
                  <a class="project-link" [href]="p.url" target="_blank" rel="noopener noreferrer">
                    <app-icon name="github" [size]="15" /> GitHub
                  </a>
                  <!-- Secondary, mouse-only mirror of the toggle: the identity button is the accessible control. -->
                  <button type="button" class="project-chevron" (click)="toggle(p.url)"
                          tabindex="-1" aria-hidden="true">
                    <app-icon name="chevron" [size]="18" />
                  </button>
                </div>
              </div>

              @if (isOpen(p.url)) {
                <div class="project-body" [id]="'proj-' + p.org">
                  <div class="cards-grid project-members">
                    @for (m of p.members; track m.entry.repo) {
                      <app-card [entry]="m.entry" [data]="m.data" [delay]="$index * 40" />
                    }
                  </div>
                </div>
              }
            </div>
          }
        </div>
      }
    </div>
  `,
})
export class Projects {
  protected readonly github = inject(GithubService);

  /** URLs of the currently expanded blocks. Starts empty — every project is collapsed by default. */
  private readonly open = signal<ReadonlySet<string>>(new Set());

  protected readonly projects = computed<Project[]>(() =>
    FEATURED_PROJECTS.map((p) => {
      const members: Member[] = p.repos
        .map((entry) => ({ entry, data: this.github.orgRepo(p.org, entry.repo) }))
        .filter((m): m is Member => !!m.data);
      // Distinct languages across the members, in first-seen order — the project's tech at a glance.
      const langs = [...new Set(members.map((m) => m.data.language).filter((l): l is string => !!l))];
      return { org: p.org, name: p.name, tagline: p.tagline, url: p.url, langs, members };
    }).filter((p) => p.members.length > 0),
  );

  protected isOpen(url: string): boolean {
    return this.open().has(url);
  }

  protected toggle(url: string): void {
    this.open.update((s) => {
      const next = new Set(s);
      next.has(url) ? next.delete(url) : next.add(url);
      return next;
    });
  }

  protected langColor(lang: string): string {
    return LANGUAGE_COLORS[lang] ?? 'var(--tx3)';
  }
}
