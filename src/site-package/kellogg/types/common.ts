export type Language = string;

export interface Translation {
  [lang: string]: string;
}

export type LinkType = 'internal' | 'external';

export interface NavLink {
  id: string;
  name: Translation;
  linkType: LinkType;
  href: string;
  pageDeleted?: boolean;
  children?: NavLink[];
}
