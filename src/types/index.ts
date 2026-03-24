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
  mediaType: "image" | "video";
  videoUrl: string;
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
  accentColor: string;
  themeName: string;
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

export interface LoveLetter {
  id: string;
  title: string;
  slug: string;
  content: string;
  author: string;
  recipient: string;
  scheduledAt: string | null;
  isVisible: boolean;
  order: number;
  createdAt: string;
  updatedAt: string;
}

export interface BucketItem {
  id: string;
  title: string;
  description: string;
  completed: boolean;
  completedDate: string | null;
  completedImage: string;
  category: string;
  order: number;
  createdAt: string;
  updatedAt: string;
}

export interface SpecialDay {
  id: string;
  title: string;
  date: string;
  type: "birthday" | "anniversary" | "valentine" | "custom";
  recurring: boolean;
  description: string;
  icon: string;
  notifyBefore: number;
  nextOccurrence?: string;
  createdAt: string;
  updatedAt: string;
}

export interface Place {
  id: string;
  title: string;
  description: string;
  lat: number;
  lng: number;
  image: string;
  date: string;
  order: number;
  createdAt: string;
  updatedAt: string;
}

export interface QuizQuestion {
  id: string;
  question: string;
  options: string[];
  correctAnswer: number;
  explanation: string;
  order: number;
  createdAt: string;
  updatedAt: string;
}

export interface DateIdea {
  id: string;
  title: string;
  description: string;
  category: string;
  image: string;
  estimatedCost: string;
  duration: string;
  order: number;
  createdAt: string;
  updatedAt: string;
}

export interface SearchResult {
  albums: Album[];
  photos: Photo[];
  events: TimelineEvent[];
  total: number;
}

export interface PaginationInfo {
  page: number;
  limit: number;
  total: number;
  pages: number;
}
