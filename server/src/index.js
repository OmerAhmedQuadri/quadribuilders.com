import 'dotenv/config';
import express from 'express';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import rateLimit from 'express-rate-limit';
import connectDB from './config/db.js';
import configRoutes       from './routes/config.routes.js';
import projectsRoutes     from './routes/projects.routes.js';
import blogRoutes         from './routes/blog.routes.js';
import teamRoutes         from './routes/team.routes.js';
import testimonialsRoutes from './routes/testimonials.routes.js';
import leadsRoutes        from './routes/leads.routes.js';
import adminRoutes        from './routes/admin.routes.js';

const __dirname = dirname(fileURLToPath(import.meta.url));
const app = express();
const flagIdx = process.argv.indexOf('--port');
const cliPort = flagIdx !== -1 ? process.argv[flagIdx + 1] : null;
let PORT;
if (cliPort) {
  PORT = Number(cliPort);
} else {
  const envPort = process.env.PORT || 5000;
  console.log(`Port was missing in command, falling back to PORT ${envPort} from .env`);
  PORT = Number(envPort);
}

connectDB();

app.use(helmet({ contentSecurityPolicy: false }));
app.use(morgan(process.env.NODE_ENV === 'production' ? 'combined' : 'dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const allowedOrigins = process.env.ALLOWED_ORIGINS
  ? process.env.ALLOWED_ORIGINS.split(',')
  : ['http://localhost:5173'];

app.use(cors({
  origin: (origin, cb) => {
    if (!origin || allowedOrigins.includes(origin)) return cb(null, true);
    cb(new Error('CORS: origin not allowed'));
  },
  credentials: true,
}));

const apiLimiter = rateLimit({ windowMs: 15 * 60 * 1000, max: 100, standardHeaders: true, legacyHeaders: false });

// ── API Routes ──────────────────────────────────────────────────
app.use('/api',              apiLimiter);
app.use('/api/config',       configRoutes);
app.use('/api/projects',     projectsRoutes);
app.use('/api/blog',         blogRoutes);
app.use('/api/team',         teamRoutes);
app.use('/api/testimonials', testimonialsRoutes);
app.use('/api/leads',        leadsRoutes);
app.use('/api/admin',        adminRoutes);

// ── Serve built client — MUST be after all /api routes ─────────
const clientBuild = join(__dirname, '../public');
app.use(express.static(clientBuild));
app.get('*', (req, res) => res.sendFile(join(clientBuild, 'index.html')));

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT} [${process.env.NODE_ENV || 'development'}]`);
});
