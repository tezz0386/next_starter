import app from './src/app';
import dotenv from 'dotenv';
dotenv.config();
const port: Number = process.env.PORT ? parseInt(process.env.PORT, 10) : 3001;
const hostname: String|Number = process.env.HOST_NAME ? parseInt(process.env.HOST_NAME, 10) : '127.0.0.1';
app.listen({port, hostname}, () => {
    console.log(`Server Running at http://127.0.0.1:${port}`);
});