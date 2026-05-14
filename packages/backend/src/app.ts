import express, { Application, Request, Response } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import stationsRoutes from './routes/stations.routes';
import authRoutes from './routes/auth.routes';
import dashboardRoutes from './routes/dashboard.routes';
import simulatorRoutes from './routes/simulator.routes';
import alarmsRoutes from './routes/alarms.routes';

export const createApp = (): Application => {
  const app = express();

  // Middleware
  app.use(helmet()); // Güvenlik başlıkları (Bonus)
  app.use(cors({
    origin: ['http://localhost:5173', 'http://127.0.0.1:5173'], // Frontend URL
    credentials: true,
  }));
  app.use(express.json());

  // API Routes
  app.use('/api/v1/stations', stationsRoutes);
  app.use('/api/v1/auth', authRoutes);
  app.use('/api/v1/dashboard', dashboardRoutes);
  app.use('/api/v1/simulator', simulatorRoutes);
  app.use('/api/v1/alarms', alarmsRoutes);

  // Health Check Endpoint (AWS/Docker deployment standartı)
  app.get('/health', (req: Request, res: Response) => {
    res.status(200).json({ status: 'OK', timestamp: new Date() });
  });

  return app;
};