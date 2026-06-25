const fs = require('fs');
const path = require('path');
const PDFDocument = require('C:/Users/rithu/Desktop/project/backend/node_modules/pdfkit');

// Initialize PDF Document
const doc = new PDFDocument({ margin: 50, size: 'A4' });
const pdfPath = 'C:/Users/rithu/Desktop/Providence_Marketplace_Deep_Codebase_Explanation.pdf';
const stream = fs.createWriteStream(pdfPath);
doc.pipe(stream);

// Styling Helpers
const primaryColor = '#6366f1';    // Indigo
const secondaryColor = '#14b8a6';  // Teal
const textColor = '#1e293b';       // Slate
const headingColor = '#0f172a';    // Dark
const lightBg = '#f8fafc';         // Light Slate
const borderLine = '#cbd5e1';      // Gray

// Helper for section headers
function sectionHeader(title) {
  doc.moveDown(1.5);
  doc.fontSize(16).font('Helvetica-Bold').fillColor(primaryColor).text(title);
  doc.moveDown(0.4);
}

// Helper for file headers
function fileHeader(filename, filePath) {
  doc.moveDown(1);
  doc.fontSize(12).font('Helvetica-Bold').fillColor(headingColor).text(filename);
  doc.fontSize(9).font('Helvetica-Oblique').fillColor('#64748b').text(`Path: ${filePath}`);
  doc.moveDown(0.3);
}

// Helper for body text
function bodyText(text) {
  doc.fontSize(10).font('Helvetica').fillColor(textColor).text(text, { align: 'justify', lineGap: 2 });
  doc.moveDown(0.5);
}

// Helper for bullet points
function bulletPoint(title, desc) {
  doc.fontSize(10).font('Helvetica-Bold').fillColor(headingColor).text(`  • ${title}: `, { continued: true })
     .font('Helvetica').fillColor(textColor).text(desc);
  doc.moveDown(0.3);
}

// ----------------------------------------------------
// TITLE PAGE
// ----------------------------------------------------
// Colored Header Bar
doc.fillColor(primaryColor).rect(0, 0, doc.page.width, 40).fill();

doc.moveDown(3);
doc.fontSize(26).font('Helvetica-Bold').fillColor(headingColor).text('Deep Technical Explanation of', { align: 'center' });
doc.fontSize(26).font('Helvetica-Bold').fillColor(primaryColor).text('Frontend and Backend Codebase', { align: 'center' });
doc.moveDown(0.5);
doc.fontSize(14).font('Helvetica').fillColor(textColor).text('Providence Kozhikode Campus Marketplace Platform', { align: 'center' });
doc.fontSize(10).font('Helvetica-Oblique').fillColor('#64748b').text('A Comprehensive File-by-File and Function-by-Function Architecture Guide', { align: 'center' });

doc.moveDown(6);
// Decorative line
doc.strokeColor(primaryColor).lineWidth(1.5).moveTo(150, doc.y).lineTo(doc.page.width - 150, doc.y).stroke();
doc.moveDown(2);

// Meta details box
doc.fillColor(lightBg).rect(100, doc.y, doc.page.width - 200, 160).fill();
doc.strokeColor(borderLine).lineWidth(1).rect(100, doc.y - 160, doc.page.width - 200, 160).stroke();

doc.y = doc.y - 140;
doc.fontSize(11).font('Helvetica-Bold').fillColor(headingColor).text('Evaluation Project Details:', { align: 'center' });
doc.fontSize(10).font('Helvetica').fillColor(textColor).text('Providence Kozhikode Full Stack Web Development', { align: 'center' });
doc.moveDown(0.5);
doc.fontSize(11).font('Helvetica-Bold').fillColor(headingColor).text('Developer Info:', { align: 'center' });
doc.fontSize(10).font('Helvetica').fillColor(textColor).text('Rithuraj S (Client & Admin Portals)', { align: 'center' });
doc.moveDown(0.5);
doc.fontSize(11).font('Helvetica-Bold').fillColor(headingColor).text('Document Scope:', { align: 'center' });
doc.fontSize(10).font('Helvetica').fillColor(textColor).text('Dual-Mode Database Helpers, Router Guards, Form Validations,', { align: 'center' });
doc.fontSize(10).font('Helvetica').fillColor(textColor).text('Product Editing, and Order Cancellation workflows.', { align: 'center' });

doc.y = 750;
doc.fontSize(9).font('Helvetica').fillColor('#94a3b8').text('Document generated automatically using PDFKit | June 2026', { align: 'center' });

// Add First Page
doc.addPage();

