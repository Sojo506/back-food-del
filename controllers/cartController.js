import userModel from '../models/userModel.js';

// add items to user cart
const addToCart = async (req, res) => {
  const userId = req.body.userId; // this comes from authMiddleware.js
  const itemId = req.params.id;

  try {
    const userData = await userModel.findById(userId);
    const cartData = await userData.cartData;

    if (!cartData[itemId]) {
      cartData[itemId] = 1;
    } else {
      cartData[itemId] += 1;
    }

    await userModel.findByIdAndUpdate(userId, { cartData });
    res.status(200).json({ success: true, message: 'Added to cart' });
  } catch (error) {
    res
      .status(500)
      .json({ success: true, message: 'Error adding item to cart', error });
  }
};

// remove 1 item from user cart
const removeFromCart = async (req, res) => {
  const userId = req.body.userId; // this comes from authMiddleware.js
  const itemId = req.params.id;

  if (!itemId) {
    return res
      .status(400)
      .json({ success: false, message: 'Item ID is required' });
  }

  try {
    const userData = await userModel.findById(userId);
    const cartData = userData.cartData;

    if (!cartData[itemId]) {
      return res
        .status(400)
        .json({ success: false, message: 'Item not found in cart' });
    }

    if (cartData[itemId] > 0) {
      cartData[itemId] -= 1;
    }

    await userModel.findByIdAndUpdate(userId, { cartData });

    res.status(200).json({ success: true, message: 'Removed from cart' });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error removing item from cart',
      error,
    });
  }
};

// delete item from user cart
const deleteFromCart = async (req, res) => {
  const userId = req.body.userId; // this comes from authMiddleware.js
  const itemId = req.params.id;

  if (!itemId) {
    return res
      .status(400)
      .json({ success: false, message: 'Food ID is required' });
  }

  try {
    const userData = await userModel.findById(userId);
    const cartData = await userData.cartData;

    if (!cartData[itemId]) {
      return res
        .status(400)
        .json({ success: false, message: 'Item not found in cart' });
    }

    cartData[itemId] = 0;

    await userModel.findByIdAndUpdate(userId, { cartData });

    res
      .status(200)
      .json({ success: true, message: 'Deleted from cart successfully' });
  } catch (error) {
    res
      .status(500)
      .json({ success: false, message: 'Error deleting item from cart', error });
  }
};

// get items from user cart
const getCart = async (req, res) => {
  const userId = req.body.userId; // this comes from authMiddleware.js

  try {
    const userData = await userModel.findById(userId);
    const cartData = await userData.cartData;
    
    res
      .status(200)
      .json({ success: true, data: cartData });
  } catch (error) {
    res
      .status(500)
      .json({ success: false, message: 'Error getting items from cart', error });
  }
};

export { addToCart, removeFromCart, deleteFromCart, getCart };
