# 🔁 Skill Swap Platform

A full-stack MERN application where users can **exchange skills without any monetary cost**. Users can offer skills they have and request skills they want, creating a collaborative learning ecosystem.

---

Live Project: https://skill-swap-blond.vercel.app/

## 🚀 Features

* 🔐 User Authentication (Register/Login)
* 👤 User Profiles with skills offered & wanted
* 🔍 Browse other users
* 🔄 Send & receive skill swap requests
* 💬 Chat system between users
* 📜 Swap history tracking
* 📊 Dashboard for managing activity

---

## 🛠️ Tech Stack

### Frontend

* React.js (Vite)
* Tailwind CSS
* Axios

### Backend

* Node.js
* Express.js
* MongoDB (Mongoose)

---

## 📁 Project Structure

```
Skill-Swap/
│
├── backend/
│   ├── config/
│   ├── controllers/
│   ├── middleware/
│   ├── models/
│   ├── routes/
│   ├── .env
│   └── server.js
│
├── frontend/
│   ├── public/
│   ├── src/
│   │   ├── api/
│   │   ├── components/
│   │   ├── context/
│   │   ├── pages/
│   │   └── App.jsx
│   └── vite.config.js
│
├── .gitignore
├── README.md
└── package.json
```

---

## ⚙️ Installation & Setup

### 1️⃣ Clone the repository

```
git clone https://github.com/Kaushal2644/Skill-Swap.git
cd Skill-Swap
```

---

### 2️⃣ Backend Setup

```
cd backend
npm install
```

Create a `.env` file inside backend:

```
PORT=5000
MONGO_URI=your_mongodb_connection
JWT_SECRET=your_secret_key
```

Run backend:

```
npm run dev
```

---

### 3️⃣ Frontend Setup

```
cd frontend
npm install
npm run dev
```

---

## 🔑 Key Functionalities

* Users can **offer skills** (e.g., Web Development, Design)
* Users can **request skills** (e.g., Learning Java, UI/UX)
* Match users based on skills
* Send and manage swap requests
* Real-time or session-based chat system

---

## 🧠 Future Improvements

* 🌍 Deployment (Vercel + Render)
* 🔔 Notifications system
* ⭐ Rating & feedback system
* 📱 Mobile responsiveness improvements
* 🤖 Skill recommendation system

---

## 🤝 Contributing

Contributions are welcome!

1. Fork the repo
2. Create a new branch
3. Make your changes
4. Submit a Pull Request

---

## 📄 License

This project is licensed under the MIT License.

---

## 💡 Inspiration

"Learn and grow together by exchanging skills — not money."

---

## 👨‍💻 Author

**Kaushal Patel**

* GitHub: https://github.com/Kaushal2644

---
