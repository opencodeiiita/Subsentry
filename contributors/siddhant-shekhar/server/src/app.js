import cors from 'cors';
import express from 'express';
import subscriptionRoutes from './routes/subscription.routes.js';
import { getUserSubscriptions } from './controllers/subscription.controller.js';

const app = express();

app.use(cors());
app.use(express.json());

app.get('/', (_, res) => {
  res.json({
    success: true,
    message: 'SubSentry API running',
    version: '1.0.0',
    timestamp: new Date().toISOString(),
  });
});

app.get('/health', (_, res) => {
  res.json({
    success: true,
    status: 'healthy',
    uptime: process.uptime(),
  });
});

app.get('/api/test/subscriptions', (req, res) => {
  req.user = { id: 'test-user-123' };
  getUserSubscriptions(req, res);
});

app.use('/api/subscriptions', subscriptionRoutes);

app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: 'Endpoint not found',
    error: {
      code: 'NOT_FOUND',
      path: req.originalUrl,
    },
  });
});

app.use((err, req, res, next) => {
  console.error('Unhandled error:', err);

  res.status(500).json({
    success: false,
    message: 'Internal server error',
    error: {
      code: 'INTERNAL_ERROR',
      details: process.env.NODE_ENV === 'development' ? err.message : undefined,
    },
  });
});

export default app;
