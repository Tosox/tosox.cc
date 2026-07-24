import { CatalogEntry } from './catalog';

/**
 * The "Frameworks & SDKs" showcase at the top of My Work: larger, multi-repo projects that each live
 * in their own GitHub organization — a core library or SDK plus the modules built on top of it.
 *
 * This is the editorial layer, mirroring `data/catalog.ts`: the project's name, tagline and the
 * curated title/order of its member repos live here, while every live fact (description, language,
 * stars, forks, archived, URL) comes from `/api/github`, keyed by `org` + `repo` under `Snapshot.orgs`.
 *
 * `org` must match the GitHub organization login and `repo` the repository name exactly — a mismatch
 * skips the card and is reported by `GithubService.missingOrgRepos()` (logged in dev), so a rename on
 * GitHub surfaces as a warning rather than a silently vanishing card. `.github` and other
 * infrastructure repos are simply left out.
 */
export interface FeaturedProject {
  /** GitHub organization login — the join key to `Snapshot.orgs`. */
  org: string;
  /** Display name (may differ from the org login, e.g. "CodeSpark" for the "CodeSparkApp" org). */
  name: string;
  /** One-line editorial summary of the project as a whole. */
  tagline: string;
  /** Link to the organization's GitHub page. */
  url: string;
  /** Member repositories, in display order. The first is treated as the project's core/flagship. */
  repos: CatalogEntry[];
}

export const FEATURED_PROJECTS: FeaturedProject[] = [
  {
    org: 'CoHModSDK',
    name: 'CoHModSDK',
    tagline:
      'An unofficial SDK and mod loader for Company of Heroes — a foundation for building and ' +
      'distributing native C++ mods.',
    url: 'https://github.com/CoHModSDK',
    repos: [
      { repo: 'CoHModSDK', title: 'CoHModSDK' },
      { repo: 'ModConfigUI', title: 'Mod Config UI' },
      { repo: 'BorderlessFullscreen', title: 'Borderless Fullscreen' },
      { repo: 'MatchTimer', title: 'Match Timer' },
      { repo: 'PersistentVehicleHPBars', title: 'Persistent Vehicle HP Bars' },
      { repo: 'PersistentXPKickers', title: 'Persistent XP Kickers' },
      { repo: 'PersistentBotFaction', title: 'Persistent Bot Faction' },
      { repo: 'FactionFixLoader', title: 'Faction Fix Loader' },
    ],
  },
  {
    org: 'rpc4games',
    name: 'rpc4games',
    tagline: 'A framework for adding Discord rich presence to games, with drop-in modules per title.',
    url: 'https://github.com/rpc4games',
    repos: [
      { repo: 'rpc4games', title: 'rpc4games' },
      { repo: 'rpc4stalker', title: 'rpc4stalker' },
    ],
  },
  {
    org: 'CodeSparkApp',
    name: 'CodeSpark',
    tagline: 'A gamified platform for learning Java, with real-time AI assistance.',
    url: 'https://github.com/CodeSparkApp',
    repos: [
      { repo: 'api', title: 'Backend API' },
      { repo: 'webapp-vaadin', title: 'Web App' },
    ],
  },
];

/** Every curated org/repo pair, for the missing-repo dev check. */
export const FEATURED_REPOS: { org: string; repo: string }[] = FEATURED_PROJECTS.flatMap((p) =>
  p.repos.map((r) => ({ org: p.org, repo: r.repo })),
);
