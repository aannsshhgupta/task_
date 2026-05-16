# 📋 Team Task Manager (TaskFlow)

A full-stack MERN application for managing team projects and tasks with role-based access control.

## 🚀 Getting Started

### Prerequisites
- Node.js v18+
- MongoDB Atlas account (or local MongoDB)

### Backend Setup

```bash
cd backend
npm install
```

Update `.env` with your MongoDB URI and JWT secret:
```
MONGO_URI=mongodb+srv://<user>:<password>@cluster0.mongodb.net/taskmanager
JWT_SECRET=your_super_secret_key
```

```bash
npm run dev
```

### Frontend Setup

```bash
cd frontend
npm install
npm run dev
```

Open http://localhost:5173

## � Environment files
- Copy `backend/.env.example` to `backend/.env`
- Copy `frontend/.env.example` to `frontend/.env`

## 🚀 Deployment
### GitHub
1. Initialize git in the repo root:
   ```bash
git init
   ```
2. Add files and commit:
   ```bash
git add .
git commit -m "Initial project setup"
   ```
3. Create a GitHub repo and add it as a remote:
   ```bash
git remote add origin https://github.com/<your-username>/<repo-name>.git
   git push -u origin main
   ```

### Railway
- Create one Railway service for the backend using the `backend` directory.
- Set these environment variables in Railway: `MONGO_URI`, `JWT_SECRET`, `CLIENT_URL`.
- For the frontend, create a separate Railway static site service and use the `frontend` directory.
- Set `VITE_API_URL` in the frontend Railway environment to the backend service URL with `/api` appended.

## �🔐 Roles

| Role   | Permissions |
|--------|-------------|
| Admin  | Create/edit/delete projects & tasks, assign members |
| Member | View projects they belong to, update status of their tasks |

## 📁 Tech Stack

- **Frontend**: React, Vite, Tailwind CSS, React Router, Axios
- **Backend**: Node.js, Express, MongoDB, Mongoose, JWT
