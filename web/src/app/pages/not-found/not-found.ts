import { Component, DestroyRef, inject } from '@angular/core';
import { Meta } from '@angular/platform-browser';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-not-found',
  imports: [RouterLink],
  template: `
    <div class="section notfound">
      <div class="notfound-code">404</div>
      <div class="section-header">
        <div class="section-title">Page not found</div>
        <div class="section-desc">
          That URL does not match anything here. It may have been renamed, or mistyped.
        </div>
      </div>
      <div class="notfound-actions">
        <a class="btn btn-primary" routerLink="/">Back to start</a>
        <a class="btn btn-ghost" routerLink="/work">Browse my work</a>
      </div>
    </div>
  `,
})
export class NotFound {
  private readonly meta = inject(Meta);

  constructor() {
    // The SPA fallback serves this with a 200, so noindex keeps mistyped URLs out of search results
    this.meta.addTag({ name: 'robots', content: 'noindex' });
    inject(DestroyRef).onDestroy(() => this.meta.removeTag("name='robots'"));
  }
}
