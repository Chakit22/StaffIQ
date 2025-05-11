import 'reflect-metadata';
import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { AppDataSource } from './data-source';

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

// Temporary route for testing
app.get('/', (req, res) => {
  res.send('TeachTeam backend is running!');
});

// Connect to MySQL and start server
AppDataSource.initialize()
  .then(() => {
    console.log('✅ Connected to MySQL');
  })
  .catch((error: unknown) => {
    console.error('DB connection failed:', error);
  })
  .finally(() => {
    app.listen(5000, () => {
      console.log('Server running on http://localhost:5000');
    });
  });

