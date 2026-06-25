const fs = require('fs');
const path = require('path');
const mongoose = require('mongoose');

// Mongoose Models
const User = require('../models/User');
const Product = require('../models/Product');
const Order = require('../models/Order');

const JSON_DB_PATH = path.join(__dirname, '..', 'db.json');

// Initialize JSON database if not exists
function initJSONDb() {
  if (!fs.existsSync(JSON_DB_PATH)) {
    const defaultData = {
      users: [],
      products: [],
      orders: []
    };
    fs.writeFileSync(JSON_DB_PATH, JSON.stringify(defaultData, null, 2), 'utf-8');
  }
}

initJSONDb();

function readJSONDb() {
  try {
    const data = fs.readFileSync(JSON_DB_PATH, 'utf-8');
    return JSON.parse(data);
  } catch (err) {
    console.error('Error reading JSON DB, reinitializing:', err);
    initJSONDb();
    return { users: [], products: [], orders: [] };
  }
}

function writeJSONDb(data) {
  fs.writeFileSync(JSON_DB_PATH, JSON.stringify(data, null, 2), 'utf-8');
}

// Check if Mongoose is connected
function isMongoActive() {
  return mongoose.connection.readyState === 1;
}

// Seed MongoDB when connected if database is empty or missing test users
async function seedDatabase() {
  try {
    if (isMongoActive()) {
      const studentEmail = "student@providence.edu";
      const adminEmail = "admin@providence.edu";
      const rithuEmail = "rithuraj2006@gmail.com";
      
      let student = await User.findOne({ email: studentEmail });
      let admin = await User.findOne({ email: adminEmail });
      let rithu = await User.findOne({ email: rithuEmail });
      
      let seededAny = false;
      
      if (!student) {
        console.log('Seeding student test account in MongoDB...');
        student = await User.create({
          username: "Providence Student",
          email: studentEmail,
          password: "$2b$10$uWOaTX6pbf9VQEaXZladKeAHbI.3f5ZRrhOxv.b2GfOFvNmu3e.Ju", // 123
          role: "client",
          profilePicture: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=150",
          contactDetails: "WhatsApp: +91 9876543210",
          isBanned: false
        });
        seededAny = true;
      }
      
      if (!admin) {
        console.log('Seeding admin test account in MongoDB...');
        admin = await User.create({
          username: "Providence Admin",
          email: adminEmail,
          password: "$2b$10$uWOaTX6pbf9VQEaXZladKeAHbI.3f5ZRrhOxv.b2GfOFvNmu3e.Ju", // 123
          role: "admin",
          profilePicture: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?q=80&w=150",
          contactDetails: "Call: Admin Office Ext 104",
          isBanned: false
        });
        seededAny = true;
      }
      
      if (!rithu) {
        console.log('Seeding rithuraj test account in MongoDB...');
        rithu = await User.create({
          username: "Rithuraj S",
          email: rithuEmail,
          password: "$2b$10$yAxBTGQHRNT9E2dQC2wQpuJFczT1hvRJLIptazTvb/WzO0cfSFZvu", // rithu123
          role: "client",
          profilePicture: "",
          contactDetails: "Phone: +91 9495969798",
          isBanned: false
        });
        seededAny = true;
      }
      
      // Seed products if products collection is empty
      const prodCount = await Product.countDocuments({});
      if (prodCount === 0 && student && rithu) {
        console.log('Seeding default products in MongoDB...');
        await Product.create([
          {
            title: "LED Study Lamp (Adjustable Brightness)",
            description: "Adjustable study lamp with 3 brightness modes. Perfect for late-night exam prep in the hostel. Used for 1 semester, excellent battery life.",
            price: 350,
            category: "Electronics",
            location: "Hostel Block 3 Reception",
            image: "https://images.unsplash.com/photo-1507473885765-e6ed057f782c?q=80&w=500",
            seller: student._id
          },
          {
            title: "Data Structures & Algorithms in C++",
            description: "Textbook by Robert Lafore. Third Edition. Clean pages with minimal highlighting. Essential reference book for CS / IT engineering branches.",
            price: 240,
            category: "Books",
            location: "Central Library Handover Area",
            image: "https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?q=80&w=500",
            seller: student._id
          },
          {
            title: "Classmate Notebooks (Pack of 5, Unused)",
            description: "Brand new Classmate single-line notebooks (172 pages). Unused leftovers from last semester. Selling the entire bundle together.",
            price: 120,
            category: "Stationery",
            location: "Main Campus Canteen",
            image: "https://images.unsplash.com/photo-1531346878377-a5be20888e57?q=80&w=500",
            seller: rithu._id
          }
        ]);
        console.log('Default products seeded successfully in MongoDB.');
      }
      
      if (seededAny) {
        console.log('Default test accounts checked/seeded in MongoDB.');
      }
    }
  } catch (err) {
    console.error('Error seeding MongoDB:', err);
  }
}

