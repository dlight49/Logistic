# Lumin Logistics Platform

A premium, production-ready logistics management system built with React, Node.js, and Prisma.

## Key Features
- **Role-Based Access Control:** Admin, Driver (Operator), and Customer portals.
- **Local Authentication:** Secure JWT-based auth flow (no Firebase dependency).
- **Real-time Tracking:** Live GPS syncing for drivers and status updates for customers.
- **Premium UI:** Responsive, mobile-first design with motion-enhanced interfaces.

## Getting Started

### Local Development
1. **Clone and Install:**
   ```bash
   npm install
   ```

2. **Environment Setup:**
   Create a `.env` file based on `.env.example`:
   ```env
   DATABASE_URL="your-postgresql-url"
   JWT_SECRET="your-secure-secret"
   RESEND_API_KEY="your-email-api-key"
   APP_URL="http://localhost:5173"
   ```

3. **Database Initialization:**
   ```bash
   npx prisma generate
   npx prisma db push
   npm run seed:admin # Creates root admin: admin@logistics.com / AdminPassword123!
   ```

4. **Launch:**
   ```bash
   npm run dev
   ```

## Deployment

The app is optimized for **Render** and **Neon**.

1. **Database:** Use Neon PostgreSQL for the production database.
2. **Web Service:** Deploy the Node.js backend to Render.
3. **Environment Variables:** Ensure `DATABASE_URL`, `JWT_SECRET`, and `APP_URL` are set in the Render dashboard.

## Tech Stack
- **Frontend:** React, Tailwind CSS, Lucide React, Framer Motion.
- **Backend:** Node.js, Express, JWT, Winston (Logging).
- **Database:** Prisma ORM, PostgreSQL (Neon).
