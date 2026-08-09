import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import connectDB from './server/config/db.js';

dotenv.config();
connectDB();

const app = express();

// Core middleware
app.use(cors());
app.use(express.json());

// Health check route — confirms the API is alive
app.get('/api/health', (req, res) => {
  res.json('health');
});


const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`FlowTask server running on port ${PORT}`);
});

export default app;