import { Component, inject } from '@angular/core';
import { GithubService } from '../../core/github.service';

const VIEW_ALL_URL =
  'https://github.com/pulls/search?q=is%3Apr+author%3ATosox+-user%3ATosox+-user%3ACoHModSDK+-user%3Arpc4games';

@Component({
  selector: 'app-contributions',
  template: `
    <div class="section">
      <div class="section-header">
        <div class="section-label">Contributions</div>
        <div class="section-title">Pull Requests to External Projects</div>
        <div class="section-desc">Open-source contributions across the community — sorted by most recent.</div>
      </div>

      @if (github.loading()) {
        <div class="loader"><div class="spinner"></div></div>
      } @else if (contributions().length === 0) {
        <div class="empty">
          No contributions found or rate-limited.
          <a [href]="viewAllUrl" target="_blank" rel="noopener noreferrer">View on GitHub →</a>
        </div>
      } @else {
        <div class="contrib-list">
          @for (pr of contributions(); track pr.url) {
            <a class="contrib-item" [href]="pr.url" target="_blank" rel="noopener noreferrer"
               [style.animationDelay.ms]="$index * 40">
              <div [class]="'contrib-state state-' + pr.state"></div>
              <div class="contrib-main">
                <div class="contrib-title">{{ pr.title }}</div>
                <div class="contrib-sub">{{ pr.repo }} #{{ pr.number }}</div>
              </div>
              <div class="contrib-meta">
                <div [class]="'state-text-' + pr.state">{{ pr.state }}</div>
                <div style="margin-top: 2px">{{ formatDate(pr.updatedAt) }}</div>
              </div>
            </a>
          }
        </div>
        <div style="margin-top: 20px; text-align: center">
          <a class="btn btn-ghost" [href]="viewAllUrl" target="_blank" rel="noopener noreferrer">
            View all on GitHub →
          </a>
        </div>
      }
    </div>
  `,
})
export class Contributions {
  protected readonly github = inject(GithubService);
  protected readonly contributions = this.github.contributions;
  protected readonly viewAllUrl = VIEW_ALL_URL;

  protected formatDate(iso: string): string {
    return new Date(iso).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  }
}
