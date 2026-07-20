import { Component, computed, inject } from '@angular/core';
import { GithubService } from '../../core/github.service';
import { LANGUAGE_COLORS, SKILL_TIERS } from '../../data/content';

interface LangStat {
  lang: string;
  count: number;
  pct: number;
  flex: number;
  color: string;
}

@Component({
  selector: 'app-skills',
  template: `
    <div class="section">
      <div class="section-header">
        <div class="section-label">Skills</div>
        <div class="section-title">Tech Stack</div>
        <div class="section-desc">Languages, frameworks, tools and platforms.</div>
      </div>

      <!--
        Split by proficiency, not by category: the first tier carries visual weight, the second is
        deliberately quieter. Categorising instead (Languages / Web / Tools / …) gave every pill the
        same weight, which told a reader nothing.
      -->
      <div class="skill-tiers">
        @for (t of tiers; track t.tier; let i = $index) {
          <div class="skill-tier" [class.core]="i === 0" [style.animationDelay.ms]="i * 60">
            <div class="skill-tier-head">
              <span class="skill-tier-name">{{ t.tier }}</span>
              <span class="skill-tier-note">{{ t.note }}</span>
            </div>
            <div class="skill-row">
              <div class="skill-row-label">Languages</div>
              <div class="skill-pills">
                @for (p of t.languages; track p) {
                  <span class="skill-pill">{{ p }}</span>
                }
              </div>
            </div>
            <div class="skill-row">
              <div class="skill-row-label">Tools &amp; platforms</div>
              <div class="skill-pills">
                @for (p of t.tools; track p) {
                  <span class="skill-pill">{{ p }}</span>
                }
              </div>
            </div>
          </div>
        }
      </div>

      @if (langStats().length) {
        <div class="lang-block">
          <div class="section-label">Repository languages</div>
          <!-- &#8209; is a non-breaking hyphen: a plain one lets "self-" and "reported." split. -->
          <p class="lang-note">
            Share of my public repositories by primary language — measured, not self&#8209;reported.
          </p>
          <div class="lang-bar">
            @for (l of langStats(); track l.lang) {
              <div [style.flex]="l.flex" [style.background]="l.color" [title]="l.lang + ': ' + l.pct + '%'"></div>
            }
          </div>
          <div class="lang-legend">
            @for (l of langStats(); track l.lang) {
              <span class="lang-legend-item">
                <span class="dot" [style.background]="l.color"></span>
                {{ l.lang }} <span class="pct">{{ l.pct }}%</span>
              </span>
            }
          </div>
        </div>
      }
    </div>
  `,
})
export class Skills {
  private readonly github = inject(GithubService);
  protected readonly tiers = SKILL_TIERS;

  protected readonly langStats = computed<LangStat[]>(() => {
    const repos = this.github.snapshot()?.repos;
    const counts: Record<string, number> = {};
    if (repos) {
      for (const r of Object.values(repos)) {
        if (r.language) counts[r.language] = (counts[r.language] ?? 0) + 1;
      }
    }
    const sorted = Object.entries(counts).sort((a, b) => b[1] - a[1]);
    const total = sorted.reduce((s, [, c]) => s + c, 0);
    return sorted.map(([lang, count]) => ({
      lang,
      count,
      pct: total ? Math.round((count / total) * 100) : 0,
      flex: total ? count / total : 0,
      color: LANGUAGE_COLORS[lang] ?? '#555',
    }));
  });
}
