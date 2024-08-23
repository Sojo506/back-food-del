import express from 'express';
import {
  addToCart,
  removeFromCart,
  deleteFromCart,
  getCart,
} from '../controllers/cartController.js';
import authMiddleware from '../middleware/auth.js';

const cartRouter = express.Router();

cartRouter.post('/add/:id', authMiddleware, addToCart);
cartRouter.post('/remove/:id', authMiddleware, removeFromCart);
cartRouter.post('/delete/:id', authMiddleware, deleteFromCart);
cartRouter.get('/get', authMiddleware, getCart);

export default cartRouter;
