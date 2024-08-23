import orderModel from '../models/orderModel.js';
import userModel from '../models/userModel.js';
import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

// placing user order from frontend

const placeOrder = async (req, res) => {
  const { userId, items, amount, address } = req.body;
  const frontend_url = process.env.FRONTEND_URL || 'http://localhost:5174';

  try {
    // Crear una nueva orden
    const newOrder = new orderModel({
      userId,
      items,
      amount,
      address,
    });

    // Guardar la nueva orden en la base de datos
    await newOrder.save();

    // Actualizar el carrito del usuario
    await userModel.findByIdAndUpdate(userId, { cartData: {} });

    // Crear los line items para Stripe
    const line_items = items.map((item) => ({
      price_data: {
        currency: 'usd',
        product_data: {
          name: item.name,
        },
        unit_amount: item.price * 100,
      },
      quantity: item.quantity,
    }));

    // Añadir cargos de entrega
    line_items.push({
      price_data: {
        currency: 'usd',
        product_data: {
          name: 'Delivery Charges',
        },
        unit_amount: 200, // Asumiendo que el cargo de entrega es de $2.00
      },
      quantity: 1,
    });

    // Crear una sesión de pago con Stripe
    const session = await stripe.checkout.sessions.create({
      line_items,
      mode: 'payment',
      success_url: `${frontend_url}/verify?success=true&orderId=${newOrder._id}`,
      cancel_url: `${frontend_url}/verify?success=false&orderId=${newOrder._id}`,
    });

    // Enviar la URL de la sesión de pago al cliente
    res.status(200).json({ success: true, session_url: session.url });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: 'Error placing order',
      error: error.message,
    });
  }
};

const verifyOrder = async (req, res) => {
  const { success, orderId } = req.body;

  try {
    if (success === 'true') {
      // Actualizar el pedido para marcarlo como pagado
      await orderModel.findByIdAndUpdate(orderId, { payment: true });
      res
        .status(200)
        .json({ success: true, message: 'Order payment verified' });
    } else {
      // Eliminar el pedido si el pago no fue exitoso
      await orderModel.findByIdAndDelete(orderId);
      res.status(400).json({
        success: false,
        message: 'Order deleted due to failed payment',
      });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: 'Error processing order',
      error: error.message,
    });
  }
};

// user orders for frontend
const userOrders = async (req, res) => {
  const userId = req.body.userId;

  if (!userId) {
    return res.status(400).json({
      success: false,
      message: 'User ID is required',
    });
  }

  try {
    const orders = await orderModel.find({ userId });
    res.status(200).json({ success: true, data: orders });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: 'Error getting orders',
      error: error.message,
    });
  }
};

const listOrders = async (req, res) => {
  try {
    const orders = await orderModel.find({});
    res.status(200).json({ success: true, data: orders });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: 'Error getting orders',
      error: error.message,
    });
  }
};

const updateStatus = async (req, res) => {
  const { orderId, status } = req.body;

  if (!orderId || !status) {
    return res.status(400).json({
      success: false,
      message: 'Order ID and status are required',
    });
  }

  try {
    const updatedOrder = await orderModel.findByIdAndUpdate(
      orderId,
      { status },
      { new: true } // returns the order updated
    );

    if (!updatedOrder) {
      return res.status(404).json({
        success: false,
        message: 'Order not found',
      });
    }

    res.status(200).json({
      success: true,
      message: 'Status Updated',
      data: updatedOrder,
    });
  } catch (error) {
    console.error('Error updating status:', error);
    res.status(500).json({
      success: false,
      message: 'Error updating status',
      error: error.message,
    });
  }
};

export { placeOrder, verifyOrder, userOrders, listOrders, updateStatus };
