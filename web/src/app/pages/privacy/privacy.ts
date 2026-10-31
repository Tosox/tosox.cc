import { Component } from '@angular/core';
import { PRIVACY_CONTACT, PRIVACY_LAST_UPDATED } from '../../data/content';

/**
 * Privacy policy (GDPR Art. 13). Keep it in sync with the infrastructure: if analytics, cookies,
 * third-party embeds or server logs are ever added, this page has to say so.
 */
@Component({
  selector: 'app-privacy',
  template: `
    <div class="section">
      <div class="section-header">
        <div class="section-label">Legal</div>
        <h1 class="section-title">Privacy Policy</h1>
        <div class="section-desc">
          Short version: this site doesn't track you, sets no cookies and keeps no visitor logs.
        </div>
      </div>

      <div class="legal">
        <section class="about-card">
          <h2>Who is responsible</h2>
          <p>
            Responsible for data processing on this website (controller under Art. 4(7) GDPR):
            <br />
            <strong>{{ contact.name }}</strong>, email:
            <a [href]="'mailto:' + contact.email">{{ contact.email }}</a>
          </p>
        </section>

        <section class="about-card">
          <h2>What this site does not do</h2>
          <ul>
            <li>No cookies, no local storage, no analytics, no tracking, no advertising.</li>
            <li>No visitor logs: the web server is configured not to record access logs.</li>
            <li>
              No third-party content: fonts and images are served from this domain, so your browser
              does not contact Google, GitHub or anyone else while you browse here.
            </li>
          </ul>
        </section>

        <section class="about-card">
          <h2>Cloudflare</h2>
          <p>
            This site is delivered through Cloudflare, Inc., 101 Townsend St, San Francisco, CA 94107,
            USA, which protects it against attacks and speeds up delivery. To do this, Cloudflare
            necessarily processes the data your browser sends with every request, in particular your
            IP address, the requested page, the time of the request and your browser's user agent.
            Cloudflare may set strictly necessary security cookies if it detects suspicious traffic.
          </p>
          <p>
            Legal basis is Art. 6(1)(f) GDPR: a legitimate interest in delivering this site securely
            and reliably. Cloudflare is certified under the EU-U.S. Data Privacy Framework, which
            covers the transfer of data to the USA. Details:
            <a href="https://www.cloudflare.com/privacypolicy/" target="_blank" rel="noopener noreferrer"
              >cloudflare.com/privacypolicy</a
            >.
          </p>
        </section>

        <section class="about-card">
          <h2>GitHub data</h2>
          <p>
            The repository and profile information shown here is public data that this site's own
            server fetches from GitHub periodically. No information about you is sent to GitHub in the
            process.
          </p>
        </section>

        <section class="about-card">
          <h2>Contacting me</h2>
          <p>
            If you email me, I use your address and message only to reply, under Art. 6(1)(f) GDPR
            (legitimate interest in answering inquiries), or Art. 6(1)(b) GDPR if your inquiry relates
            to an agreement. Emails are stored by my email provider, Google (Gmail), and deleted once
            they are no longer needed.
          </p>
        </section>

        <section class="about-card">
          <h2>External links</h2>
          <p>
            Links to other sites (such as GitHub, YouTube, ModDB or Ko-fi) only take effect when you
            click them. From then on, the privacy policy of that site applies.
          </p>
        </section>

        <section class="about-card">
          <h2>Your rights</h2>
          <p>Under the GDPR you have the right to:</p>
          <ul>
            <li>access the data stored about you (Art. 15)</li>
            <li>have it corrected (Art. 16) or erased (Art. 17)</li>
            <li>restrict its processing (Art. 18)</li>
            <li>receive it in a portable format (Art. 20)</li>
            <li>object to processing based on legitimate interests (Art. 21)</li>
            <li>lodge a complaint with a data protection supervisory authority (Art. 77)</li>
          </ul>
          <p>
            To exercise these rights, email the address above. Since this site keeps no visitor data,
            such a request will usually just confirm that I hold nothing about you, apart from any
            emails you've sent me.
          </p>
        </section>

        <p class="section-desc">Last updated: {{ lastUpdated }}</p>
      </div>
    </div>
  `,
})
export class Privacy {
  protected readonly contact = PRIVACY_CONTACT;
  protected readonly lastUpdated = PRIVACY_LAST_UPDATED;
}
