import express from 'express';
import { PORT, URL_ACCESS } from './config/config.js';
import routes from './routes/index.routes.js';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import { sesionMid } from './middlewares/sesion.js';
import { corsMiddleware } from './middlewares/cors.js';

const app = express();

app.use(express.json())
app.use(cookieParser())
app.use(express.urlencoded({ extended: true }));
app.use(sesionMid);
app.use(corsMiddleware);
app.use(cors({
    origin: URL_ACCESS,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    credentials: true
}));

app.use('/api', routes)

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});