# 🩸 LifeFlow

<div align="center">

### Blood Donation Management System

[![React](https://img.shields.io/badge/Frontend-React_18-61DAFB?logo=react&logoColor=white)](https://react.dev)
[![Vite](https://img.shields.io/badge/Build-Vite_6-646CFF?logo=vite&logoColor=white)](https://vitejs.dev)
[![Node.js](https://img.shields.io/badge/Backend-Node.js-339933?logo=node.js&logoColor=white)](https://nodejs.org)
[![Express](https://img.shields.io/badge/API-Express_5-000000?logo=express&logoColor=white)](https://expressjs.com)
[![MongoDB](https://img.shields.io/badge/Database-MongoDB-47A248?logo=mongodb&logoColor=white)](https://www.mongodb.com)
[![License](https://img.shields.io/badge/License-ISC-lightgrey)]()

</div>

LifeFlow is a full-stack blood donation platform that connects donors, hospitals, requesters, and administrators in one responsive web app. It supports blood requests, donor discovery, appointments, blood-stock management, certificates, analytics, and role-based dashboards.

## ✨ Highlights

- 🩸 Public landing page with live critical blood request alerts.
- 🔐 Role-based authentication for donor, hospital, requester, and admin accounts.
- 🧭 Dynamic dashboards that change navigation and actions based on the logged-in role.
- 🏥 Hospital blood-stock management with threshold alerts and batch updates.
- 📋 Request creation, request tracking, and emergency broadcast flows.
- 🔍 Donor search and matching tools for hospitals and requesters.
- 🏅 Donation certificates with PDF generation and email delivery.
- 📊 Admin analytics and user management, including block/unblock controls.
- 📱 Responsive UI designed for desktop and mobile.

## 🚀 Core Features By Role

### 🩸 Donor

- Register and sign in as a donor.
- Manage profile details and profile picture.
- Toggle availability for donation.
- View eligibility status, donation history, appointments, and rank.
- Receive donation certificates.

### 🏥 Hospital

- Register and sign in as a hospital.
- Manage hospital profile.
- Initialize and update blood-stock records.
- Set threshold levels and view low-stock alerts.
- View appointments and complete donation appointments.
- Search for donors and create blood requests.

### 💊 Requester / Patient

- Register and sign in as a requester.
- Create blood requests with urgency, units, city, and contact details.
- Track request status.
- Search for donors when needed.
- Update requester profile information.

### 🔐 Admin

- Register with an admin secret key.
- View platform analytics.
- Manage donors and hospitals.
- Block or unblock user accounts.

## 🛠 Tech Stack

### Frontend

- React 18
- Vite 6
- Tailwind CSS 4
- React Router DOM
- Axios
- Lucide React icons
- Radix UI primitives
- Recharts
- Sonner notifications

### Backend

- Node.js
- Express 5
- MongoDB + Mongoose
- JWT authentication
- bcrypt password hashing
- Nodemailer for email notifications
- PDFKit for certificates
- date-fns for date utilities

## 📁 Project Structure

```text
BloodDonation/
├── backend/
│   ├── server.js
│   └── src/
│       ├── controllers/
│       ├── middlewares/
│       ├── models/
│       ├── routes/
│       └── services/
├── frontend/
│   ├── src/
│   │   ├── pages/
│   │   ├── components/
│   │   └── App.jsx
│   └── vite.config.js
└── README.md
```

## ⚙️ Prerequisites

- Node.js 18 or newer
- npm
- MongoDB Atlas or a local MongoDB instance

## 🔧 Environment Variables

Create a `.env` file inside `backend/`:

```env
PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET_KEY=your_jwt_secret
ADMIN_SECRET_KEY=your_admin_secret

SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your_email@example.com
SMTP_PASSWORD=your_email_password
SMTP_FROM="Blood Donation Platform" <your_email@example.com>

FRONTEND_URL=http://localhost:3000
```

If you do not configure SMTP, the app will still run, but email delivery will be skipped.

## ▶️ Local Setup

### 1) Install dependencies

```bash
cd backend
npm install

cd ../frontend
npm install
```

### 2) Start the backend

```bash
cd backend
npm run dev
```

The API runs on the port defined in `.env` and connects to MongoDB.

### 3) Start the frontend

```bash
cd frontend
npm run dev
```

The Vite app runs at `http://localhost:3000` and proxies `/api` requests to the backend at `http://localhost:5000`.

## 📜 Available Scripts

### Backend

- `npm run start` - start the Express server.
- `npm run dev` - start the server with Nodemon.
- `npm run migrate:request-status` - preview the request status migration.
- `npm run migrate:request-status:apply` - apply the request status migration.

### Frontend

- `npm run dev` - start the Vite development server.
- `npm run build` - create a production build.

## 🔗 Main API Areas

### Auth

- `GET /api/auth/me`
- `GET /api/auth/profile`

### Donors

- `POST /api/donors/register/donor`
- `POST /api/donors/login/donor`
- `GET /api/donors/dashboard`
- `POST /api/donors/availability`
- `GET /api/donors/search`
- `GET /api/donors/matching`
- `GET /api/donors/eligibility`
- `GET /api/donors/donations/history`
- `POST /api/donors/donations/record`
- `GET /api/donors/appointments`

### Hospitals

- `POST /api/hospitals/register`
- `POST /api/hospitals/login/hospital`
- `GET /api/hospitals/dashboard`
- `GET /api/hospitals/blood-stock`
- `PUT /api/hospitals/blood-stock`
- `PUT /api/hospitals/blood-stock/threshold`
- `GET /api/hospitals/blood-stock/alerts`
- `GET /api/hospitals/appointments`

### Requesters

- `POST /api/requesters/register`
- `POST /api/requesters/login`
- `GET /api/requesters/dashboard`
- `PUT /api/requesters/profile`

### Requests

- `GET /api/requests/public-critical`
- `POST /api/request`
- `GET /api/requests/me`
- `GET /api/requests/emergency`
- `POST /api/requests/:id/respond`
- `POST /api/requests/:id/complete`
- `POST /api/requests/:id/broadcast`

### Admin

- `POST /api/admins/register/admin`
- `POST /api/admins/login/admin`
- `GET /api/admins/users`
- `PATCH /api/admins/users/:type/:id/block`
- `PATCH /api/admins/users/:type/:id/unblock`

### Certificates and Analytics

- `GET /api/certificates`
- `GET /api/certificates/:donationId`
- `GET /api/certificates/:donationId/download`
- `POST /api/certificates/:donationId/email`
- `GET /api/analytics`
- `GET /api/analytics/blood-stock`
- `GET /api/analytics/donations/trends`
- `GET /api/analytics/requests`
- `GET /api/analytics/quick-stats`

## 🧭 Main User Flows

1. A donor registers, logs in, and manages availability, appointments, and donations.
2. A hospital manages blood stock, creates or monitors requests, and completes appointments.
3. A requester creates a blood request and tracks its status.
4. The admin monitors the platform, reviews analytics, and manages user access.
5. Critical requests are surfaced on the landing page to encourage fast response.

## 🎨 UI Notes

- The interface uses a bright blood-themed gradient palette.
- Icons are powered by Lucide React.
- The layout is responsive and includes role-aware navigation.
- The landing page highlights urgent requests and core platform stats.

## 📦 Deployment Notes

- Update `FRONTEND_URL` before deploying email links.
- Set `CORS` origin in the backend if you deploy the frontend on a different domain.
- Make sure your MongoDB and SMTP credentials are stored securely in environment variables.

## 🤝 Contributing

Contributions are welcome. If you extend the platform, keep the role-based routes, validation, and security checks consistent with the existing structure.

## 📄 License

Licensed under the ISC License.
