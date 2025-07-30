import React, { useState, useEffect } from 'react';
import { Typography, Box, Alert, List, ListItem, ListItemText, Divider } from '@mui/material';
import { getAllShortUrls, UrlStats } from '../services/api';
import { log } from '../utils/logger';

const UrlStatsPage: React.FC = () => {
  const [urls, setUrls] = useState<UrlStats[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchUrls();
  }, []);

  const fetchUrls = async () => {
    try {
      const data = await getAllShortUrls();
      setUrls(data);
      log('frontend', 'info', 'controller', `Fetched ${data.length} URLs`);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to fetch URLs');
      log('frontend', 'error', 'controller', 'Failed to fetch URLs');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <Box sx={{ p: 3, textAlign: 'center' }}>
        <Typography>Loading...</Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h5" gutterBottom>URL Statistics</Typography>

      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}

      {urls.length === 0 ? (
        <Typography color="text.secondary">
          No URLs found. Create some shortened URLs first.
        </Typography>
      ) : (
        <List>
          {urls.map((url, index) => (
            <React.Fragment key={index}>
              <ListItem>
                <ListItemText
                  primary={`Short: ${url.shortcode}`}
                  secondary={
                    <>
                      <Typography component="span" variant="body2">
                        Original: {url.originalUrl}
                      </Typography>
                      <br />
                      <Typography component="span" variant="body2">
                        Clicks: {url.totalClicks} | Created: {new Date(url.createdAt).toLocaleDateString()}
                      </Typography>
                    </>
                  }
                />
              </ListItem>
              {index < urls.length - 1 && <Divider />}
            </React.Fragment>
          ))}
        </List>
      )}
    </Box>
  );
};

export default UrlStatsPage; 