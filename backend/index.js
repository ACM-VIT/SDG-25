import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';
import attendanceRoutes from './attendance/attendanceRoutes.js';
import classRoutes from './routes/classes.js';

dotenv.config();

const app = express();
const port = 8000;

app.use(cors());
app.use(express.json());

const MONGODB_URI = process.env.MONGODB_URI;

if (!process.env.MONGODB_URI) {
  console.warn(
    ' Warning: MONGODB_URI not found in .env file, using fallback'
  );

}

console.log('Attempting to connect to MongoDB...');
mongoose
  .connect(MONGODB_URI)
  .then(() => {
    console.log('Connected to MongoDB successfully');
    console.log('Database:', mongoose.connection.name);
  })
  .catch((err) => {
    console.error('MongoDB connection error:', err.message);
  });

app.use('/api/attendance', attendanceRoutes);
app.use('/api/classes', classRoutes);

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
