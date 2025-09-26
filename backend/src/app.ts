import express, { Express } from 'express';
import connectDatabase from './config/db-connection';
import cors from 'cors';
import router from './routes/index';
import projectRouter from './routes/project';

const app: Express = express();
connectDatabase();

// 1. CORS first
app.use(cors());

// 2. Body parsers must come BEFORE any routes
app.use(express.json({ limit: '200mb' })); // increase just in case
app.use(express.urlencoded({ limit: '200mb', extended: true }));


// Global timeout middleware
app.use((req, res, next) => {
  // 15 minutes
  const timeoutMs = 15 * 60 * 1000;

  req.setTimeout(timeoutMs);
  res.setTimeout(timeoutMs);


  next();
});


// 4. Routes
app.use('/api/v1', router);
app.use('/api/v1', projectRouter);

export default app;
