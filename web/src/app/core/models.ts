export interface Profile {
  login: string;
  publicRepos: number;
  followers: number;
}

export interface Repo {
  description: string | null;
  stars: number;
  forks: number;
  language: string | null;
  url: string;
  archived: boolean;
}

export interface Contribution {
  title: string;
  repo: string;
  number: number;
  state: 'merged' | 'open' | 'closed';
  url: string;
  updatedAt: string;
}

export interface Snapshot {
  profile: Profile;
  repos: Record<string, Repo>;
  /** Keyed by org, then repo name */
  orgs: Record<string, Record<string, Repo>>;
  contributions: Contribution[];
  generatedAt: string;
}
