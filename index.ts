import express from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import accountRoutes from './routes/accountRoutes';
import authRoutes from './routes/authRoutes';
import customerRoutes from './routes/customerRoutes';
import ledgerRoutes from './routes/ledgerRoutes';
import reportingRoutes from './routes/reportingRoutes';
import transactionRoutes from './routes/transactionRoutes';
import { verifyToken } from './middleware/authMiddleware';
import { checkBlacklistedToken } from './middleware/sessionMiddleware';

const app = express();

// Middleware
app.use(bodyParser.json());
app.use(cors());
app.use(helmet());
app.use(morgan('combined'));

// Routes
app.use('/api', verifyToken, checkBlacklistedToken);
app.use('/api', accountRoutes);
app.use('/api', authRoutes);
app.use('/api', customerRoutes);
app.use('/api', ledgerRoutes);
app.use('/api', reportingRoutes);
app.use('/api', transactionRoutes);

// Basic route
app.get('/', (req, res) => {
  res.send('Welcome to the Pern-Stack-Banking-System API');
});

// Start server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
