const express = require('express');
const router = express.Router();
const dbHelper = require('../utils/dbHelper');
const { authenticate } = require('../middleware/auth');

// Create a new order (Secure Checkout)
router.post('/', authenticate, async (req, res) => {
  try {
    const { items, totalAmount, shippingAddress } = req.body;

    if (!items || items.length === 0 || !totalAmount || !shippingAddress) {
      return res.status(400).json({ message: 'Order items, total amount, and shipping details are required.' });
    }

    if (!shippingAddress.fullName || !shippingAddress.addressLine || !shippingAddress.city || !shippingAddress.postalCode) {
      return res.status(400).json({ message: 'Incomplete shipping address details.' });
    }

    const orderData = {
      buyer: req.user._id || req.user.id,
      items: items.map(item => ({
        product: item.product,
        quantity: parseInt(item.quantity),
        price: parseFloat(item.price)
      })),
      totalAmount: parseFloat(totalAmount),
      shippingAddress,
      paymentStatus: 'Completed' // Simulated checkout completes immediately
    };

    const newOrder = await dbHelper.createOrder(orderData);
    res.status(201).json(newOrder);
  } catch (err) {
    console.error('Create order error:', err);
    res.status(500).json({ message: 'Server error processing checkout.' });
  }
});

// Get user orders (order history)
router.get('/', authenticate, async (req, res) => {
  try {
    const userId = req.user._id || req.user.id;
    const orders = await dbHelper.findOrders({ buyer: userId });
    res.json(orders);
  } catch (err) {
    console.error('Fetch orders error:', err);
    res.status(500).json({ message: 'Server error retrieving order history.' });
  }
});

// Cancel an order (Authenticated buyer or Admin)
router.put('/:id/cancel', authenticate, async (req, res) => {
  try {
    const order = await dbHelper.findOrderById(req.params.id);
    if (!order) {
      return res.status(404).json({ message: 'Order not found.' });
    }

    // Check authorization: only the buyer of the order or an admin can cancel it
    const buyerId = order.buyer._id ? order.buyer._id.toString() : order.buyer.toString();
    const currentUserId = (req.user._id || req.user.id).toString();

    if (buyerId !== currentUserId && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'You are not authorized to cancel this order.' });
    }

    if (order.paymentStatus === 'Cancelled') {
      return res.status(400).json({ message: 'Order is already cancelled.' });
    }

    const updatedOrder = await dbHelper.updateOrder(req.params.id, { paymentStatus: 'Cancelled' });
    res.json(updatedOrder);
  } catch (err) {
    console.error('Cancel order error:', err);
    res.status(500).json({ message: 'Server error cancelling order.' });
  }
});

module.exports = router;
