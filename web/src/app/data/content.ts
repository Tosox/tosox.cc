import { IconName } from '../shared/icon';

export const SITE_REPO_URL = 'https://github.com/Tosox/tosox.cc';

export const NAV_TABS = [
  { path: 'about', label: 'About' },
  { path: 'work', label: 'My Work' },
  { path: 'projects', label: 'My Projects' },
  { path: 'contributions', label: 'Contributions' },
  { path: 'skills', label: 'Skills' },
];

export const PRIVACY_CONTACT = {
  name: 'Tosox',
  email: 'tosoxdev@gmail.com',
};
export const PRIVACY_LAST_UPDATED = 'October 31, 2026';
// Mirrored by the API so browsers never contact GitHub; the bundled copy is the fallback
export const AVATAR_URL = '/api/github/avatar';
export const AVATAR_FALLBACK_URL = 'avatar.png';

export const HERO_BIO =
  'I build game mods, dev tooling and open-source infrastructure. ' +
  'Fluent in Java, C++, Python and Lua — and whatever else gets the job done.';

// action = buttons, support = the Ko-fi button, presence = quiet "Also on" links
export type LinkGroup = 'action' | 'support' | 'presence';

export interface SocialLink {
  icon: IconName;
  label: string;
  href: string;
  group: LinkGroup;
  primary?: boolean;
}

export const SOCIAL_LINKS: SocialLink[] = [
  { icon: 'github', label: 'GitHub', href: 'https://github.com/Tosox', group: 'action', primary: true },
  { icon: 'email', label: 'Contact', href: 'mailto:tosoxdev@gmail.com', group: 'action' },
  { icon: 'kofi', label: 'Support me', href: 'https://ko-fi.com/tosox', group: 'support' },
  { icon: 'youtube', label: 'YouTube', href: 'https://www.youtube.com/@tosox', group: 'presence' },
  { icon: 'moddb', label: 'ModDB', href: 'https://www.moddb.com/members/tosox', group: 'presence' },
  { icon: 'forge', label: 'SPT Forge', href: 'https://sp-mod.com/user/79394/tosox', group: 'presence' },
  { icon: 'wgmods', label: 'WGmods', href: 'https://wgmods.net/search/?owner=226623', group: 'presence' },
];

export const ABOUT_PARAGRAPHS: string[] = [
  'I started out writing cheats for Counter-Strike. The cheating itself never really appealed to ' +
    'me, but I was fascinated by how much you could change with nothing but code.',
  'Eventually I was writing things that were really mods rather than cheats. The curiosity is the ' +
    'same, except the result is something other players get to enjoy.',
  'The tools came out of the modding itself. Partway through a project I would run into ' +
    'something worth solving properly, and if it saved me time it would probably save someone ' +
    'else time too.',
];

export interface FocusArea {
  label: string;
  sub: string;
  // Must match `CATALOG[].label` exactly
  groups: string[];
}

export const FOCUS_AREAS: FocusArea[] = [
  {
    label: 'Game mods',
    sub: 'Lua, C# and Python for S.T.A.L.K.E.R., Single Player Tarkov and World of Tanks',
    groups: ['S.T.A.L.K.E.R. Mods', 'Single Player Tarkov Mods', 'World of Tanks Mods'],
  },
  {
    label: 'Reverse engineering',
    sub: 'Patching, protocol work and undocumented binary formats',
    groups: ['Reverse Engineering'],
  },
  {
    label: 'Automation & bots',
    sub: 'Notifiers, scrapers and Discord bots',
    groups: ['Automation & Bots'],
  },
  {
    label: 'Dev tooling',
    sub: 'CLI tools, editor plugins and file-format utilities',
    groups: ['Dev Tools'],
  },
  {
    label: 'Userscripts',
    sub: 'Tampermonkey browser automation',
    groups: ['Userscripts'],
  },
];

export interface SkillTier {
  tier: string;
  note: string;
  languages: string[];
  tools: string[];
}

export const SKILL_TIERS: SkillTier[] = [
  {
    tier: 'Skills',
    note: 'day-to-day',
    languages: ['Java', 'Python', 'Lua', 'C++', 'C#'],
    tools: ['Maven', 'IntelliJ IDEA', 'Visual Studio', 'VS Code', 'Git', 'GitHub'],
  },
  {
    tier: 'Familiar with',
    note: 'used when a project calls for it',
    languages: ['Kotlin', 'Bash', 'JavaScript', 'HTML', 'CSS'],
    tools: ['Android Studio', 'PostgreSQL', 'Raspberry Pi', 'Arduino', 'Postman', 'Docker'],
  },
];

// GitHub's language colors
export const LANGUAGE_COLORS: Record<string, string> = {
  'C++': '#f34b7d',
  Java: '#b07219',
  Python: '#3572A5',
  Lua: '#000080',
  TypeScript: '#2b7489',
  JavaScript: '#f1e05a',
  Kotlin: '#A97BFF',
  'C#': '#178600',
  HTML: '#e34c26',
  CSS: '#563d7c',
  Shell: '#89e051',
};
