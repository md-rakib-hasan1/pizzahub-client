# 🍕 PizzaHub – Online Pizza Ordering Platform

**Live Website:** https://pizzahub-client-blue.vercel.app/

PizzaHub is a full-stack online pizza ordering platform where customers can browse pizzas, place orders, and track their orders. Vendors can manage their pizza menus and orders, while administrators manage users, menu approvals, and featured items.

## ✨ Key Features

- **Authentication:** Secure registration and login with email/password and Google authentication.
- **Browse Menu:** Explore available pizzas with their descriptions, prices, images, and ingredients.
- **Online Ordering:** Place pizza orders with delivery addresses and adjustable quantities.
- **Order Management:** Customers can view, track, and cancel eligible orders.
- **Vendor Dashboard:** Vendors can create, update, and manage their menu items and customer orders.
- **Premium Subscription:** Vendors can subscribe to Premium through Stripe and manage their subscriptions.
- **Featured Menu:** Active Premium vendors can feature their approved menu items.
- **Admin Dashboard:** Administrators can manage users, review menu submissions, and manage featured menu items.
- **Responsive Design:** User-friendly interface across desktop, tablet, and mobile devices.

## 🛠️ Technologies Used

### Frontend
- Next.js
- React
- TypeScript
- Tailwind CSS
- Lucide React
- Sonner

### Backend & Database
- Node.js
- Express.js
- MongoDB
- Better Auth
- JSON Web Token (JWT)

### Payment & Deployment
- Stripe
- Vercel (Frontend)
- Render (Backend)

## 📦 Installation and Setup

### Prerequisites
- Node.js
- npm
- MongoDB database
- Stripe account (for subscription payment integration)
- Google OAuth credentials (for Google authentication)

### 1. Clone the Repository

```bash
git clone https://github.com/md-rakib-hasan1/pizzahub-client.git
cd pizzahub-client
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Configure Environment Variables

Create a `.env` file in the project root and configure the required variables:

```env
NEXT_PUBLIC_API_URL=http://localhost:5000

BETTER_AUTH_SECRET=your_better_auth_secret
BETTER_AUTH_URL=http://localhost:3000
NEXT_PUBLIC_BETTER_AUTH_URL=http://localhost:3000

MONGODB_URI=your_mongodb_connection_string
DB_NAME=your_database_name

GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret
```

Use your own credentials. Never commit secret values to GitHub.

### 4. Start the Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

**Note:** The backend server must also be running locally for API-dependent features to work. Configure its environment variables in the backend project.

## 🌐 Live Deployment

- **Frontend:** https://pizzahub-client-blue.vercel.app/
- **Backend API:** https://pizzahub-server-ur8s.onrender.com

## 👨‍💻 Developer

**Rakib Hasan**

- GitHub: [md-rakib-hasan1](https://github.com/md-rakib-hasan1)
- LinkedIn: [Rakib Hasan](https://linkedin.com/in/md-rakib-hasan1)

---

Built with Next.js, Express.js, and MongoDB.
