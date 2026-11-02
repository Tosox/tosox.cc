import { CatalogEntry } from './catalog';

// Multi-repo projects on /projects, one per GitHub organization. Same idea as `catalog.ts`
export interface FeaturedProject {
  org: string;
  name: string;
  tagline: string;
  url: string;
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
