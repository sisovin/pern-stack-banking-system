import express from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import fileRoutes from './routes/fileRoutes';

const app = express();

// Middleware
app.use(bodyParser.json());
app.use(cors());
app.use(helmet());
app.use(morgan('combined'));

// Basic route
app.get('/', (req, res) => {
  res.send('Welcome to the Pern-Stack-Banking-System API');
});

// File routes
app.use('/api', fileRoutes);

// Start server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
