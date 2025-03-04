import path from 'path';
import express from 'express';
import dotenv from 'dotenv';
dotenv.config();
import connectDB from './config/db.js';
import cookieParser from 'cookie-parser';
import { notFound, errorHandler } from './middleware/errorMiddleware.js';
import userRoutes from './routes/userRoutes.js';
import productCategoryRoutes from './routes/productCategoryRoutes.js';
import productRoutes from './routes/productRoutes.js';
import productInsuranceRoutes from './routes/productInsuranceRoutes.js';
import productClaimRoutes from './routes/productClaimRoutes.js';
import productBuyRoutes from './routes/productBuyRoutes.js';
import repairProcedureRoutes from './routes/repairProcedureRoutes.js';

import cors from 'cors';

const port = process.env.PORT || 5000;

connectDB();

const app = express();

// CORS configuration
const corsOptions = {
  origin: 'http://localhost:3000', // Frontend URL
  methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
  credentials: true, // Enable credentials (cookies, authorization headers, etc)
  optionsSuccessStatus: 200 // Some legacy browsers (IE11, various SmartTVs) choke on 204
};

app.use(cors(corsOptions));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(cookieParser());

app.use('/api/users', userRoutes);
app.use('/api/category', productCategoryRoutes);
app.use('/api/product', productRoutes);
app.use('/api/insurance', productInsuranceRoutes);
app.use('/api/claims', productClaimRoutes);
app.use('/api/Buy', productBuyRoutes);
app.use('/api/repair_procedure', repairProcedureRoutes); 




if (process.env.NODE_ENV === 'production') {
  const __dirname = path.resolve();
  app.use(express.static(path.join(__dirname, '/frontend/dist')));

  app.get('*', (req, res) =>
    res.sendFile(path.resolve(__dirname, 'frontend', 'dist', 'index.html'))
  );
} else {
  app.get('/', (req, res) => {
    res.send('API is running....');
  });
}

app.use(notFound);
app.use(errorHandler);

app.listen(port, () => console.log(`Server started on port ${port}`));
