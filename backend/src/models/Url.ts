export interface ClickData {
  timestamp: Date;
  referrer: string;
  location: string;
}

export interface ShortUrl {
  originalUrl: string;
  shortcode: string;
  createdAt: Date;
  expiry: Date;
  clicks: ClickData[];
}

export interface CreateShortUrlRequest {
  url: string;
  validity?: number;
  shortcode?: string;
}

export interface CreateShortUrlResponse {
  shortLink: string;
  expiry: string;
}

export interface ShortUrlStats {
  shortcode: string;
  originalUrl: string;
  createdAt: Date;
  expiry: Date;
  totalClicks: number;
  clicks: ClickData[];
} 