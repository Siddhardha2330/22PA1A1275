import React, { useState } from 'react';
import { TextField, Button, Alert, Typography, Box } from '@mui/material';
import { createShortUrl } from '../services/api';
import { log } from '../utils/logger';

const UrlShortener: React.FC = () => {
  const [url, setUrl] = useState('');
  const [result, setResult] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!url.trim()) return;
    
    setLoading(true);
    setError('');
    setResult('');
    
    try {
      const response = await createShortUrl(url);
      setResult(response.shortLink);
      log('frontend', 'info', 'controller', 'URL shortened successfully');
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to shorten URL');
      log('frontend', 'error', 'controller', 'Failed to shorten URL');
    }
    setLoading(false);
  };

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h5" gutterBottom>URL Shortener</Typography>
      
      <form onSubmit={handleSubmit}>
        <TextField
          label="Enter URL"
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          fullWidth
          required
          sx={{ mb: 2 }}
        />
        <Button 
          type="submit" 
          variant="contained" 
          disabled={loading}
          fullWidth
        >
          {loading ? 'Shortening...' : 'Shorten URL'}
        </Button>
      </form>

      {error && <Alert severity="error" sx={{ mt: 2 }}>{error}</Alert>}
      {result && (
        <Box sx={{ mt: 2, p: 2, bgcolor: 'grey.100' }}>
          <Typography variant="h6">Shortened URL:</Typography>
          <Typography>{result}</Typography>
        </Box>
      )}
    </Box>
  );
};

export default UrlShortener; 