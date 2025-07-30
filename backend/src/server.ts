import express from 'express';
import cors from 'cors';
import urlRoutes from './routes/urlRoutes';
import { log } from './utils/logger';

const app = express();
const PORT = 5000;

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use('/', urlRoutes);

app.listen(PORT, async () => {
  await log('backend', 'info', 'server', `Server running on port ${PORT}`);
  console.log(`Server running on port ${PORT}`);
}); 