# ✅ **LearnHub – Full Stack E-Learning Platform**

LearnHub is a full-stack MERN + Stripe-powered online learning platform allowing users to register, log in, browse courses, purchase them securely, and access content after enrollment. 
An AI-powered group discussion simulator that uses Ollama (local LLM) to generate realistic participant conversations. It helps users practice and improve communication and critical thinking by simulating a real group discussion. 

Link for GD:
\
✅ Live Deployment: 🔗 https://elearning-frontend-8iwv.onrender.com
---

## 🚀 **Tech Stack**

### **Frontend**

* React (Vite)
* Axios
* Context API Authentication
* Stripe Checkout Integration

### **Backend**

* Node.js + Express
* MongoDB + Mongoose
* Stripe Server Integration
* JWT Authentication

---

## 📁 **Project Structure**

```
LearnHub/
│
├── back-end/
│   ├── node_modules/
│   ├── .env
│   ├── .gitignore
│   ├── package.json
│   ├── package-lock.json
│   ├── seedCourses.js
│   ├── server.js
│   └── img/
│
├── front-end/
│   ├── src/
│   │   ├── components/
│   │   │   ├── AuthPage.jsx
│   │   │   ├── CourseDetailPage.jsx
│   │   │   ├── CoursesPage.jsx
│   │   │   ├── DashboardPage.jsx
│   │   │   ├── DiscussionPage.jsx
│   │   │   ├── Footer.jsx
│   │   │   ├── HomePage.jsx
│   │   │   ├── LearningPage.jsx
│   │   │   ├── Navbar.jsx
│   │   │   ├── PaymentPage.jsx
│   │   │   └── PaymentSuccessPage.jsx
│   │   │
│   │   ├── context/
│   │   │   └── AuthContext.jsx
│   │   │
│   │   ├── data/
│   │   │   └── courses.json
│   │   │
│   │   ├── App.jsx
│   │   ├── main.jsx
│   │   ├── index.html
│   │   ├── .gitignore
│   │   ├── package.json
│   │   ├── package-lock.json
│   │   └── vite.config.js
│
└── README.md
```

---

## ⚙️ **Backend Environment Variables (`.env`)**

```
PORT=5000
MONGO_URI=your_mongodb_url
JWT_SECRET=your_secret
STRIPE_SECRET_KEY=your_stripe_secret_key
FRONTEND_URL=https://your-frontend-url.com
```

---

## ⚙️ **Frontend Environment Variables**

Create a `.env` file in your frontend root:

```
VITE_BACKEND_URL=https://your-backend-render-url.com
VITE_STRIPE_PUBLIC_KEY=your_stripe_public_key
```

---

## 🧩 **Features Overview**

✅ User registration & login \
✅ JWT Authentication \
✅ Stripe Checkout payment \
✅ Automatic enrollment after successful payment\
✅ Dashboard with purchased courses\
✅ Fully dynamic course loading\
✅ Responsive UI

---

## ⭐ **Deployment Guide**

### **Backend (Render)**

1. Push backend folder to GitHub
2. Create Web Service on Render
3. Set root directory: `back-end`
4. Set build command: `npm install`
5. Set start command: `node server.js`
6. Add environment variables

---

### **Frontend (Render / Netlify / Vercel)**

1. Push frontend folder to GitHub
2. Deploy in Render or Netlify
3. Set publish directory → `dist`
4. Set root directory → `.`
5. Build command:

```
npm run build
```

6. Add environment variable:

```
VITE_BACKEND_URL=https://your-backend-render-url.com
```

---

## 💳 **Stripe Workflow Summary**

1. User clicks **Pay**
2. Frontend → `/create-checkout-session`
3. Stripe redirects user to hosted payment page
4. On success → Stripe redirects to `PaymentSuccessPage.jsx`
5. Frontend calls backend `/confirm-payment`
6. Backend verifies payment → enrolls user
7. Dashboard updates with enrolled course

---

## ✅ **How to Run Locally**

```
# Backend
cd back-end
npm install
node server.js

# Frontend
cd front-end
npm install
npm run dev
```
---

