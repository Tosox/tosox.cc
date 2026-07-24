import { ApplicationConfig, provideBrowserGlobalErrorListeners, provideZoneChangeDetection } from '@angular/core';
import { provideHttpClient } from '@angular/common/http';
import { provideRouter } from '@angular/router';

import { routes } from './app.routes';

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideZoneChangeDetection({ eventCoalescing: true }),
    // Scroll restoration is handled in App: the page scrolls inside a container, not the window, so
    // the router's built-in withInMemoryScrolling (which targets the window) can't reach it.
    provideRouter(routes),
    provideHttpClient()
  ]
};
