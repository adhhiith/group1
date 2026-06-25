const express = require('express');
const router = express.Router();
const dbHelper = require('../utils/dbHelper');
const { authenticate } = require('../middleware/auth');

// Get all products (with search & filters)
router.get('/', async (req, res) => {
  try {
    const { category, location, search, seller } = req.query;
    const products = await dbHelper.findProducts({ category, location, search, seller });
    res.json(products);
  } catch (err) {
    console.error('Fetch products error:', err);
    res.status(500).json({ message: 'Server error retrieving products.' });
  }
});

// Get single product details
router.get('/:id', async (req, res) => {
  try {
    const product = await dbHelper.findProductById(req.params.id);
    if (!product) {
      return res.status(404).json({ message: 'Product not found.' });
    }
    res.json(product);
  } catch (err) {
    console.error('Fetch product detail error:', err);
    res.status(500).json({ message: 'Server error retrieving product details.' });
  }
});

// Create a new product listing (Authenticated)
router.post('/', authenticate, async (req, res) => {
  try {
    const { title, description, price, category, location, image } = req.body;

    if (!title || !description || price === undefined || !category || !location) {
      return res.status(400).json({ message: 'Title, description, price, category, and location are required.' });
    }

    if (parseFloat(price) <= 0) {
      return res.status(400).json({ message: 'Price must be a positive number.' });
    }

    const newProduct = await dbHelper.createProduct({
      title,
      description,
      price: parseFloat(price),
      category,
      location,
      image: image || '',
      seller: req.user._id || req.user.id
    });

    res.status(201).json(newProduct);
  } catch (err) {
    console.error('Create product error:', err);
    res.status(500).json({ message: 'Server error creating product listing.' });
  }
});

// Update product listing (Authenticated owner or Admin)
router.put('/:id', authenticate, async (req, res) => {
  try {
    const { title, description, price, category, location, image } = req.body;
    const product = await dbHelper.findProductById(req.params.id);

    if (!product) {
      return res.status(404).json({ message: 'Product not found.' });
    }

    // Verify ownership or admin privileges
    const sellerId = product.seller._id ? product.seller._id.toString() : product.seller.toString();
    const currentUserId = (req.user._id || req.user.id).toString();

    if (sellerId !== currentUserId && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'You are not authorized to update this listing.' });
    }

    const updateData = {};
    if (title) updateData.title = title;
    if (description) updateData.description = description;
    if (price !== undefined) updateData.price = parseFloat(price);
    if (category) updateData.category = category;
    if (location) updateData.location = location;
    if (image !== undefined) updateData.image = image;

    const updatedProduct = await dbHelper.updateProduct(req.params.id, updateData);
    res.json(updatedProduct);
  } catch (err) {
    console.error('Update product error:', err);
    res.status(500).json({ message: 'Server error updating product.' });
  }
});

// Delete product listing (Authenticated owner or Admin)
router.delete('/:id', authenticate, async (req, res) => {
  try {
    const product = await dbHelper.findProductById(req.params.id);

    if (!product) {
      return res.status(404).json({ message: 'Product not found.' });
    }

    const sellerId = product.seller._id ? product.seller._id.toString() : product.seller.toString();
    const currentUserId = (req.user._id || req.user.id).toString();

    if (sellerId !== currentUserId && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'You are not authorized to delete this listing.' });
    }

    await dbHelper.deleteProduct(req.params.id);
    res.json({ message: 'Product listing deleted successfully.' });
  } catch (err) {
    console.error('Delete product error:', err);
    res.status(500).json({ message: 'Server error deleting product.' });
  }
});

module.exports = router;
