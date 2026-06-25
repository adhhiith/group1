const fs = require('fs');
const path = require('path');
const PDFDocument = require('C:/Users/rithu/Desktop/project/backend/node_modules/pdfkit');

// Initialize PDF Document
const doc = new PDFDocument({ margin: 50, size: 'A4' });
const pdfPath = 'C:/Users/rithu/Desktop/Providence_ECommerce_Detailed_Explanation.pdf';
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
doc.fontSize(26).font(fontBold).fillColor(headingColor).text('Detailed System Explanation', { align: 'center' });
doc.moveDown(0.5);
doc.fontSize(16).font(fontRegular).fillColor(textColor).text('Providence Kozhikode Campus Marketplace', { align: 'center' });
doc.fontSize(12).font(fontRegular).fillColor('#64748b').text('Frontend & Backend Dependencies, Modules, and Functions', { align: 'center' });

doc.moveDown(8);
doc.fontSize(11).font(fontBold).fillColor(headingColor).text('Evaluation Project Documentation:', { align: 'center' });
doc.fontSize(11).font(fontRegular).fillColor(textColor).text('Providence Kozhikode FSD Evaluation Committee', { align: 'center' });
doc.moveDown(1);
doc.fontSize(11).font(fontBold).fillColor(headingColor).text('Developer:', { align: 'center' });
doc.fontSize(11).font(fontRegular).fillColor(textColor).text('Rithuraj S (FSD Project)', { align: 'center' });
doc.moveDown(1);
doc.fontSize(10).font(fontRegular).fillColor('#64748b').text('Date: June 2026', { align: 'center' });

doc.addPage();

// ----------------------------------------------------
// SECTION 1: FRONTEND EXPLANATION
// ----------------------------------------------------
doc.fontSize(16).font(fontBold).fillColor(primaryColor).text('1. Frontend Architecture (React / Vite)');
doc.moveDown(0.5);
doc.fontSize(10).font(fontRegular).fillColor(textColor)
   .text('The client application is built on React using Vite as the build tool. The styling is completely custom, using CSS variables, dark mode aesthetics, and modern glassmorphism panels.')
   .moveDown(0.8);

doc.fontSize(12).font(fontBold).fillColor(headingColor).text('1.1 Dependencies');
doc.fontSize(10).font(fontRegular).fillColor(textColor)
   .text('  • react (^19.2.6): Component rendering library.')
   .text('  • react-dom (^19.2.6): Entrypoint to tie React component tree to the DOM.')
   .text('  • react-router-dom (^7.17.0): Handles client routing, page matching, and auth guards.')
   .text('  • lucide-react (^1.17.0): Vector iconography pack used across all dashboard and catalog cards.')
   .text('  • vite (^8.0.12) [Dev]: High-performance dev server and production builder.');

doc.moveDown(1);

doc.fontSize(12).font(fontBold).fillColor(headingColor).text('1.2 Routing Shell & Guards (src/App.jsx)');
doc.fontSize(10).font(fontRegular).fillColor(textColor)
   .text('  • PrivateRoute(children): Protects secure pages (Checkout, Profile). Validates if the user is authenticated; if not, saves their location and redirects to /login.')
   .text('  • AdminRoute(children): Protects the Admin Console. Blocks non-administrators from accessing the console.');

doc.moveDown(1);

doc.fontSize(12).font(fontBold).fillColor(headingColor).text('1.3 State Context Providers (src/context/)');
doc.fontSize(10).font(fontRegular).fillColor(textColor)
   .font(fontBold).text('  • AuthContext.jsx: ').font(fontRegular).text('Maintains token, user profile, registration, login API calls, and updates profile settings.')
   .font(fontBold).text('  • CartContext.jsx: ').font(fontRegular).text('Manages shopping cart state, additions, quantity updates, items deletion, metrics aggregations, and local storage persistence.');

doc.moveDown(1);

doc.fontSize(12).font(fontBold).fillColor(headingColor).text('1.4 UI Pages & Component Views (src/pages/)');
doc.fontSize(10).font(fontRegular).fillColor(textColor)
   .text('  • Home.jsx: Displays the hero section, product categories list, and queries the backend for the latest listings.')
   .text('  • Login.jsx & Register.jsx: Authentication forms. Integrates the Quick Login widget pre-filling test accounts.')
   .text('  • ProductList.jsx: The marketplace. Features an interactive sidebar to search by keyword, category, and location.')
   .text('  • ProductDetail.jsx: Shows product description, seller contact details, and dynamic Edit and Delete buttons for owners/admins.')
   .text('  • Cart.jsx: Lists cart items, allows editing quantities, removing items, and reviews total prices.')
   .text('  • Checkout.jsx: Wizard form collecting shipping address details and simulated credit card billing details.')
   .text('  • Profile.jsx: Contains tabs to manage user listings, review order histories (with order cancel option), and update settings.')
   .text('  • AdminDashboard.jsx: Shows system statistics, user moderation, and the Global Transaction Logs table with order cancel moderation.');

