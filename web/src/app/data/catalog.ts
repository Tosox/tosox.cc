/**
 * The site map: which repositories appear, in which group, in which order, under which title.
 *
 * This is the *only* editorial layer. Everything else — description, language, stars, forks,
 * archived status, URL — comes live from GitHub via `/api/github`, keyed on `repo`.
 *
 * A repository not listed here does not appear on the site. To add one, add an entry; to hide one,
 * remove it. Order within a group is the display order.
 *
 * `repo` must match the GitHub repository name exactly. If it doesn't, the card is skipped and the
 * name is reported by `GithubService.missingRepos()` (logged in dev) — so a rename on GitHub
 * surfaces as a warning rather than a silently vanishing card.
 */
export interface CatalogEntry {
  /** Exact GitHub repository name — the join key to the live data. */
  repo: string;
  /** Display name. Deliberately mandatory: repo names don't prettify reliably. */
  title: string;
}

export interface CatalogGroup {
  label: string;
  repos: CatalogEntry[];
}

export const CATALOG: CatalogGroup[] = [
  {
    label: 'S.T.A.L.K.E.R. Mods',
    repos: [
      { repo: 'Tosox-Mini-Mods-Repo', title: 'Mini Mods Repo' },
      { repo: 'Autocomplete-Tasks', title: 'Autocomplete Tasks' },
      { repo: 'Enjoy-Cigarettes', title: 'Enjoy Cigarettes' },
      { repo: 'Activated-Charcoal', title: 'Activated Charcoal' },
      { repo: 'Gotta-Go-Fast-Extended', title: 'Gotta Go Fast Extended' },
      { repo: 'rpc4stalker', title: 'RPC4STALKER' },
    ],
  },
  {
    label: 'SPT Mods',
    repos: [
      { repo: 'SPT-DynamicItemWeights', title: 'Dynamic Item Weights' },
      { repo: 'SPT-FIRFencePurchases', title: 'FIR Fence Purchases' },
      { repo: 'SPT-BlackExfilRevision', title: 'Black Exfil Revision' },
      { repo: 'SPT-ChamberAmmoInfo', title: 'Chamber Ammo Info' },
      { repo: 'SPT-MagRetentionReload', title: 'Mag Retention Reload' },
    ],
  },
  {
    label: 'WoT Mods',
    repos: [
      { repo: 'wot-appear-offline', title: 'WoT Appear Offline' },
      { repo: 'wot-no-post-battle-spin', title: 'WoT No Post-Battle Spin' },
    ],
  },
  {
    label: 'Userscripts',
    repos: [
      { repo: 'ChatGPT-PromptStudio', title: 'ChatGPT PromptStudio' },
      { repo: 'ZEIT-Akademie-Quiz-Solver', title: 'ZEIT Akademie Quiz Solver' },
      { repo: 'goons-tracker-local-times', title: 'Goons Tracker Local Times' },
    ],
  },
  {
    label: 'Reverse Engineering',
    repos: [
      { repo: 'Destiny.ut', title: 'Destiny.ut' },
      { repo: 'revanced-patches', title: 'ReVanced Patches' },
      { repo: 'libretick', title: 'libretick' },
    ],
  },
  {
    label: 'Automation & Bots',
    repos: [
      { repo: 'Tosox-Jr', title: 'Tosox Jr' },
      { repo: 'anomaly-addon-notifier', title: 'Anomaly Addon Notifier' },
      { repo: 'moddb-comment-notifier', title: 'ModDB Comment Notifier' },
      { repo: 'moddb-addon-manager', title: 'ModDB Addon Manager' },
    ],
  },
  {
    label: 'Dev Tools',
    repos: [
      { repo: 'Modbrew', title: 'Modbrew' },
      { repo: 'xml-encoding-resolver', title: 'XML Encoding Resolver' },
      { repo: 'xray-db-7z-plugin', title: 'X-Ray DB 7-Zip Plugin' },
    ],
  },
];

/** Every curated repo name, in catalog order. */
export const CATALOG_REPOS: string[] = CATALOG.flatMap((g) => g.repos.map((r) => r.repo));
