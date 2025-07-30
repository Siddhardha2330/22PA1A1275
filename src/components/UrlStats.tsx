import React, { useState, useEffect } from 'react';
import { 
  Container, Box, Typography, Card, CardContent, 
  Table, TableBody, TableCell, TableContainer, 
  TableHead, TableRow, Paper, Chip, Alert,
  Collapse, Button
} from '@mui/material';
import { getAllShortUrls, UrlStats } from '../services/api';
import { log } from '../utils/logger';

const UrlStatsPage: React.FC = () => {
  const [urls, setUrls] = useState<UrlStats[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [expandedRows, setExpandedRows] = useState<Set<number>>(new Set());

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

  const toggleRow = (index: number) => {
    const newExpanded = new Set(expandedRows);
    if (newExpanded.has(index)) {
      newExpanded.delete(index);
    } else {
      newExpanded.add(index);
    }
    setExpandedRows(newExpanded);
  };

  const isExpired = (expiry: string) => {
    return new Date() > new Date(expiry);
  };

  if (loading) {
    return (
      <Container maxWidth="lg">
        <Box sx={{ mt: 4, textAlign: 'center' }}>
          <Typography>Loading...</Typography>
        </Box>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg">
      <Box sx={{ mt: 4, mb: 4 }}>
        <Typography variant="h3" gutterBottom align="center">
          URL Statistics
        </Typography>

        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}

        {urls.length === 0 ? (
          <Card>
            <CardContent>
              <Typography align="center" color="text.secondary">
                No URLs found. Create some shortened URLs first.
              </Typography>
            </CardContent>
          </Card>
        ) : (
          <TableContainer component={Paper}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Short URL</TableCell>
                  <TableCell>Original URL</TableCell>
                  <TableCell>Created</TableCell>
                  <TableCell>Expires</TableCell>
                  <TableCell>Clicks</TableCell>
                  <TableCell>Status</TableCell>
                  <TableCell>Details</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {urls.map((url, index) => (
                  <React.Fragment key={index}>
                    <TableRow>
                      <TableCell>
                        <Typography variant="body2" sx={{ wordBreak: 'break-all' }}>
                          {url.shortcode}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Typography variant="body2" sx={{ wordBreak: 'break-all' }}>
                          {url.originalUrl}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        {new Date(url.createdAt).toLocaleDateString()}
                      </TableCell>
                      <TableCell>
                        {new Date(url.expiry).toLocaleDateString()}
                      </TableCell>
                      <TableCell>
                        <Chip 
                          label={url.totalClicks} 
                          color={url.totalClicks > 0 ? 'primary' : 'default'}
                        />
                      </TableCell>
                      <TableCell>
                        <Chip 
                          label={isExpired(url.expiry) ? 'Expired' : 'Active'}
                          color={isExpired(url.expiry) ? 'error' : 'success'}
                        />
                      </TableCell>
                      <TableCell>
                        <Button onClick={() => toggleRow(index)} size="small" variant="outlined">
                          {expandedRows.has(index) ? 'Hide' : 'Show'}
                        </Button>
                      </TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={7}>
                        <Collapse in={expandedRows.has(index)} timeout="auto" unmountOnExit>
                          <Box sx={{ margin: 1 }}>
                            <Typography variant="h6" gutterBottom>
                              Click Details
                            </Typography>
                            {url.clicks.length === 0 ? (
                              <Typography color="text.secondary">
                                No clicks recorded yet.
                              </Typography>
                            ) : (
                              <Table size="small">
                                <TableHead>
                                  <TableRow>
                                    <TableCell>Timestamp</TableCell>
                                    <TableCell>Referrer</TableCell>
                                    <TableCell>Location</TableCell>
                                  </TableRow>
                                </TableHead>
                                <TableBody>
                                  {url.clicks.map((click, clickIndex) => (
                                    <TableRow key={clickIndex}>
                                      <TableCell>
                                        {new Date(click.timestamp).toLocaleString()}
                                      </TableCell>
                                      <TableCell>{click.referrer}</TableCell>
                                      <TableCell>{click.location}</TableCell>
                                    </TableRow>
                                  ))}
                                </TableBody>
                              </Table>
                            )}
                          </Box>
                        </Collapse>
                      </TableCell>
                    </TableRow>
                  </React.Fragment>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        )}
      </Box>
    </Container>
  );
};

export default UrlStatsPage; 