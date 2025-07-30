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
  totalClicks: number;
}

export const createShortUrl = async (url: string): Promise<ShortUrl> => {
  const response = await axios.post(`${API_BASE_URL}/shorturls`, { url });
  return response.data;
};

export const getAllShortUrls = async (): Promise<UrlStats[]> => {
  const response = await axios.get(`${API_BASE_URL}/shorturls`);
  return response.data;
}; 