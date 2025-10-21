# LOTO Management System

A comprehensive Lock Out Tag Out (LOTO) management system for tracking and managing lockout/tagout procedures with multi-language support (English/Arabic).

## 📋 Table of Contents

- [Overview](#overview)
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Prerequisites](#prerequisites)
- [Installation](#installation)
- [Configuration](#configuration)
- [Running the Application](#running-the-application)
- [Deployment](#deployment)
- [Documentation](#documentation)
- [Features](#features)

## 🔍 Overview

This LOTO Management System provides a complete solution for managing lockout/tagout procedures with features including:
- User authentication and role-based access control
- LOTO procedure creation and management
- Equipment and energy source tracking
- Handover chain management with snapshots
- Export functionality
- Multi-language support (English/Arabic with RTL)
- Responsive design

## 🛠 Tech Stack

### Backend
- **Node.js** with Express.js
- **MongoDB** with Mongoose ODM
- **JWT** for authentication
- **bcryptjs** for password hashing
- **Helmet** for security headers

### Frontend
- **React** 18.2.0
- **React Router** for navigation
- **Axios** for API calls
- **Tailwind CSS** for styling
- **i18next** for internationalization
- **Formik** & **Yup** for form handling and validation
- **React Toastify** for notifications
- **xlsx** for Excel exports

### Deployment
- **Docker** & **Docker Compose**
- **Nginx** as reverse proxy

## 📁 Project Structure

```
loto_management-system/
├── backend/                 # Backend API
│   ├── src/
│   │   ├── config/         # Configuration files
│   │   ├── controllers/    # Route controllers
│   │   ├── middleware/     # Custom middleware
│   │   ├── models/         # Mongoose models
│   │   └── routes/         # API routes
│   ├── scripts/            # Utility scripts
│   ├── Dockerfile
│   └── package.json
│
├── frontend/               # React frontend
│   ├── public/            # Static files
│   ├── src/
│   │   ├── components/    # React components
│   │   ├── contexts/      # React contexts
│   │   ├── locales/       # Translation files
│   │   ├── pages/         # Page components
│   │   └── utils/         # Utility functions
│   ├── Dockerfile
│   └── package.json
│
├── nginx/                 # Nginx configuration
│   └── nginx.conf
│
├── docs/                  # Documentation
├── docker-compose.yml     # Docker compose configuration
├── deploy-backend.sh      # Backend deployment script
├── deploy-frontend.sh     # Frontend deployment script
└── README.md
```

## ✅ Prerequisites

- **Node.js** 16.x or higher
- **npm** or **yarn**
- **MongoDB** 5.x or higher
- **Docker** and **Docker Compose** (for deployment)

## 💻 Installation

### Local Development Setup

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd loto_management-system
   ```

2. **Install Backend Dependencies**
   ```bash
   cd backend
   npm install
   ```

3. **Install Frontend Dependencies**
   ```bash
   cd ../frontend
   npm install
   ```

## ⚙️ Configuration

### Backend Configuration

Create a `.env` file in the `backend` directory:

```env
# Server Configuration
PORT=5000
NODE_ENV=development

# MongoDB
MONGODB_URI=mongodb://localhost:27017/loto_management

# JWT
JWT_SECRET=your-secret-key-here
JWT_EXPIRES_IN=7d

# CORS
CORS_ORIGIN=http://localhost:3000
```

### Frontend Configuration

Create a `.env.local` file in the `frontend` directory:

```env
REACT_APP_API_URL=http://localhost:5000/api
```

A template is provided as `frontend/env.local.example`.

## 🚀 Running the Application

### Development Mode

1. **Start MongoDB**
   ```bash
   # If using local MongoDB
   mongod
   
   # Or using Docker
   docker run -d -p 27017:27017 --name mongodb mongo:latest
   ```

2. **Start Backend**
   ```bash
   cd backend
   npm run dev
   ```
   Backend will run on `http://localhost:5000`

3. **Start Frontend**
   ```bash
   cd frontend
   npm start
   ```
   Frontend will run on `http://localhost:3000`

### Production Mode (Docker)

```bash
# Build and start all services
docker-compose up -d

# View logs
docker-compose logs -f

# Stop services
docker-compose down
```

## 🚢 Deployment

### Using Deployment Scripts

1. **Backend Deployment**
   ```bash
   ./deploy-backend.sh
   ```

2. **Frontend Deployment**
   ```bash
   ./deploy-frontend.sh
   ```

### Manual Docker Deployment

```bash
# Build images
docker-compose build

# Start services
docker-compose up -d

# Check status
docker-compose ps
```

## 📚 Documentation

Comprehensive documentation is available in the `/docs` directory:

### Setup & Configuration
- `LOCAL_DEVELOPMENT_SETUP.md` - Local development guide
- `DEPLOYMENT_GUIDE_AUTH_UPGRADE.md` - Deployment instructions
- `LOCATION_MANAGEMENT_SETUP.md` - Location setup guide

### Features
- `AUTHENTICATION_SECURITY_UPGRADE.md` - Authentication system
- `SNAPSHOT_SYSTEM_OVERVIEW.md` - Snapshot feature overview
- `HANDOVER_CHAIN_COMPLETE_SUMMARY.md` - Handover management
- `CASCADE_DELETE_FEATURE.md` - Cascade delete functionality
- `DATA_EXPORT_REBUILD.md` - Export system documentation
- `FLEXIBLE_HIERARCHY_FEATURE.md` - Hierarchy management

### User Guides
- `QUICK_REFERENCE.md` - Quick reference guide
- `SNAPSHOT_QUICK_REFERENCE.md` - Snapshot feature guide
- `DYNAMIC_LABELS_GUIDE.md` - Label management
- `VISIBILITY_FEATURE_FINAL.md` - Visibility controls

### Technical Documentation
- `NESTED_TABLE_VISUAL_GUIDE.md` - Table structure
- `SIDEBAR_CONVERSION.md` - Navigation implementation
- `TRANSLATIONS_ADDED.md` - i18n implementation

## ✨ Features

### Core Features
- ✅ User authentication with JWT
- ✅ Role-based access control (Admin, Supervisor, Worker)
- ✅ LOTO procedure creation and management
- ✅ Equipment and energy source tracking
- ✅ Location-based organization
- ✅ Handover chain with snapshots
- ✅ Rich data export (Excel, PDF)

### UI/UX
- ✅ Responsive design
- ✅ Multi-language support (EN/AR)
- ✅ RTL support for Arabic
- ✅ Dark/light theme support
- ✅ Toast notifications
- ✅ Modern, clean interface

### Security
- ✅ Password hashing with bcrypt
- ✅ JWT-based authentication
- ✅ HTTP security headers (Helmet)
- ✅ CORS configuration
- ✅ Input validation
- ✅ Role-based authorization

## 🔑 Default Users

After running the setup scripts, the following test users are available:

- **Admin**: admin@example.com / password123
- **Supervisor**: supervisor@example.com / password123
- **Worker**: worker@example.com / password123

## 🛠 Maintenance

### Database Backup
```bash
# Export database
mongodump --uri="mongodb://localhost:27017/loto_management" --out=./backup

# Restore database
mongorestore --uri="mongodb://localhost:27017/loto_management" ./backup/loto_management
```

### View Logs
```bash
# Backend logs
docker-compose logs -f backend

# Frontend logs
docker-compose logs -f frontend

# All logs
docker-compose logs -f
```

## 📝 License

[Add your license information here]

## 👥 Contributors

[Add contributor information here]

## 📧 Contact

For questions or support, please contact [add contact information].

---

**Note**: Before deploying to production, ensure you:
1. Change all default credentials
2. Set secure JWT secrets
3. Configure proper MongoDB connection strings
4. Enable HTTPS
5. Review and update CORS settings
6. Set up proper backup procedures



