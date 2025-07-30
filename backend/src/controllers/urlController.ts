import { Request, Response } from 'express';
import urlService from '../services/urlService';
import { log } from '../utils/logger';

export const createShortUrl = async (req: Request, res: Response) => {
  try {
    const { url, validity, shortcode } = req.body;
    
    if (!url) {
      await log('backend', 'error', 'controller', 'URL is required');
      return res.status(400).json({ message: 'URL is required' });
    }

    if (!url.startsWith('http://') && !url.startsWith('https://')) {
      await log('backend', 'error', 'controller', 'Invalid URL format');
      return res.status(400).json({ message: 'Invalid URL format' });
    }

    const result = await urlService.createShortUrl({ url, validity, shortcode });
    
    await log('backend', 'info', 'controller', `Short URL created: ${result.shortLink}`);
    res.status(201).json(result);
  } catch (error: any) {
    if (error.message === 'Shortcode already exists') {
      await log('backend', 'error', 'controller', 'Shortcode collision');
      return res.status(409).json({ message: 'Shortcode already exists' });
    }
    
    await log('backend', 'error', 'controller', 'Internal server error');
    res.status(500).json({ message: 'Internal server error' });
  }
};

export const redirectToOriginalUrl = async (req: Request, res: Response) => {
  try {
    const { shortcode } = req.params;
    
    const urlData = await urlService.getShortUrl(shortcode);
    await urlService.recordClick(shortcode, req.get('Referrer') || 'Direct');
    
    await log('backend', 'info', 'controller', `Redirecting ${shortcode} to ${urlData.originalUrl}`);
    res.redirect(urlData.originalUrl);
  } catch (error: any) {
    if (error.message === 'Shortcode not found') {
      await log('backend', 'error', 'controller', 'Shortcode not found for redirect');
      return res.status(404).json({ message: 'Shortcode not found' });
    }
    
    if (error.message === 'URL expired') {
      await log('backend', 'warn', 'controller', 'URL expired');
      return res.status(410).json({ message: 'URL expired' });
    }
    
    await log('backend', 'error', 'controller', 'Internal server error');
    res.status(500).json({ message: 'Internal server error' });
  }
};

export const getShortUrlStats = async (req: Request, res: Response) => {
  try {
    const { shortcode } = req.params;
    
    const stats = await urlService.getShortUrlStats(shortcode);
    
    await log('backend', 'info', 'controller', `Stats retrieved for ${shortcode}`);
    res.json(stats);
  } catch (error: any) {
    if (error.message === 'Shortcode not found') {
      await log('backend', 'error', 'controller', 'Shortcode not found for stats');
      return res.status(404).json({ message: 'Shortcode not found' });
    }
    
    await log('backend', 'error', 'controller', 'Internal server error');
    res.status(500).json({ message: 'Internal server error' });
  }
};

export const getAllShortUrls = async (req: Request, res: Response) => {
  try {
    const allUrls = await urlService.getAllShortUrls();
    
    await log('backend', 'info', 'controller', `All URLs retrieved: ${allUrls.length} items`);
    res.json(allUrls);
  } catch (error) {
    await log('backend', 'error', 'controller', 'Internal server error');
    res.status(500).json({ message: 'Internal server error' });
  }
}; 