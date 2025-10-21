# LOTO PEP - Frontend

> 🔒 Lock Out Tag Out (LOTO) Management System - Professional Equipment Protection

A modern, responsive React-based frontend application for managing lockout/tagout procedures with comprehensive multi-language support and intuitive user interface.

[![React](https://img.shields.io/badge/React-18.2.0-61dafb?logo=react)](https://reactjs.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-3.4.18-38bdf8?logo=tailwind-css)](https://tailwindcss.com/)
[![License](https://img.shields.io/badge/license-MIT-blue.svg)](LICENSE)

## 📋 Table of Contents

- [Features](#features)
- [Tech Stack](#tech-stack)
- [Prerequisites](#prerequisites)
- [Installation](#installation)
- [Configuration](#configuration)
- [Running the Application](#running-the-application)
- [Building for Production](#building-for-production)
- [Project Structure](#project-structure)
- [Key Features](#key-features)
- [Internationalization](#internationalization)
- [Contributing](#contributing)

## ✨ Features

### Core Functionality
- 🔐 **Secure Authentication** - JWT-based authentication with role management
- 👥 **Role-Based Access Control** - Admin, Supervisor, and Worker roles
- 📝 **LOTO Procedure Management** - Create, update, and track lockout/tagout procedures
- ⚡ **Equipment & Energy Tracking** - Comprehensive equipment and energy source management
- 📍 **Location-Based Organization** - Organize procedures by facility locations
- 🔄 **Handover Chain Management** - Track procedure handovers with snapshots
- 📊 **Data Export** - Export data to Excel and PDF formats
- 📈 **Analytics Dashboard** - Visual insights into procedures and safety metrics

### User Experience
- 🌐 **Multi-Language Support** - English and Arabic with RTL support
- 📱 **Responsive Design** - Optimized for desktop, tablet, and mobile devices
- 🎨 **Modern UI/UX** - Clean, intuitive interface with Tailwind CSS
- 🔔 **Real-time Notifications** - Toast notifications for user feedback
- 🌓 **Theme Support** - Light and dark mode capabilities
- ⚡ **Fast Performance** - Optimized rendering and lazy loading

## 🛠 Tech Stack

- **React** 18.2.0 - Modern UI library
- **React Router** 6.15.0 - Client-side routing
- **Axios** 1.5.0 - HTTP client for API requests
- **Tailwind CSS** 3.4.18 - Utility-first CSS framework
- **i18next** - Internationalization framework
- **Formik** & **Yup** - Form handling and validation
- **React Toastify** - Toast notifications
- **Recharts** - Data visualization
- **xlsx** - Excel file generation
- **date-fns** - Date manipulation library

## ✅ Prerequisites

Before you begin, ensure you have the following installed:

- **Node.js** 16.x or higher
- **npm** 7.x or higher (or **yarn** 1.22.x or higher)
- A running backend API instance

## 💻 Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/LOTO_PEP.git
   cd LOTO_PEP
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

   Or using yarn:
   ```bash
   yarn install
   ```

## ⚙️ Configuration

Create a `.env.local` file in the root directory:

```env
# API Configuration
REACT_APP_API_URL=http://localhost:5000/api

# Optional: Additional environment variables
# REACT_APP_ENV=production
```

**Note:** A template file `env.local.example` is provided for reference.

### Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| `REACT_APP_API_URL` | Backend API base URL | `http://localhost:5000/api` |

## 🚀 Running the Application

### Development Mode

Start the development server:

```bash
npm start
```

Or with yarn:

```bash
yarn start
```

The application will open automatically at [http://localhost:3000](http://localhost:3000)

### Features in Development Mode
- Hot reload on file changes
- Detailed error messages
- React DevTools support

## 🏗 Building for Production

Create an optimized production build:

```bash
npm run build
```

Or with yarn:

```bash
yarn build
```

The production-ready files will be in the `build/` directory.

### Serving the Production Build

```bash
# Install a static server
npm install -g serve

# Serve the build
serve -s build
```

## 📁 Project Structure

```
frontend/
├── public/                 # Static files
│   ├── index.html         # HTML template
│   └── favicon.ico        # App icon
│
├── src/
│   ├── components/        # Reusable React components
│   │   ├── common/       # Shared components
│   │   ├── layout/       # Layout components
│   │   └── ...
│   │
│   ├── contexts/         # React Context providers
│   │   ├── AuthContext.js
│   │   └── LanguageContext.js
│   │
│   ├── locales/          # Translation files
│   │   ├── en/          # English translations
│   │   └── ar/          # Arabic translations
│   │
│   ├── pages/            # Page components
│   │   ├── Dashboard/
│   │   ├── Login/
│   │   ├── LOTO/
│   │   └── ...
│   │
│   ├── utils/            # Utility functions
│   │   ├── api.js       # API client
│   │   └── helpers.js   # Helper functions
│   │
│   ├── App.js            # Main application component
│   ├── index.js          # Application entry point
│   └── index.css         # Global styles
│
├── .env.local.example    # Environment variables template
├── package.json          # Dependencies and scripts
├── tailwind.config.js    # Tailwind CSS configuration
├── postcss.config.js     # PostCSS configuration
└── README.md            # This file
```

## 🎯 Key Features

### Authentication & Authorization

The application implements a comprehensive authentication system:

- Login with email and password
- JWT token management
- Protected routes based on user roles
- Automatic token refresh
- Secure password handling

### LOTO Procedure Management

Create and manage lockout/tagout procedures with:

- Step-by-step procedure creation
- Equipment association
- Energy source tracking
- Multi-point verification
- Status tracking (Active, Completed, etc.)

### Handover Chain

Track procedure handovers with:

- Chain of custody tracking
- Snapshot creation at each handover
- Historical record maintenance
- Audit trail

### Data Export

Export your data in multiple formats:

- Excel spreadsheets (.xlsx)
- PDF documents
- Customizable export fields
- Batch export capabilities

## 🌐 Internationalization

The application supports multiple languages with full RTL (Right-to-Left) support for Arabic:

### Available Languages
- **English** (en) - Default
- **Arabic** (ar) - With RTL layout

### Adding New Languages

1. Create a new directory in `src/locales/[language-code]/`
2. Add translation JSON files
3. Update `src/i18n.js` configuration
4. Add language switcher option in UI

## 🧪 Testing

Run the test suite:

```bash
npm test
```

Run tests in watch mode:

```bash
npm test -- --watch
```

## 🐳 Docker Support

Build the Docker image:

```bash
docker build -t loto-frontend .
```

Run the container:

```bash
docker run -p 3000:80 loto-frontend
```

## 📝 Scripts

| Script | Description |
|--------|-------------|
| `npm start` | Start development server |
| `npm run build` | Build for production |
| `npm test` | Run test suite |
| `npm run eject` | Eject from Create React App |

## 🤝 Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

### Code Style

- Follow React best practices
- Use functional components with hooks
- Maintain consistent formatting
- Write meaningful commit messages
- Add comments for complex logic

## 🔒 Security

- Never commit sensitive data or API keys
- Use environment variables for configuration
- Keep dependencies up to date
- Follow security best practices
- Report security vulnerabilities responsibly

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 👥 Support

For questions, issues, or feature requests:

- Open an issue on GitHub
- Contact the development team
- Check the documentation

## 🙏 Acknowledgments

- React team for the amazing framework
- Tailwind CSS for the utility-first CSS framework
- All contributors and users of this project

---

**Built with ❤️ for workplace safety and equipment protection**

