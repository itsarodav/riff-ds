// Enlaces del sitio que comparten la portada, el footer y cualquier vista.

export const REPO_URL = 'https://github.com/itsarodav/riff-ds';
export const AUTHOR_URL = 'https://github.com/itsarodav';

export interface NavLink {
  label: string;
  path: string;
}

export const NAV_LINKS: NavLink[] = [
  { label: 'Docs', path: '/introduccion' },
  { label: 'Playground', path: '/foundations/color' },
  { label: 'Changelog', path: '/changelog' },
];
