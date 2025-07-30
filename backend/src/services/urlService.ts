import { nanoid } from 'nanoid';
import { ShortUrl, CreateShortUrlRequest, CreateShortUrlResponse, ShortUrlStats, ClickData } from '../models/Url';
import { log } from '../utils/logger';

class UrlService {
  private urls = new Map<string, ShortUrl>();

  async createShortUrl(request: CreateShortUrlRequest): Promise<CreateShortUrlResponse> {
    const { url, validity = 30, shortcode } = request;
    
    const finalShortcode = shortcode || nanoid(6);
    
    if (this.urls.has(finalShortcode)) {
      await log('backend', 'error', 'service', `Shortcode ${finalShortcode} already exists`);
      throw new Error('Shortcode already exists');
    }

    const expiry = new Date(Date.now() + validity * 60 * 1000);
    
    const shortUrl: ShortUrl = {
      originalUrl: url,
      shortcode: finalShortcode,
      createdAt: new Date(),
      expiry: expiry,
      clicks: []
    };

    this.urls.set(finalShortcode, shortUrl);
    
    await log('backend', 'info', 'service', `URL shortened: ${url} -> ${finalShortcode}`);
    
    return {
      shortLink: `http://localhost:5000/${finalShortcode}`,
      expiry: expiry.toISOString()
    };
  }

  async getShortUrl(shortcode: string): Promise<ShortUrl> {
    const urlData = this.urls.get(shortcode);
    
    if (!urlData) {
      await log('backend', 'error', 'service', `Shortcode ${shortcode} not found`);
      throw new Error('Shortcode not found');
    }

    if (new Date() > urlData.expiry) {
      await log('backend', 'warn', 'service', `URL ${shortcode} expired`);
      throw new Error('URL expired');
    }

    return urlData;
  }

  async recordClick(shortcode: string, referrer: string): Promise<void> {
    const urlData = this.urls.get(shortcode);
    
    if (urlData) {
      const clickData: ClickData = {
        timestamp: new Date(),
        referrer: referrer || 'Direct',
        location: 'Unknown'
      };

      urlData.clicks.push(clickData);
      await log('backend', 'info', 'service', `Click recorded for ${shortcode}`);
    }
  }

  async getShortUrlStats(shortcode: string): Promise<ShortUrlStats> {
    const urlData = this.urls.get(shortcode);
    
    if (!urlData) {
      await log('backend', 'error', 'service', `Stats requested for non-existent shortcode: ${shortcode}`);
      throw new Error('Shortcode not found');
    }

    await log('backend', 'info', 'service', `Stats retrieved for ${shortcode}`);
    
    return {
      shortcode: urlData.shortcode,
      originalUrl: urlData.originalUrl,
      createdAt: urlData.createdAt,
      expiry: urlData.expiry,
      totalClicks: urlData.clicks.length,
      clicks: urlData.clicks
    };
  }

  async getAllShortUrls(): Promise<ShortUrlStats[]> {
    const allUrls: ShortUrlStats[] = [];
    
    for (const [shortcode, urlData] of this.urls) {
      allUrls.push({
        shortcode: urlData.shortcode,
        originalUrl: urlData.originalUrl,
        createdAt: urlData.createdAt,
        expiry: urlData.expiry,
        totalClicks: urlData.clicks.length,
        clicks: urlData.clicks
      });
    }

    await log('backend', 'info', 'service', `Retrieved ${allUrls.length} URLs`);
    return allUrls;
  }
}

export default new UrlService(); 