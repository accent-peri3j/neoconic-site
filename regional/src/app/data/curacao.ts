import { PROJECTS } from './projects';

export function isCwPath(pathname: string) {
  return pathname === '/cw' || pathname.startsWith('/cw/');
}

export const CURACAO_HEADLINE = 'Branding. Marketing. Design.';
export const CURACAO_HEADLINE_EXTENSION = 'From your next campaign to your entire brand.';
export const CURACAO_DESCRIPTION = 'Brand identity, marketing campaigns, websites and motion for businesses in Curaçao. Discover Neoconic’s work for Better Deals.';
export const CURACAO_PROJECTS = [
  ...PROJECTS.filter(project => project.id === 'betterdeals').map(project => ({
    ...project,
    description: 'Branding, marketing and campaign execution for Better Deals in Curaçao.',
    location: { ...project.location, country: 'Curaçao' },
  })),
  ...PROJECTS.filter(project => project.id !== 'betterdeals'),
];

export const CURACAO_CAPABILITIES = [
  { title: 'Marketing & campaigns', description: 'Campaign concepts and creative for social media, print, outdoor advertising and in-store promotions.' },
  { title: 'Brand identity', description: 'Logos, visual identities and brand guidelines that make your business recognisable wherever people see it.' },
  { title: 'Websites & landing pages', description: 'Clear, considered websites that bring your brand to life and make it easy for customers to get in touch.' },
  { title: 'Film & motion', description: 'Commercials, motion graphics and animated campaign content for screens of every size.' },
];
