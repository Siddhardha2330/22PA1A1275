import { Router } from 'express';
import { 
  createShortUrl, 
  redirectToOriginalUrl, 
  getShortUrlStats, 
  getAllShortUrls 
} from '../controllers/urlController';

const router = Router();

router.post('/shorturls', createShortUrl);
router.get('/shorturls', getAllShortUrls);
router.get('/shorturls/:shortcode', getShortUrlStats);
router.get('/:shortcode', redirectToOriginalUrl);

export default router; 