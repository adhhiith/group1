const fs = require('fs');
const path = require('path');
const PDFDocument = require('C:/Users/rithu/Desktop/project/backend/node_modules/pdfkit');

// Initialize PDF Document
const doc = new PDFDocument({ margin: 50, size: 'A4' });
const pdfPath = 'C:/Users/rithu/Desktop/Providence_ECommerce_Documentation.pdf';
const stream = fs.createWriteStream(pdfPath);
doc.pipe(stream);

// Styling Helpers
const primaryColor = '#6366f1';
const secondaryColor = '#14b8a6';
const textColor = '#1e293b';
const headingColor = '#0f172a';
const fontRegular = 'Helvetica';
const fontBold = 'Helvetica-Bold';

// ----------------------------------------------------
// TITLE PAGE
// ----------------------------------------------------
doc.fillColor(primaryColor).rect(0, 0, doc.page.width, 30).fill();

doc.moveDown(4);
doc.fontSize(28).font(fontBold).fillColor(headingColor).text('Software System Documentation', { align: 'center' });
doc.moveDown(0.5);
doc.fontSize(18).font(fontRegular).fillColor(textColor).text('Providence Kozhikode Campus Marketplace', { align: 'center' });
doc.fontSize(14).font(fontRegular).fillColor('#64748b').text('MERN Stack Full-Stack Application', { align: 'center' });

doc.moveDown(8);
doc.fontSize(12).font(fontBold).fillColor(headingColor).text('Prepared for:', { align: 'center' });
doc.fontSize(12).font(fontRegular).fillColor(textColor).text('Providence Kozhikode FSD Evaluation Committee', { align: 'center' });
doc.moveDown(1);
doc.fontSize(12).font(fontBold).fillColor(headingColor).text('Developer:', { align: 'center' });
doc.fontSize(12).font(fontRegular).fillColor(textColor).text('Rithuraj S (FSD Project)', { align: 'center' });
doc.moveDown(1);
doc.fontSize(11).font(fontRegular).fillColor('#64748b').text('Date: June 2026', { align: 'center' });

doc.addPage();

// ----------------------------------------------------
// SECTION 1: ARCHITECTURE OVERVIEW
// ----------------------------------------------------
doc.fontSize(18).font(fontBold).fillColor(primaryColor).text('1. Architecture & Design Overview');
doc.moveDown(0.5);
doc.fontSize(11).font(fontRegular).fillColor(textColor)
   .text('The Providence campus Marketplace is designed as a client-server architecture using the MERN stack (MongoDB, Express.js, React, and Node.js). The system is fully responsive, featuring a premium dark mode layout with glassmorphism UI/UX patterns.')
   .moveDown(0.8)
   .text('Key Architectural Features:')
   .moveDown(0.3)
   .font(fontBold).text('  • Client-Server Separation: ', { continued: true }).font(fontRegular).text('Frontend and backend run as separate concurrent services communicating via REST APIs.')
   .moveDown(0.3)
   .font(fontBold).text('  • Smart Database Fallback: ', { continued: true }).font(fontRegular).text('The backend automatically detects if MongoDB (local or Atlas) is available. If active, it uses Mongoose to store data. If not, it falls back to storing data locally in a JSON database (db.json).')
   .moveDown(0.3)
   .font(fontBold).text('  • Auto-Seeding: ', { continued: true }).font(fontRegular).text('On startup, the system automatically checks the database. If it is empty, it seeds default test users (Student, Admin, Rithu S) and default products.')
   .moveDown(0.3)
   .font(fontBold).text('  • JWT Security: ', { continued: true }).font(fontRegular).text('Session states are secured via JWT tokens passed in authorization headers.');

doc.moveDown(2);

// ----------------------------------------------------
// SECTION 2: BACKEND MODULES & FUNCTIONS
// ----------------------------------------------------
doc.fontSize(18).font(fontBold).fillColor(primaryColor).text('2. Backend Modules & API Endpoints');
doc.moveDown(0.5);
doc.fontSize(11).font(fontRegular).fillColor(textColor)
   .text('The backend is modularized into Models, Middleware, Utility Helpers, and Route Controllers.')
   .moveDown(1);

