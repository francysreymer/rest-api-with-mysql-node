import 'reflect-metadata';
import dotenvSafe from 'dotenv-safe';
import express from 'express';
import { DataSource } from 'typeorm';

import container from '@/config/container';
import TYPES from '@/config/types';
import userRoutes from '@/routes/userRoutes';

// Load environment variables from .env file and ensure required variables are set
dotenvSafe.config({
  allowEmptyValues: true,
});

const app = express();
app.use(express.json());
app.use('/api', userRoutes);

const PORT = process.env.PORT || 3000;

(async () => {
  try {
    const db = container.get<DataSource>(TYPES.DB); // Retrieve the DataSource from the container
    await db.initialize(); // Initialize the data source

    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  } catch (error) {
    console.error('Error during application startup:', error);
  }
})();
