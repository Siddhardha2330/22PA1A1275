# URL Shortener - 22PA1A1275

A full-stack URL shortener with React frontend and Express backend.

## Quick Start

1. Install frontend dependencies:
```bash
npm install
```

2. Install backend dependencies:
```bash
cd backend
npm install
```

3. Build backend:
```bash
cd backend
npm run build
```

4. Start backend (in one terminal):
```bash
cd backend
npm start
```

5. Start frontend (in another terminal):
```bash
npm start
```

## Manual Start

### Backend
```bash
cd backend
npm install
npm run build
npm start
```
Backend runs on http://localhost:5000

### Frontend
```bash
npm install
npm start
```
Frontend runs on http://localhost:3000

## Usage

1. Open http://localhost:3000
2. Enter a URL to shorten
3. Click "Shorten URL"
4. Copy the shortened link

## API Endpoints

- `POST /shorturls` - Create shortened URL
- `GET /:shortcode` - Redirect to original URL
- `GET /shorturls/:shortcode` - Get URL statistics
- `GET /shorturls` - Get all URLs

## Features

- URL shortening with auto-generated shortcodes
- 30-minute default expiry
- Click tracking
- Basic statistics
- Logging integration
- Modular backend architecture