doc.fontSize(13).font(fontBold).fillColor(headingColor).text('2.1 Database Helper (utils/dbHelper.js)');
doc.fontSize(11).font(fontRegular).fillColor(textColor)
   .text('Abstracts database queries. It contains logic to execute operations on MongoDB models if Mongoose connection is established, or fall back to read/write helper operations on db.json. Major functions include:')
   .moveDown(0.3)
   .text('  • findUser(query) / findUserById(id): Retrieves user profile details.')
   .text('  • createUser(data) / updateUser(id, data): Registers and updates user details.')
   .text('  • findProducts(filters): Supports search by title, description, category, and campus location.')
   .text('  • createProduct(data) / updateProduct(id, data) / deleteProduct(id): Handles product CRUD.')
   .text('  • findOrders(filters) / findOrderById(id) / createOrder(data) / updateOrder(id, data): Records, retrieves, and cancels orders.')
   .text('  • getStats(): Summarizes total registered users, active listings, and sales volume.');

doc.moveDown(1.5);

doc.fontSize(13).font(fontBold).fillColor(headingColor).text('2.2 Middleware & Security (middleware/auth.js)');
doc.fontSize(11).font(fontRegular).fillColor(textColor)
   .text('Provides authorization guards for endpoints:')
   .moveDown(0.3)
   .text('  • authenticate(req, res, next): Checks for JWT Bearer token in the Authorization header. Decodes and binds the user object to the request. Prevents suspended users from executing actions.')
   .text('  • adminOnly(req, res, next): Checks user role and blocks access if the user is not an administrator.');

doc.addPage();

doc.fontSize(13).font(fontBold).fillColor(headingColor).text('2.3 Route Controllers (routes/)');
doc.fontSize(11).font(fontRegular).fillColor(textColor)
   .text('Routes map incoming HTTP endpoints to business logic:')
   .moveDown(0.5)
   .font(fontBold).text('  • Authentication Routes (/api/auth):')
   .font(fontRegular).text('    - POST /register: Receives username, email, password, profile picture, contact details, and role. Hashes password using bcryptjs and returns JWT.')
   .text('    - POST /login: Authenticates user credentials, generates session token.')
   .text('    - GET /me: Retrieves currently logged-in user profile.')
   .text('    - PUT /me: Updates profile information (username, avatar URL, contact details).')
   .moveDown(0.5)
   .font(fontBold).text('  • Product Routes (/api/products):')
   .font(fontRegular).text('    - GET /: Retrieves listings matching category, location, and search text filters.')
   .text('    - GET /:id: Retrieves details for a specific listing.')
   .text('    - POST /: Creates a product listing (requires auth).')
   .text('    - PUT /:id: Updates a product listing details (restricted to owner or administrators).')
   .text('    - DELETE /:id: Deletes a listing (restricted to owner or administrators).')
   .moveDown(0.5)
   .font(fontBold).text('  • Order Routes (/api/orders):')
   .font(fontRegular).text('    - POST /: Submits a shopping cart checkout request, including items array, shipping details, and billing total. Saves order status.')
   .text('    - GET /: Retrieves order history for the logged-in buyer.')
   .text('    - PUT /:id/cancel: Cancels an order record (restricted to buyer or administrators).')
   .moveDown(0.5)
   .font(fontBold).text('  • Administrative Routes (/api/admin):')
   .font(fontRegular).text('    - GET /stats: Retrieves users, products, and sales counts (admin only).')
   .text('    - GET /users: Lists all user accounts in the database (admin only).')
   .text('    - PUT /users/:id/ban: Suspends or reactivates a user account (admin only).')
   .text('    - GET /orders: Lists all website transaction records for admin oversight.');

doc.moveDown(2.5);

// ----------------------------------------------------
// SECTION 3: FRONTEND MODULES & FUNCTIONS
// ----------------------------------------------------
doc.fontSize(18).font(fontBold).fillColor(primaryColor).text('3. Frontend Modules & UI Components');
doc.moveDown(0.5);
doc.fontSize(11).font(fontRegular).fillColor(textColor)
   .text('The client app is developed in React (Vite). The UI is responsive, structured using CSS variables, custom grid layouts, and glassmorphism elements.')
   .moveDown(1);

doc.fontSize(13).font(fontBold).fillColor(headingColor).text('3.1 Routing & Guards (src/App.jsx)');
doc.fontSize(11).font(fontRegular).fillColor(textColor)
   .text('Implements the React Router page mappings:')
   .moveDown(0.3)
   .text('  • PrivateRoute: Wraps pages requiring authentication (Checkout, Profile). Redirects unauthenticated users to Login, saving the redirection path.')
   .text('  • AdminRoute: Wraps the Admin Dashboard. Restricts page access to admin role accounts.');

