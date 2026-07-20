import { Component, computed, inject, isDevMode } from '@angular/core';
import { RouterLink } from '@angular/router';
import { GithubService } from '../../core/github.service';
import { ABOUT_PARAGRAPHS, AVATAR_URL, FOCUS_AREAS, HERO_BIO, SOCIAL_LINKS } from '../../data/content';
import { CATALOG } from '../../data/catalog';
import { Icon } from '../../shared/icon';

/** Stats shown before the GitHub snapshot loads. */
const FALLBACK = { repos: 35, stars: 93, followers: 12 };

@Component({
  selector: 'app-about',
  imports: [Icon, RouterLink],
  template: `
    <div class="hero">
      <!--
        Decorative circuit tracery echoing the avatar. Every run terminates in a node; the right
        ends deliberately extend to the viewBox edge so the traces read as continuing off-screen.
        preserveAspectRatio uses meet, not slice, so nothing is cropped at any aspect ratio.
      -->
      <svg class="hero-trace" viewBox="0 0 340 200" preserveAspectRatio="xMaxYMid meet" aria-hidden="true">
        <path d="M340 30 H265 L245 50 H150" />
        <path d="M340 62 H295 L275 82 H205 L190 97 H120" />
        <path d="M340 112 H272 L252 92 H215" />
        <path d="M340 148 H300 L280 128 H232" />
        <path d="M245 50 V78" />
        <path d="M190 97 V126 H160" />
        <circle cx="150" cy="50" r="2.8" />
        <circle class="pulse" cx="120" cy="97" r="2.8" />
        <circle cx="215" cy="92" r="2.3" />
        <circle class="pulse-slow" cx="232" cy="128" r="2.3" />
        <circle cx="245" cy="78" r="2" />
        <circle cx="160" cy="126" r="2" />
      </svg>

      <img class="hero-avatar" [src]="avatarUrl()" alt="Tosox" />
      <div class="hero-text">
        <div class="hero-name">Tosox</div>
        <div class="hero-bio">{{ heroBio }}</div>
        <div class="hero-meta">
          <span class="stat-badge"><span class="stat-num">{{ repos() }}</span> repos</span>
          <span class="stat-badge"><span class="stat-num">{{ stars() }}</span> stars</span>
          <span class="stat-badge"><span class="stat-num">{{ followers() }}</span> followers</span>
        </div>
        <div class="hero-actions">
          @for (s of actions(); track s.label) {
            <a class="btn"
               [class.btn-primary]="s.primary"
               [class.btn-kofi]="s.group === 'support'"
               [class.btn-ghost]="!s.primary && s.group !== 'support'"
               [href]="s.href" [attr.target]="s.href.startsWith('mailto') ? null : '_blank'"
               rel="noopener noreferrer">
              <app-icon [name]="s.icon" /> {{ s.label }}
            </a>
          }
        </div>

        <!-- Publishing platforms: navigational, so muted until hover. -->
        <div class="hero-presence">
          <span class="hero-presence-label">Also on</span>
          @for (s of presence(); track s.label) {
            <a [href]="s.href" target="_blank" rel="noopener noreferrer">
              <app-icon [name]="s.icon" [size]="16" /> {{ s.label }}
            </a>
          }
        </div>
      </div>
    </div>

    <div class="divider"></div>

    <div class="section fadeUp">
      <div class="section-header">
        <div class="section-label">About</div>
        <div class="section-title">Background</div>
      </div>
      <div class="about-grid">
        <div class="about-card">
          @for (p of paragraphs; track $index) {
            <p class="about-intro">{{ p }}</p>
          }
        </div>

        <div class="about-card">
          <div class="about-card-label">Focus areas</div>
          <!--
            Each row links through to the matching tab on /work and carries a live repo count, so
            About is a way into the work rather than a second, drifting description of it.
          -->
          <div class="focus-list">
            @for (f of focusAreas(); track f.label) {
              <a class="focus-item" [routerLink]="['/work']" [queryParams]="f.query">
                <span class="focus-text">
                  <span class="label">{{ f.label }}</span>
                  <span class="sub">{{ f.sub }}</span>
                </span>
                <span class="focus-count">{{ f.count }}</span>
              </a>
            }
          </div>
        </div>
      </div>
    </div>
  `,
})
export class About {
  private readonly github = inject(GithubService);

  protected readonly heroBio = HERO_BIO;
  protected readonly paragraphs = ABOUT_PARAGRAPHS;

  protected readonly actions = computed(() => SOCIAL_LINKS.filter((s) => s.group !== 'presence'));
  protected readonly presence = computed(() => SOCIAL_LINKS.filter((s) => s.group === 'presence'));

  /**
   * Focus areas with a live repo count and a deep link. Areas whose groups have no visible repos
   * drop out entirely, so nothing on this page can point at an empty tab.
   */
  protected readonly focusAreas = computed(() =>
    FOCUS_AREAS.map((f) => {
      const groups = CATALOG.filter((g) => f.groups.includes(g.label));
      const count = groups.reduce(
        (n, g) => n + g.repos.filter((e) => !!this.github.repo(e.repo)).length,
        0,
      );
      // A single group filters the tab; several have no one tab to land on.
      return { ...f, count, query: groups.length === 1 ? { cat: groups[0].label } : {} };
    }).filter((f) => f.count > 0),
  );

  constructor() {
    if (isDevMode()) {
      const labels = new Set(CATALOG.map((g) => g.label));
      const unknown = FOCUS_AREAS.flatMap((f) => f.groups).filter((g) => !labels.has(g));
      if (unknown.length) {
        console.warn('[about] FOCUS_AREAS reference unknown catalog groups:', unknown);
      }
    }
  }

  protected readonly avatarUrl = computed(() => this.github.profile()?.avatarUrl ?? AVATAR_URL);
  protected readonly repos = computed(() => this.github.profile()?.publicRepos ?? FALLBACK.repos);
  protected readonly followers = computed(() => this.github.profile()?.followers ?? FALLBACK.followers);
  protected readonly stars = computed(() => this.github.totalStars() || FALLBACK.stars);
}