doc.addPage();

// ----------------------------------------------------
// SECTION 2: BACKEND EXPLANATION
// ----------------------------------------------------
doc.fontSize(16).font(fontBold).fillColor(primaryColor).text('2. Backend Architecture (Node.js / Express.js)');
doc.moveDown(0.5);
doc.fontSize(10).font(fontRegular).fillColor(textColor)
   .text('The backend is a RESTful API built on Express.js. It features a smart MongoDB database connection with a built-in JSON file fallback for robust offline execution.')
   .moveDown(0.8);

doc.fontSize(12).font(fontBold).fillColor(headingColor).text('2.1 Dependencies');
doc.fontSize(10).font(fontRegular).fillColor(textColor)
   .text('  • express (^5.2.1): Main routing server framework.')
   .text('  • mongoose (^9.6.3): MongoDB schema validation and database driver.')
   .text('  • bcryptjs (^3.0.3): Hashes passwords securely before database persistence.')
   .text('  • jsonwebtoken (^9.0.3): Signs and verifies JSON Web Tokens (JWT) for secure user sessions.')
   .text('  • cors (^2.8.6): Permits API requests from the frontend origin.')
   .text('  • dotenv (^17.4.2): Parses key-value configurations from the .env file.')
   .text('  • pdfkit (^0.16.0): Creates professional documentation PDF files directly.');

doc.moveDown(1);

doc.fontSize(12).font(fontBold).fillColor(headingColor).text('2.2 Smart Database Helper (utils/dbHelper.js)');
doc.fontSize(10).font(fontRegular).fillColor(textColor)
   .text('Handles dual-mode data operations. If Mongoose connection is active, queries are run on MongoDB; if inactive, queries are run on db.json arrays. Key functions include:')
   .text('  • findUser(query) / findUserById(id) / createUser(data) / updateUser(id, data): User CRUD operations.')
   .text('  • findProducts(filters) / createProduct(data) / updateProduct(id, data) / deleteProduct(id): Product CRUD operations.')
   .text('  • findOrders(filters) / findOrderById(id) / createOrder(data) / updateOrder(id, data): Order CRUD operations.')
   .text('  • getStats(): Pulls counts of users, listings, and cumulative billing amounts.')
   .text('  • seedDatabase(): Checks database status. If empty, automatically seeds Student, Admin, and Rithu S accounts (password 123) and default listings.');

doc.moveDown(1);

doc.fontSize(12).font(fontBold).fillColor(headingColor).text('2.3 Middleware & Security (middleware/auth.js)');
doc.fontSize(10).font(fontRegular).fillColor(textColor)
   .text('  • authenticate(req, res, next): Validates authorization header tokens, blocks suspended accounts, and binds req.user.')
   .text('  • adminOnly(req, res, next): Checks if user role is admin; if not, blocks access with a 403 status.');

doc.moveDown(1);

doc.fontSize(12).font(fontBold).fillColor(headingColor).text('2.4 API Route Endpoints (routes/)');
doc.fontSize(10).font(fontRegular).fillColor(textColor)
   .font(fontBold).text('  • auth.js (/api/auth): ').font(fontRegular).text('POST /register (onboard accounts), POST /login (session token generation), GET /me (retrieve profile), PUT /me (update settings).')
   .font(fontBold).text('  • products.js (/api/products): ').font(fontRegular).text('GET / (filter catalog), GET /:id (details), POST / (create listing), PUT /:id (edit details), DELETE /:id (remove listing).')
   .font(fontBold).text('  • orders.js (/api/orders): ').font(fontRegular).text('POST / (submit checkout cart), GET / (buyer order history), PUT /:id/cancel (cancel purchase).')
   .font(fontBold).text('  • admin.js (/api/admin): ').font(fontRegular).text('GET /stats (system totals), GET /users (moderation list), PUT /users/:id/ban (suspend account), GET /orders (all website order records).');

// Finalize PDF file
doc.end();
console.log('PDF generated successfully.');