doc.moveDown(1.5);

doc.fontSize(13).font(fontBold).fillColor(headingColor).text('3.2 State Context Providers (src/context/)');
doc.fontSize(11).font(fontRegular).fillColor(textColor)
   .text('Manage shared states globally:')
   .moveDown(0.3)
   .text('  • AuthContext.jsx: Manages authentication token, user session, registration, login API calls, and updates profile settings.')
   .text('  • CartContext.jsx: Manages shopping cart products, quantities, prices, count metrics, and local storage persistence.');

doc.addPage();

doc.fontSize(13).font(fontBold).fillColor(headingColor).text('3.3 Core Pages & UI Components (src/pages/)');
doc.fontSize(11).font(fontRegular).fillColor(textColor)
   .font(fontBold).text('  • Home Page (Home.jsx): ', { continued: true }).font(fontRegular).text('Displays a beautiful hero banner, e-commerce category links (Electronics, Books, Stationery, Clothing, Others), and a grid displaying featured active listings.')
   .moveDown(0.3)
   .font(fontBold).text('  • Login / Register (Login.jsx, Register.jsx): ', { continued: true }).font(fontRegular).text('User onboarding forms. Features a custom "Quick Login" panel that pre-fills Student and Admin credentials to facilitate testing.')
   .moveDown(0.3)
   .font(fontBold).text('  • Marketplace (ProductList.jsx): ', { continued: true }).font(fontRegular).text('Features an interactive sidebar filtering panel allowing users to search products by category, location, and keyword concurrently.')
   .moveDown(0.3)
   .font(fontBold).text('  • Item Details (ProductDetail.jsx): ', { continued: true }).font(fontRegular).text('Displays item details, location, seller info, and contact options. Shows conditional Edit and Delete buttons for owners or admins (opening custom glassmorphic modals for editing), and quantity counters to add items to the cart.')
   .moveDown(0.3)
   .font(fontBold).text('  • Shopping Cart (Cart.jsx): ', { continued: true }).font(fontRegular).text('Allows buyers to view items, modify item quantities, remove items, and see calculations for order totals before checkout.')
   .moveDown(0.3)
   .font(fontBold).text('  • Safe Checkout (Checkout.jsx): ', { continued: true }).font(fontRegular).text('A step-by-step wizard collecting recipient full name, campus shipping details, and mock credit card billing credentials. Submits the order to the database.')
   .moveDown(0.3)
   .font(fontBold).text('  • User Profiles (Profile.jsx): ', { continued: true }).font(fontRegular).text('Displays tabs for: My Listings (where users list new products via modal), Order History (where users can cancel active orders via a Cancel Order button), and Profile Settings (to update display name, avatar, and phone). The settings tab is automatically hidden for administrators.')
   .moveDown(0.3)
   .font(fontBold).text('  • Admin Console (AdminDashboard.jsx): ', { continued: true }).font(fontRegular).text('Gives stats metrics panels (Users, Listings, Sales Volume), lists all system users, lets admins suspend/ban/reactivate accounts, and displays a detailed Global Transaction Logs table with order statuses and Cancel controls to moderate transactions.');

doc.moveDown(3);

// ----------------------------------------------------
// SECTION 4: TESTING ACCOUNTS DETAILS
// ----------------------------------------------------
doc.fontSize(18).font(fontBold).fillColor(primaryColor).text('4. Seeding & Testing Accounts');
doc.moveDown(0.5);
doc.fontSize(11).font(fontRegular).fillColor(textColor)
   .text('For convenience in evaluation, the database auto-seeds these credentials on startup:')
   .moveDown(0.5)
   .text('  1. Student / Client Account: student@providence.edu (Password: 123)')
   .text('  2. Administrator Account: admin@providence.edu (Password: 123)')
   .text('  3. Rithuraj S Account: rithuraj2006@gmail.com (Password: rithu123)')
   .moveDown(0.5)
   .text('Seeded products include: LED Study Lamp, Data Structures Book, Classmate Notebooks.');

// Finalize PDF file
doc.end();
console.log('PDF generated successfully.');
