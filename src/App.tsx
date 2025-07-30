import React, { useState } from 'react';
import { 
  Container, Box, Typography, AppBar, Toolbar, Button, 
  ThemeProvider, createTheme 
} from '@mui/material';
import UrlShortener from './components/UrlShortener';
import UrlStatsPage from './components/UrlStats';
import { log } from './utils/logger';

const theme = createTheme();

function App() {
  const [currentPage, setCurrentPage] = useState<'shortener' | 'stats'>('shortener');

  const handlePageChange = (page: 'shortener' | 'stats') => {
    setCurrentPage(page);
    log('frontend', 'info', 'controller', `Navigated to ${page} page`);
  };

  return (
    <ThemeProvider theme={theme}>
      <AppBar position="static">
        <Toolbar>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            URL Shortener
          </Typography>
          <Button 
            color="inherit" 
            onClick={() => handlePageChange('shortener')}
            sx={{ mr: 2 }}
          >
            Shorten URLs
          </Button>
          <Button 
            color="inherit" 
            onClick={() => handlePageChange('stats')}
          >
            Statistics
          </Button>
        </Toolbar>
      </AppBar>

      <Container>
        <Box sx={{ mt: 2 }}>
          {currentPage === 'shortener' ? <UrlShortener /> : <UrlStatsPage />}
        </Box>
      </Container>
    </ThemeProvider>
  );
}

export default App; 