import express from 'express';
import {
  createFood,
  getFood,
  deleteFood,
} from '../controllers/foodController.js';
import multer from 'multer';

const foodRouter = express.Router();

// Image Storage Config
const storage = multer.diskStorage({
  destination: 'uploads',
  filename: (req, file, cb) => {
    return cb(null, `${Date.now()}${file.originalname}`);
  },
});

const upload = multer({
  storage: storage,
});

foodRouter.post('/add', upload.single('image'), createFood);
foodRouter.get('/list', getFood);
foodRouter.post('/delete/:id', deleteFood);

export default foodRouter;
