import { Component, computed, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { GithubService } from '../core/github.service';
import { NAV_TABS, SITE_REPO_URL, SOCIAL_LINKS } from '../data/content';

/**
 * Site footer: brand block on the left, grouped link columns, and a quiet bottom row.
 *
 * The "Site" column repeats the nav tabs on purpose: on narrow screens the nav tabs are hidden,
 * which otherwise leaves the footer as the only way to reach the other pages.
 */
@Component({
  selector: 'app-footer',
  imports: [RouterLink],
  template: `
    <footer class="site-footer">
      <div class="footer-main">
        <div class="footer-brand">
          <a class="nav-logo" routerLink="/about">tosox<span>.cc</span></a>
          <p class="footer-tagline">Game mods, dev tools and open source.</p>
          <p class="footer-note">
            This site is open source.
            <a [href]="repoUrl" target="_blank" rel="noopener noreferrer">View the code →</a>
          </p>
        </div>

        <div class="footer-col">
          <div class="footer-col-title">Site</div>
          @for (t of tabs; track t.path) {
            <a [routerLink]="t.path">{{ t.label }}</a>
          }
        </div>

        <div class="footer-col">
          <div class="footer-col-title">Elsewhere</div>
          @for (l of elsewhere; track l.href) {
            <a [href]="l.href" target="_blank" rel="noopener noreferrer">{{ l.label }}</a>
          }
        </div>

        <div class="footer-col">
          <div class="footer-col-title">Legal</div>
          <a routerLink="/privacy">Privacy Policy</a>
        </div>
      </div>

      <div class="footer-bottom">
        <span>© {{ year }} Tosox</span>
        @if (syncedAgo(); as ago) {
          <span>GitHub data synced {{ ago }}</span>
        }
      </div>
    </footer>
  `,
})
export class Footer {
  private readonly github = inject(GithubService);

  protected readonly year = new Date().getFullYear();
  protected readonly tabs = NAV_TABS;
  protected readonly repoUrl = SITE_REPO_URL;

  protected readonly elsewhere = SOCIAL_LINKS.filter(
    (l) => l.icon === 'github' || l.group === 'presence',
  );

  /** "just now" / "12 min ago" / "3 h ago", relative to when the page loaded the snapshot. */
  protected readonly syncedAgo = computed(() => {
    const generatedAt = this.github.snapshot()?.generatedAt;
    if (!generatedAt) return null;
    const minutes = Math.max(0, Math.round((Date.now() - Date.parse(generatedAt)) / 60_000));
    if (minutes < 1) return 'just now';
    if (minutes < 60) return `${minutes} min ago`;
    return `${Math.round(minutes / 60)} h ago`;
  });
}
