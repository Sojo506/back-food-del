import foodModel from '../models/foodModel.js';
import fs from 'fs';

// add food item
const createFood = async (req, res) => {
  if (!req.file || !req.file.filename) {
    return res
      .status(400)
      .json({ success: false, message: 'Image file is required' });
  }

  const imageFileName = req.file.filename;
  const { name, description, price, category } = req.body;

  // Basic validation
  if (!name || !description || !price || !category) {
    return res
      .status(400)
      .json({ success: false, message: 'All fields are required' });
  }

  const food = new foodModel({
    name,
    description,
    price,
    category,
    image: imageFileName,
  });

  try {
    await food.save();
    res.status(201).json({ success: true, message: 'Food Added' });
  } catch (error) {
    console.error('Error adding food:', error.message);
    res.status(500).json({
      success: false,
      message: 'Error adding food',
      error: error.message,
    });
  }
};

const getFood = async (req, res) => {
  try {
    const foods = await foodModel.find({});
    res.status(200).json({ success: true, data: foods });
  } catch (error) {
    console.error('Error getting foods:', error.message);
    res.status(500).json({
      success: false,
      message: 'Error getting foods',
      error: error.message,
    });
  }
};

const deleteFood = async (req, res) => {
  const foodId = req.params.id;

  if (!foodId) {
    return res
      .status(400)
      .json({ success: false, message: 'Food ID is required' });
  }

  try {
    const food = await foodModel.findById(foodId);

    if (!food) {
      return res
        .status(404)
        .json({ success: false, message: 'Food not found' });
    }

    // Delete the image file if it exists
    fs.unlink(`uploads/${food.image}`, (err) => {
      if (err) {
        console.error('Error deleting image file:', err.message);
      }
    });

    await foodModel.findByIdAndDelete(foodId);
    res.status(200).json({ success: true, message: 'Food Deleted' });
  } catch (error) {
    console.error('Error deleting food:', error.message);
    res.status(500).json({
      success: false,
      message: 'Error deleting food',
      error: error.message,
    });
  }
};

export { createFood, getFood, deleteFood };