// ----------------------------------------------------
// SECTION 1: ARCHITECTURAL OVERVIEW
// ----------------------------------------------------
sectionHeader('1. Architectural Overview & Design Patterns');
bodyText('The Providence campus Marketplace is designed to bridge student buyers and sellers in a secure environment. The project uses a decoupled client-server architecture. The frontend handles visual rendering, state propagation, local validation, and session caching, while the backend exposes a secure, stateless API to query datasets, execute updates, and moderate users.');

bulletPoint('MERN Stack Base', 'Built using MongoDB Atlas for cloud database storage, Express.js for REST endpoints, React (via Vite) for single-page client rendering, and Node.js as the server host environment.');
bulletPoint('Smart Fallback Database Layer', 'To allow local operation without a MongoDB connection, the backend uses a dbHelper class that detects connection state. It operates queries on MongoDB models or reads/writes raw records in db.json fallback database.');
bulletPoint('JWT Access Caching', 'Authentication uses JSON Web Tokens. When a user registers or logs in, a signed token is returned, stored in local storage, and sent in request headers to authorize secure operations.');
bulletPoint('Theme & Aesthetics', 'Styling utilizes CSS variable tokens in a premium dark mode theme, featuring subtle glassmorphic panels, gradients, hover micro-animations, and responsive layouts.');

// ----------------------------------------------------
// SECTION 2: FRONTEND FILES & INTERACTION
// ----------------------------------------------------
sectionHeader('2. Frontend Codebase Deep Dive (React Client)');
bodyText('The frontend lives inside the "/front end" directory. It consists of mounting hooks, global routing wraps, state contexts, custom layout modules, and page views.');

fileHeader('main.jsx', 'front end/src/main.jsx');
bodyText('The application entrypoint. It imports the React and ReactDOM client libraries, loads the global stylesheet, wraps the App router shell inside React.StrictMode for quality assertions, and mounts the DOM tree to the index.html target.');

fileHeader('App.jsx', 'front end/src/App.jsx');
bodyText('Serves as the root router component. It wraps the application inside AuthProvider and CartProvider contexts and sets up React Router paths. Declares:');
bulletPoint('PrivateRoute', 'Verifies if an active user token exists. If not, it saves the current location path to history and redirects to /login to require credentials.');
bulletPoint('AdminRoute', 'Checks if the authenticated user has the "admin" role. If they do not, it redirects them to the Home marketplace, restricting dashboard access.');

fileHeader('index.css', 'front end/src/index.css');
bodyText('Declares global variables for colors (Indigo primary, Teal secondary, Slate neutrals, HSL gradients), font sizes (Outfit, Plus Jakarta Sans), animations, and layouts. Defines classes for:');
bulletPoint('.glass-card', 'Glassmorphism background with blur effects, thin borders, transparent white gradients, and hover transitions.');
bulletPoint('.btn, .btn-primary, .btn-secondary, .btn-outline, .btn-accent', 'Glow buttons using linear gradients, shadows, and scaling feedback.');
bulletPoint('.modal-overlay & .modal-container', 'Handles pop-up edit forms, centering the modal in a blurred dark backdrop with a custom slide-up keyframe entry.');

fileHeader('App.css', 'front end/src/App.css');
bodyText('Houses additional styling overrides for page layouts, inputs spacing, grid configurations, forms alignment, and responsive utility media queries.');

doc.addPage();

// Contexts
doc.fontSize(14).font('Helvetica-Bold').fillColor(headingColor).text('2.1 Global State Context Providers');
doc.moveDown(0.3);

fileHeader('AuthContext.jsx', 'front end/src/context/AuthContext.jsx');
bodyText('Exposes authentication state to the entire app. Implements functions to communicate with auth APIs:');
bulletPoint('login(email, password)', 'POSTs to /api/auth/login. Receives user details and token, writes them to localStorage, and updates authentication state.');
bulletPoint('register(userData)', 'POSTs credentials to /api/auth/register, signs up the user, and auto-logs them in.');
bulletPoint('updateProfile(updates)', 'Sends a PUT request to /api/auth/me with the updates (username, contact details, profile photo) to update profile credentials.');
bulletPoint('logout()', 'Clears token and user info from storage, resetting the state to unauthenticated.');

fileHeader('CartContext.jsx', 'front end/src/context/CartContext.jsx');
bodyText('Exposes cart metrics and manipulation functions. Persists values inside localStorage. Contains:');
bulletPoint('addToCart(product, quantity)', 'Appends product items to the cart or increments item counts if they already exist.');
bulletPoint('removeFromCart(productId)', 'Deletes items from the cart matching the product reference ID.');
bulletPoint('updateQuantity(productId, qty)', 'Adjusts item quantity inside the cart array, updating calculations.');
bulletPoint('clearCart()', 'Flushes the cart array to start fresh (used on successful checkout).');

// Pages
doc.moveDown(1);
doc.fontSize(14).font('Helvetica-Bold').fillColor(headingColor).text('2.2 UI Pages & Component Views');
doc.moveDown(0.3);

