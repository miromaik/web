export interface SocialLink {
  id: 'github' | 'bluesky' | 'x' | 'email' | 'coffee';
  label: string;
  url: string;
  tooltip?: string;
}

export interface ProjectItem {
  name: string;
  description: string;
  url: string;
}

export interface SiteConfig {
  profile: {
    name: string;
    avatar: string;
    bio: string;
  };
  socialLinks: SocialLink[];
  coffeeUrl?: string; // Configurable Ko-fi / Buy me a coffee destination
  oneLiners: string[];
  currently: {
    status: string;
    activity: string;
  };
  projects: ProjectItem[];
  archiveUrl: string;
  archiveLabel: string;
  footer: {
    location: string;
    copyright: string;
  };
}

export const siteConfig: SiteConfig = {
  profile: {
    name: 'Miro Maik',
    avatar: '/avatar.png',
    bio: 'I make software and other things that keep me curious.',
  },
  socialLinks: [
    {
      id: 'github',
      label: 'GitHub',
      url: 'https://github.com/miromaik',
      tooltip: 'GitHub',
    },
    {
      id: 'bluesky',
      label: 'Bluesky',
      url: 'https://bsky.app/profile/miromaik.com',
      tooltip: 'Bluesky',
    },
    {
      id: 'x',
      label: 'X',
      url: 'https://x.com/miromaik',
      tooltip: 'X',
    },
    {
      id: 'email',
      label: 'Email',
      url: 'mailto:mail@miromaik.com',
      tooltip: 'Email',
    },
    {
      id: 'coffee',
      label: 'Buy me a coffee on Ko-fi',
      url: 'https://ko-fi.com/miromaik',
      tooltip: 'Buy me a coffee',
    },
  ],
  coffeeUrl: 'https://ko-fi.com/miromaik',
  oneLiners: [
    'Learning Rust... help me!',
    'Probably rebuilding something that already worked.',
    'Trying not to overengineer this.',
    'This was supposed to be a small project.',
    'Making software for questionable reasons.',
    'Probably deleting code right now.',
    'It looked simpler in my head.',
    'One more refactor and it is done. Probably.',
    'I swear this page was finished yesterday.',
    'Currently resisting the urge to rewrite everything.',
    'Somehow this became a project.',
    'Building things that seem interesting.',
    'Thinking about procedural worlds again.',
    'Making Core a little smaller.',
    'Probably working on something unnecessary.',
    'Still deciding whether this needs another feature.',
    'This looked easier yesterday.',
    'Trying very hard not to add another system.',
    'Everything is temporary except the TODOs.',
    'I had a simpler idea five minutes ago.',
  ],
  currently: {
    status: '',
    activity: 'Learning Rust... help me!',
  },
  projects: [
    {
      name: 'Protocol Zero',
      description: 'Digital privacy, security & sovereignty guide.',
      url: 'https://github.com/miromaik/protocolzero',
    },
    {
      name: 'Heed',
      description: 'Tiny host telemetry daemon.',
      url: 'https://github.com/miromaik/heed',
    },
    {
      name: 'Comparator',
      description: 'Minecraft toolbox 38+ features.',
      url: 'https://github.com/miromaik/comparator',
    },
    {
      name: 'Zipline',
      description: 'Encrypted file transfer CLI.',
      url: 'https://github.com/miromaik/zipline',
    },
    {
      name: 'Vow',
      description: 'Workspace auditor and redaction tool.',
      url: 'https://github.com/miromaik/vow',
    },
  ],
  archiveUrl: 'https://github.com/miromaik?tab=repositories',
  archiveLabel: 'View all projects →',
  footer: {
    location: 'Poland',
    copyright: '© 2026 Miro',
  },
};
