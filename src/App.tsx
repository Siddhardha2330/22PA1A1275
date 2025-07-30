import React, { useState } from 'react';
import { Box, Button, Typography } from '@mui/material';
import UrlShortener from './components/UrlShortener';
import UrlStatsPage from './components/UrlStats';
import { log } from './utils/logger';

function App() {
  const [currentPage, setCurrentPage] = useState<'shortener' | 'stats'>('shortener');

  const handlePageChange = (page: 'shortener' | 'stats') => {
    setCurrentPage(page);
    log('frontend', 'info', 'controller', `Navigated to ${page} page`);
  };

  return (
    <Box sx={{ p: 2 }}>
      <Typography variant="h4" gutterBottom align="center">
        URL Shortener
      </Typography>
      
      <Box sx={{ mb: 3, textAlign: 'center' }}>
        <Button 
          variant={currentPage === 'shortener' ? 'contained' : 'outlined'}
          onClick={() => handlePageChange('shortener')}
          sx={{ mr: 2 }}
        >
          Shorten URL
        </Button>
        <Button 
          variant={currentPage === 'stats' ? 'contained' : 'outlined'}
          onClick={() => handlePageChange('stats')}
        >
          Statistics
        </Button>
      </Box>

      {currentPage === 'shortener' ? <UrlShortener /> : <UrlStatsPage />}
    </Box>
  );
}

export default App; 