fileHeader('Home.jsx', 'front end/src/pages/Home.jsx');
bodyText('Renders the landing page. Features a hero section, responsive category selectors, and a grid showing the latest featured listings retrieved from the products API.');

fileHeader('Login.jsx', 'front end/src/pages/Login.jsx');
bodyText('Renders the login form. Uses local state handlers to bind user input. Implements the Quick Login helper panel allowing evaluators to instantly click "Student" or "Admin" to auto-fill forms and bypass manual inputs.');

fileHeader('Register.jsx', 'front end/src/pages/Register.jsx');
bodyText('Renders the signup page. Inputs capture Username, Email, Password, Contact Details, Profile Photo URL, and Role (Buyer/Seller toggle). Performs local validation before POSTing register requests.');

fileHeader('ProductList.jsx', 'front end/src/pages/ProductList.jsx');
bodyText('Renders the marketplace search and catalog page. Features a floating sidebar filter where users can search by keyword, category, or location. Queries the GET /api/products API on parameter changes.');

fileHeader('ProductDetail.jsx', 'front end/src/pages/ProductDetail.jsx');
bodyText('Renders details for a single product listing. Fetches product details by ID. Integrates key features:');
bulletPoint('Authorized Action Guards', 'Compares the product seller ID and the authenticated user ID. Displays Edit and Delete buttons only to the listing owner or system administrator.');
bulletPoint('Edit Option Modal', 'Clicking "Edit" opens a modal populated with the product details. Modifying inputs and submitting executes a PUT API update request, reloading the page state in-place.');
bulletPoint('Delete Button', 'Executes a DELETE call to remove the listing, alerting success and navigating the user back.');
bulletPoint('Cart Integration', 'Provides quantity counters and an "Add to Shopping Cart" button.');

doc.addPage();

fileHeader('Cart.jsx', 'front end/src/pages/Cart.jsx');
bodyText('Displays checkout cart items. Calculates subtotal and overall pricing, allowing buyers to verify purchase volumes, alter quantities, or drop items from their list.');

fileHeader('Checkout.jsx', 'front end/src/pages/Checkout.jsx');
bodyText('Handles cart checkout via a wizard. Captures shipping coordinates (Full Name, Address, City, Postal Code) and credit card payment mocks, executing the order submission API POST.');

fileHeader('Profile.jsx', 'front end/src/pages/Profile.jsx');
bodyText('Serves as the user dashboard. Displays profile cards and is segmented into tabs:');
bulletPoint('My Listings Tab', 'Shows products listed by the seller, offering a direct "Create Listing" form modal.');
bulletPoint('Order History Tab', 'Queries past purchases. Shows order ID, date, status, items, totals, and a Cancel Order action button on active orders.');
bulletPoint('Profile Settings Tab', 'Allows changing display details (hidden for admin users to simplify moderation workflows).');

fileHeader('AdminDashboard.jsx', 'front end/src/pages/AdminDashboard.jsx');
bodyText('Main console for administrators. Tracks:');
bulletPoint('Analytics row', 'Shows total users count, total products listed, and system sales volume.');
bulletPoint('User Accounts Moderation Table', 'Lists registered accounts. Provides ban/suspend action controls.');
bulletPoint('Global Transaction Logs Table', 'Displays all checkout records across the system, including statuses and Cancel action buttons to allow administrators to revoke any order.');

// ----------------------------------------------------
// SECTION 3: BACKEND FILES & LOGIC
// ----------------------------------------------------
sectionHeader('3. Backend Codebase Deep Dive (Node.js & Express API)');
bodyText('The backend lives in the "/backend" directory. It consists of the Express startup script, configuration keys, database wrappers, security guards, schemas, and API routes.');

fileHeader('server.js', 'backend/server.js');
bodyText('The primary Express application file. Sets up CORS to allow requests from the frontend origin, enables Express JSON parser, maps route endpoints (/api/auth, /api/products, /api/orders, /api/admin), and triggers the connection to MongoDB or initiates the local JSON database fallback.');

fileHeader('dbHelper.js', 'backend/utils/dbHelper.js');
bodyText('The core database layer. Contains methods that check if a MongoDB connection is active. If true, queries are mapped to Mongoose models. If false, operations are read/written directly on the db.json local file using native Node.js filesystem modules (fs.readFileSync, fs.writeFileSync). Key functions:');
bulletPoint('findUser(query) & findUserById(id)', 'Locates user documents inside the database matching parameters.');
bulletPoint('createUser(data) & updateUser(id, data)', 'Handles registration and profile changes.');
bulletPoint('findProducts(filters)', 'Supports query filters matching category, location, and title keywords.');
bulletPoint('findProductById(id), createProduct(data), updateProduct(id, data), deleteProduct(id)', 'Manages product listing lifecycles.');
bulletPoint('findOrders(filters), findOrderById(id), createOrder(data), updateOrder(id, data)', 'Handles order logging, retrieval, and cancellations.');
bulletPoint('seedDatabase()', 'Runs on server start. If the users collection is empty, it automatically populates Student, Admin, and Rithu S accounts, and seeds default listings.');