// Watch for Mongoose connection to seed (resolve race condition)
if (mongoose.connection.readyState === 1) {
  setTimeout(seedDatabase, 500);
} else {
  mongoose.connection.on('connected', () => {
    setTimeout(seedDatabase, 500);
  });
}

// Helper to generate unique IDs for local JSON storage
function generateId(prefix = 'id') {
  return `${prefix}_${Math.random().toString(36).substr(2, 9)}`;
}

module.exports = {
  // USER METHODS
  async findUser(query) {
    if (isMongoActive()) {
      return await User.findOne(query);
    } else {
      const db = readJSONDb();
      return db.users.find(user => {
        return Object.keys(query).every(key => user[key] === query[key]);
      }) || null;
    }
  },

  async findUserById(id) {
    if (isMongoActive()) {
      return await User.findById(id);
    } else {
      const db = readJSONDb();
      return db.users.find(user => user._id === id || user.id === id) || null;
    }
  },

  async createUser(userData) {
    if (isMongoActive()) {
      const user = new User(userData);
      return await user.save();
    } else {
      const db = readJSONDb();
      const newUser = {
        _id: generateId('user'),
        ...userData,
        isBanned: false,
        createdAt: new Date().toISOString()
      };
      db.users.push(newUser);
      writeJSONDb(db);
      return newUser;
    }
  },

  async updateUser(id, updateData) {
    if (isMongoActive()) {
      return await User.findByIdAndUpdate(id, updateData, { new: true });
    } else {
      const db = readJSONDb();
      const index = db.users.findIndex(user => user._id === id || user.id === id);
      if (index !== -1) {
        db.users[index] = { ...db.users[index], ...updateData };
        writeJSONDb(db);
        return db.users[index];
      }
      return null;
    }
  },

  async listUsers() {
    if (isMongoActive()) {
      return await User.find({});
    } else {
      const db = readJSONDb();
      return db.users;
    }
  },

  // PRODUCT METHODS
  async findProducts(filters = {}) {
    if (isMongoActive()) {
      const query = {};
      if (filters.category) query.category = filters.category;
      if (filters.seller) query.seller = filters.seller;
      if (filters.location) {
        query.location = { $regex: filters.location, $options: 'i' };
      }
      if (filters.search) {
        query.$or = [
          { title: { $regex: filters.search, $options: 'i' } },
          { description: { $regex: filters.search, $options: 'i' } }
        ];
      }
      return await Product.find(query).populate('seller', 'username email contactDetails profilePicture');
    } else {
      const db = readJSONDb();
      let results = [...db.products];

      if (filters.category) {
        results = results.filter(p => p.category.toLowerCase() === filters.category.toLowerCase());
      }
      if (filters.seller) {
        results = results.filter(p => p.seller === filters.seller || (p.seller && p.seller._id === filters.seller));
      }
      if (filters.location) {
        results = results.filter(p => p.location.toLowerCase().includes(filters.location.toLowerCase()));
      }
      if (filters.search) {
        const term = filters.search.toLowerCase();
        results = results.filter(p => 
          p.title.toLowerCase().includes(term) || 
          p.description.toLowerCase().includes(term)
        );
      }

      // Populate seller details
      return results.map(p => {
        const sellerId = typeof p.seller === 'object' ? p.seller._id : p.seller;
        const sellerObj = db.users.find(u => u._id === sellerId) || { username: 'Unknown Seller', email: '' };
        return {
          ...p,
          seller: {
            _id: sellerId,
            username: sellerObj.username,
            email: sellerObj.email,
            contactDetails: sellerObj.contactDetails,
            profilePicture: sellerObj.profilePicture
          }
        };
      });
    }
  },

  async findProductById(id) {
    if (isMongoActive()) {
      return await Product.findById(id).populate('seller', 'username email contactDetails profilePicture');
    } else {
      const db = readJSONDb();
      const product = db.products.find(p => p._id === id || p.id === id);
      if (!product) return null;

      const sellerId = typeof product.seller === 'object' ? product.seller._id : product.seller;
      const sellerObj = db.users.find(u => u._id === sellerId) || { username: 'Unknown Seller', email: '' };
      return {
        ...product,
        seller: {
          _id: sellerId,
          username: sellerObj.username,
          email: sellerObj.email,
          contactDetails: sellerObj.contactDetails,
          profilePicture: sellerObj.profilePicture
        }
      };
    }
  },

  async createProduct(productData) {
    if (isMongoActive()) {
      const product = new Product(productData);
      const savedProduct = await product.save();
      return await Product.findById(savedProduct._id).populate('seller', 'username email contactDetails profilePicture');
    } else {
      const db = readJSONDb();
      const newProduct = {
        _id: generateId('product'),
        ...productData,
        createdAt: new Date().toISOString()
      };
      db.products.push(newProduct);
      writeJSONDb(db);
      
      const sellerObj = db.users.find(u => u._id === productData.seller) || { username: 'Unknown Seller', email: '' };
      return {
        ...newProduct,
        seller: {
          _id: productData.seller,
          username: sellerObj.username,
          email: sellerObj.email,
          contactDetails: sellerObj.contactDetails,
          profilePicture: sellerObj.profilePicture
        }
      };
    }
  },

  async updateProduct(id, updateData) {
    if (isMongoActive()) {
      return await Product.findByIdAndUpdate(id, updateData, { new: true }).populate('seller', 'username email');
    } else {
      const db = readJSONDb();
      const index = db.products.findIndex(p => p._id === id || p.id === id);
      if (index !== -1) {
        db.products[index] = { ...db.products[index], ...updateData };
        writeJSONDb(db);
        
        const product = db.products[index];
        const sellerId = typeof product.seller === 'object' ? product.seller._id : product.seller;
        const sellerObj = db.users.find(u => u._id === sellerId) || { username: 'Unknown Seller', email: '' };
        return {
          ...product,
          seller: {
            _id: sellerId,
            username: sellerObj.username,
            email: sellerObj.email
          }
        };
      }
      return null;
    }
  },

  async deleteProduct(id) {
    if (isMongoActive()) {
      return await Product.findByIdAndDelete(id);
    } else {
      const db = readJSONDb();
      const index = db.products.findIndex(p => p._id === id || p.id === id);
      if (index !== -1) {
        const deleted = db.products.splice(index, 1)[0];
        writeJSONDb(db);
        return deleted;
      }
      return null;
    }
  },

  // ORDER METHODS
  async findOrders(filters = {}) {
    if (isMongoActive()) {
      const query = {};
      if (filters.buyer) query.buyer = filters.buyer;
      return await Order.find(query)
        .populate('buyer', 'username email')
        .populate('items.product', 'title price image location');
    } else {
      const db = readJSONDb();
      let results = [...db.orders];
      if (filters.buyer) {
        results = results.filter(o => o.buyer === filters.buyer || (o.buyer && o.buyer._id === filters.buyer));
      }
      return results.map(o => {
        const buyerId = typeof o.buyer === 'object' ? o.buyer._id : o.buyer;
        const buyerObj = db.users.find(u => u._id === buyerId) || { username: 'Unknown User', email: '' };
        const itemsPopulated = o.items.map(item => {
          const prodId = typeof item.product === 'object' ? item.product._id : item.product;
          const prodObj = db.products.find(p => p._id === prodId) || { title: 'Unknown Product', price: item.price };
          return {
            ...item,
            product: {
              _id: prodId,
              title: prodObj.title,
              price: prodObj.price,
              image: prodObj.image,
              location: prodObj.location
            }
          };
        });
        return {
          ...o,
          buyer: {
            _id: buyerId,
            username: buyerObj.username,
            email: buyerObj.email
          },
          items: itemsPopulated
        };
      });
    }
  },

  async createOrder(orderData) {
    if (isMongoActive()) {
      const order = new Order(orderData);
      const saved = await order.save();
      return await Order.findById(saved._id)
        .populate('buyer', 'username email')
        .populate('items.product', 'title price image location');
    } else {
      const db = readJSONDb();
      const newOrder = {
        _id: generateId('order'),
        ...orderData,
        createdAt: new Date().toISOString()
      };
      db.orders.push(newOrder);
      writeJSONDb(db);

      const buyerObj = db.users.find(u => u._id === orderData.buyer) || { username: 'Unknown User', email: '' };
      const itemsPopulated = orderData.items.map(item => {
        const prodObj = db.products.find(p => p._id === item.product) || { title: 'Unknown Product', price: item.price };
        return {
          ...item,
          product: {
            _id: item.product,
            title: prodObj.title,
            price: prodObj.price,
            image: prodObj.image,
            location: prodObj.location
          }
        };
      });
      return {
        ...newOrder,
        buyer: {
          _id: orderData.buyer,
          username: buyerObj.username,
          email: buyerObj.email
        },
        items: itemsPopulated
      };
    }
  },

  async findOrderById(id) {
    if (isMongoActive()) {
      return await Order.findById(id)
        .populate('buyer', 'username email')
        .populate('items.product', 'title price image location');
    } else {
      const db = readJSONDb();
      const o = db.orders.find(ord => ord._id === id || ord.id === id);
      if (!o) return null;
      
      const buyerId = typeof o.buyer === 'object' ? o.buyer._id : o.buyer;
      const buyerObj = db.users.find(u => u._id === buyerId) || { username: 'Unknown User', email: '' };
      
      const itemsPopulated = o.items.map(item => {
        const prodId = typeof item.product === 'object' ? item.product._id : item.product;
        const prodObj = db.products.find(p => p._id === prodId) || { title: 'Unknown Product', price: item.price };
        return {
          ...item,
          product: {
            _id: prodId,
            title: prodObj.title,
            price: prodObj.price,
            image: prodObj.image,
            location: prodObj.location
          }
        };
      });
      return {
        ...o,
        buyer: {
          _id: buyerId,
          username: buyerObj.username,
          email: buyerObj.email
        },
        items: itemsPopulated
      };
    }
  },

  async updateOrder(id, updateData) {
    if (isMongoActive()) {
      return await Order.findByIdAndUpdate(id, updateData, { new: true })
        .populate('buyer', 'username email')
        .populate('items.product', 'title price image location');
    } else {
      const db = readJSONDb();
      const index = db.orders.findIndex(o => o._id === id || o.id === id);
      if (index !== -1) {
        db.orders[index] = {
          ...db.orders[index],
          ...updateData
        };
        writeJSONDb(db);
        
        // Populate and return
        const orderData = db.orders[index];
        const buyerObj = db.users.find(u => u._id === orderData.buyer) || { username: 'Unknown User', email: '' };
        const itemsPopulated = orderData.items.map(item => {
          const prodId = typeof item.product === 'object' ? item.product._id : item.product;
          const prodObj = db.products.find(p => p._id === prodId) || { title: 'Unknown Product', price: item.price };
          return {
            ...item,
            product: {
              _id: prodId,
              title: prodObj.title,
              price: prodObj.price,
              image: prodObj.image,
              location: prodObj.location
            }
          };
        });
        return {
          ...orderData,
          buyer: {
            _id: orderData.buyer,
            username: buyerObj.username,
            email: buyerObj.email
          },
          items: itemsPopulated
        };
      }
      return null;
    }
  },

  // STATS (for admin dashboard)
  async getStats() {
    const db = isMongoActive() ? null : readJSONDb();
    
    const totalUsers = isMongoActive() 
      ? await User.countDocuments({})
      : db.users.length;
      
    const totalProducts = isMongoActive()
      ? await Product.countDocuments({})
      : db.products.length;

    let totalSales = 0;
    if (isMongoActive()) {
      const orders = await Order.find({});
      totalSales = orders.reduce((sum, o) => sum + o.totalAmount, 0);
    } else {
      totalSales = db.orders.reduce((sum, o) => sum + o.totalAmount, 0);
    }

    return {
      totalUsers,
      totalProducts,
      totalSales
    };
  }
};
