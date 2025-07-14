import express from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import cors from 'cors';

import marketplaceRoutes from './routes/marketplace.js';
import tipRoutes from './routes/tip.js';
import rewardsRoutes from './routes/rewards.js';

dotenv.config();
const app = express();
app.use(cors());
app.use(express.json());

// Connect MongoDB
mongoose.connect(process.env.MONGO_URI);


// API routes
app.use('/api/marketplace', marketplaceRoutes);
app.use('/api/tip', tipRoutes);
app.use('/api/rewards', rewardsRoutes);

// Server start
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