fileHeader('auth.js (Middleware)', 'backend/middleware/auth.js');
bodyText('Contains route guards. "authenticate" decodes JWT tokens passed in request headers, verifies validity, checks if the account is suspended/banned, and binds user details to the request. "adminOnly" blocks non-admin users with a 403 Forbidden status.');

doc.addPage();

// Models
doc.fontSize(14).font('Helvetica-Bold').fillColor(headingColor).text('3.1 Mongoose Database Schemas');
doc.moveDown(0.3);

fileHeader('User.js (Model)', 'backend/models/User.js');
bodyText('Defines fields for username, email (unique), password (hashed), profilePicture, contactDetails, isBanned flag, and role (enum: client, admin).');

fileHeader('Product.js (Model)', 'backend/models/Product.js');
bodyText('Defines fields for title, description, price, category (enum: Electronics, Books, Stationery, Clothing, Others), location, image, and a seller reference pointing to the User model.');

fileHeader('Order.js (Model)', 'backend/models/Order.js');
bodyText('Defines fields for buyer reference, items array (containing product reference, price, and quantity), totalAmount, shippingAddress object, and paymentStatus (enum: Pending, Completed, Failed, Cancelled).');

// Routes
doc.moveDown(1);
doc.fontSize(14).font('Helvetica-Bold').fillColor(headingColor).text('3.2 REST API Route Modules');
doc.moveDown(0.3);

fileHeader('auth.js (Route)', 'backend/routes/auth.js');
bodyText('Handles endpoints: POST /register (registers account, hashes password using bcryptjs, signs token), POST /login (verifies credentials, signs token), GET /me (retrieves user info), and PUT /me (saves display settings).');

fileHeader('products.js (Route)', 'backend/routes/products.js');
bodyText('Handles endpoints: GET / (lists all products matching queries), GET /:id (fetches product details), POST / (creates listing), PUT /:id (modifies details, verifying ownership or admin privileges), and DELETE /:id (removes product listing, verifying permissions).');

fileHeader('orders.js (Route)', 'backend/routes/orders.js');
bodyText('Handles endpoints: POST / (submits order), GET / (lists orders matching the buyer ID), and PUT /:id/cancel (cancels the order, verifying that the user is the original buyer or an admin).');

fileHeader('admin.js (Route)', 'backend/routes/admin.js');
bodyText('Protected with authenticate and adminOnly guards. Exposes endpoints: GET /stats (returns users/products/sales counts), GET /users (lists all accounts), PUT /users/:id/ban (toggles suspension), and GET /orders (lists all order records).');

// ----------------------------------------------------
// SECTION 4: FLOW CHARTS AND INTERACTIONS
// ----------------------------------------------------
sectionHeader('4. Process Execution & Data Flows');

doc.fontSize(12).font('Helvetica-Bold').fillColor(headingColor).text('4.1 Product Update Flow');
bulletPoint('User triggers update', 'Listing owner clicks "Edit" in ProductDetail.jsx. System retrieves current product state and pre-fills form.');
bulletPoint('Validation & API submission', 'Client checks inputs. Triggers PUT to /api/products/:id with Authorization: Bearer token.');
bulletPoint('Route authentication', 'Express runs authenticate middleware, validating JWT token and checking ban status.');
bulletPoint('Permission check', 'Router verifies req.user.id matches seller ID or req.user.role is admin.');
bulletPoint('Database execution', 'dbHelper runs updateProduct, persisting changes. Returns updated product object.');
bulletPoint('UI refreshment', 'Frontend receives updated object, refreshes detail views, and closes modal.');

doc.moveDown(0.5);
doc.fontSize(12).font('Helvetica-Bold').fillColor(headingColor).text('4.2 Order Cancellation Flow');
bulletPoint('User cancels order', 'Buyer clicks "Cancel Order" in Profile.jsx, or Admin clicks "Cancel" in AdminDashboard.jsx.');
bulletPoint('API Request', 'Client makes a PUT request to /api/orders/:id/cancel with authorization headers.');
bulletPoint('Privilege check', 'Express verifies request signature. Validates if user is the buyer or has the admin role.');
bulletPoint('Status modification', 'dbHelper updates paymentStatus to "Cancelled". updates are saved to database.');
bulletPoint('State synchronization', 'Page refreshes, showing red Cancelled status badge. Cancellation button is hidden.');

// Finalize PDF file
doc.end();
console.log('Deep explanation PDF generated successfully.');
