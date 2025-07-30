import axios from 'axios';

const API_BASE_URL = 'http://localhost:5000';

export interface ShortUrl {
  shortLink: string;
  expiry: string;
}

export interface UrlStats {
  shortcode: string;
  originalUrl: string;
  createdAt: string;
  expiry: string;
  totalClicks: number;
  clicks: Array<{
    timestamp: string;
    referrer: string;
    location: string;
  }>;
}

export const createShortUrl = async (url: string, validity?: number, shortcode?: string): Promise<ShortUrl> => {
  const response = await axios.post(`${API_BASE_URL}/shorturls`, {
    url,
    validity,
    shortcode
  });
  return response.data;
};

export const getShortUrlStats = async (shortcode: string): Promise<UrlStats> => {
  const response = await axios.get(`${API_BASE_URL}/shorturls/${shortcode}`);
  return response.data;
};

export const getAllShortUrls = async (): Promise<UrlStats[]> => {
  const response = await axios.get(`${API_BASE_URL}/shorturls`);
  return response.data;
}; 