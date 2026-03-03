export interface Album {
  id: string;
  title: string;
  slug: string;
  description: string;
  coverImage: string;
  order: number;
  photoCount: number;
  createdAt: string;
  updatedAt: string;
}

export interface Photo {
  id: string;
  albumId: string | { id: string; title: string; slug: string };
  src: string;
  thumbnail: string;
  alt: string;
  caption: string;
  dateTaken: string | null;
  order: number;
  featured: boolean;
  width: number;
  height: number;
  createdAt: string;
  updatedAt: string;
}

export interface TimelineEvent {
  id: string;
  title: string;
  slug: string;
  date: string;
  description: string;
  icon: string;
  image: string;
  images: string[];
  order: number;
  createdAt: string;
  updatedAt: string;
}

export interface SiteConfig {
  id: string;
  siteName: string;
  person1Name: string;
  person2Name: string;
  startDate: string;
  couplePhoto: string;
  heroMessage: string;
  footerMessage: string;
  backgroundMusicUrl: string;
  backgroundMusicTitle: string;
  autoplayMusic: boolean;
  primaryColor: string;
}

export interface Music {
  id: string;
  title: string;
  artist: string;
  url: string;
  order: number;
  active: boolean;
  createdAt: string;
  updatedAt: string;
}
