import React, { useState } from 'react';
import { 
  Alert, Grid, IconButton, Paper, Button, TextField, Typography
} from '@mui/material';
import { createShortUrl } from '../services/api';
import { log } from '../utils/logger';

const UrlShortener: React.FC = () => {
  const [forms, setForms] = useState([
    { url: '', validity: '', shortcode: '' }
  ]);
  const [results, setResults] = useState<any[]>([]);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const addForm = () => {
    if (forms.length < 5) {
      setForms([...forms, { url: '', validity: '', shortcode: '' }]);
    }
  };

  const removeForm = (index: number) => {
    if (forms.length > 1) {
      setForms(forms.filter((_, i) => i !== index));
    }
  };

  const updateForm = (index: number, field: string, value: string) => {
    const updated = forms.map((form, i) =>
      i === index ? { ...form, [field]: value } : form
    );
    setForms(updated);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    setResults([]);
    try {
      const promises = forms.map(form =>
        createShortUrl(form.url, form.validity ? Number(form.validity) : undefined, form.shortcode)
      );
      const res = await Promise.all(promises);
      setResults(res);
      log('frontend', 'info', 'controller', 'Shortened URLs');
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to shorten URL');
      log('frontend', 'error', 'controller', 'Failed to shorten URL');
    }
    setLoading(false);
  };

  return (
    <Paper sx={{ p: 3, mt: 3 }}>
      <Typography variant="h5" gutterBottom>Shorten URLs</Typography>
      <form onSubmit={handleSubmit}>
        {forms.map((form, idx) => (
          <Grid container spacing={2} alignItems="center" key={idx} sx={{ mb: 1 }}>
            <Grid item xs={5}>
              <TextField
                label="URL"
                value={form.url}
                onChange={e => updateForm(idx, 'url', e.target.value)}
                required
                fullWidth
              />
            </Grid>
            <Grid item xs={2}>
              <TextField
                label="Validity (min)"
                value={form.validity}
                onChange={e => updateForm(idx, 'validity', e.target.value)}
                type="number"
                fullWidth
              />
            </Grid>
            <Grid item xs={3}>
              <TextField
                label="Custom Shortcode"
                value={form.shortcode}
                onChange={e => updateForm(idx, 'shortcode', e.target.value)}
                fullWidth
              />
            </Grid>
            <Grid item xs={2}>
              <Button onClick={() => removeForm(idx)} disabled={forms.length === 1} color="error" variant="outlined">Remove</Button>
            </Grid>
          </Grid>
        ))}
        <Button onClick={addForm} disabled={forms.length >= 5} variant="outlined" sx={{ mb: 2 }}>Add</Button>
        <Button type="submit" variant="contained" sx={{ ml: 2 }} disabled={loading}>Shorten</Button>
      </form>
      {error && <Alert severity="error" sx={{ mt: 2 }}>{error}</Alert>}
      {results.length > 0 && (
        <Paper sx={{ mt: 3, p: 2 }}>
          <Typography variant="h6">Results</Typography>
          {results.map((res, i) => (
            <div key={i}>
              <Typography>Short Link: {res.shortLink}</Typography>
              <Typography>Expiry: {res.expiry}</Typography>
            </div>
          ))}
        </Paper>
      )}
    </Paper>
  );
};

export default UrlShortener; 