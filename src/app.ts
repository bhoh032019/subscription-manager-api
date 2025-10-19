import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import pinoHttpImport from 'pino-http';

import health from './routes/health.js';
import { errorHandler } from './middlewares/errors.js';

const app = express();
app.use(helmet());
app.use(cors({ origin: process.env.CORS_ORIGIN ?? '*', credentials: true }));
app.use(express.json());
// @ts-expect-error - pino-http has ESM/CommonJS interop issues
app.use(pinoHttpImport());

app.use('/health', health);
app.use(errorHandler);

const port = Number(process.env.PORT ?? 4000);
app.listen(port, () => console.log(`api listening on :${port}`));
