import express, { Express } from 'express';
import connectDatabase from './config/db-connection';
import cors, {CorsRequest} from 'cors';
import router from './routes/index';
import projectRouter from './routes/project';

const app: Express = express();
connectDatabase();
app.use(express.json());
app.use(cors());
app.use('/api/v1', router);
app.use('/api/v1', projectRouter);
export default app;

