export interface Profile {
  login: string;
  avatarUrl: string;
  publicRepos: number;
  followers: number;
}

/** Live facts about a repository, straight from GitHub. Editorial data lives in `data/catalog.ts`. */
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
  contributions: Contribution[];
  generatedAt: string;
}
