import express from 'express';
import cors from 'cors';
import { connectDB } from './config/db.js';
import foodRouter from './routes/foodRoute.js';
import userRouter from './routes/userRoute.js';
import 'dotenv/config';
import cartRouter from './routes/cartRouter.js';
import orderRouter from './routes/orderRoute.js';

// app config
const app = express();
const port = 4000;

// middlewares
app.use(express.json()); // this is to parse the info
app.use(cors()); // this is to access the back from any front

// db connection
connectDB();

// api endpoints
app.use('/api/food', foodRouter);
app.use('/images', express.static('uploads')); // this is to upload images and get them
app.use('/api/user', userRouter);
app.use('/api/cart', cartRouter);
app.use('/api/order', orderRouter);

app.get('/', (request, response) => {
  response.send('API Working');
});

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});

// mongodb+srv://fsojodev:VZqTL5n9O4hctwou@cluster0.z8yjtkj.mongodb.net/?
