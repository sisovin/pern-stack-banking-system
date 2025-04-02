# PERN Stack Banking System - Frontend

This is the frontend application for the PERN Stack Banking System, built with React, TypeScript, Tailwind CSS, and Mantine UI components.

## Overview

The frontend provides user interfaces for:
- Customer banking portal
- Admin dashboard
- Teller operations interface
- Account management
- Transaction processing
- Financial reporting

## Project Structure

The project follows a feature-based organization:

```
frontend/
├── src/
│   ├── api/           # API integration with backend
│   ├── assets/        # Static assets (images, icons)
│   ├── components/    # Reusable UI components
│   ├── contexts/      # React context providers
│   ├── features/      # Feature-specific components and logic
│   ├── hooks/         # Custom React hooks
│   ├── layouts/       # Page layout components
│   ├── pages/         # Route-level page components
│   ├── services/      # Business logic services
│   ├── store/         # State management (Redux)
│   ├── types/         # TypeScript type definitions
│   └── utils/         # Utility functions
│   
├── App.tsx           # Main application component
├── main.tsx          # Application entry point
└── routes.tsx        # Application routing configuration
```

## Frontend Structure (React with Vite)

```
frontend/
├── public/                       # Static assets
│   ├── favicon.ico
│   ├── locales/                  # i18n translation files
│   │   ├── en/
│   │   └── ...
│   └── ...
│
├── src/
│   ├── assets/                   # Images, fonts, etc.
│   │
│   ├── components/               # Reusable components
│   │   ├── common/               # Shared components
│   │   │   ├── Button/
│   │   │   ├── Card/
│   │   │   ├── Modal/
│   │   │   └── ...
│   │   ├── layout/               # Layout components
│   │   │   ├── Header/
│   │   │   ├── Sidebar/
│   │   │   ├── Footer/
│   │   │   └── ...
│   │   ├── auth/                 # Auth-related components
│   │   ├── accounts/             # Account components
│   │   ├── transactions/         # Transaction components
│   │   └── ...
│   │
│   ├── config/                   # Configuration
│   │   ├── api.ts                # API configuration
│   │   └── theme.ts              # MUI theme configuration
│   │
│   ├── features/                 # Redux slices and features
│   │   ├── auth/                 # Authentication slice
│   │   ├── users/                # Users slice
│   │   ├── accounts/             # Accounts slice
│   │   ├── transactions/         # Transactions slice
│   │   └── ...
│   │
│   ├── hooks/                    # Custom hooks
│   │   ├── useAuth.ts
│   │   ├── useAccounts.ts
│   │   └── ...
│   │
│   ├── layouts/                  # Page layouts
│   │   ├── MainLayout.tsx
│   │   ├── AuthLayout.tsx
│   │   └── ...
│   │
│   ├── pages/                    # Page components
│   │   ├── auth/                 # Auth pages
│   │   │   ├── Login.tsx
│   │   │   ├── Register.tsx
│   │   │   └── ...
│   │   ├── dashboard/            # Dashboard pages
│   │   ├── accounts/             # Account pages
│   │   ├── customers/            # Customer pages
│   │   ├── transactions/         # Transaction pages
│   │   ├── reports/              # Report pages
│   │   └── ...
│   │
│   ├── services/                 # API services
│   │   ├── api.ts                # Base API setup with axios
│   │   ├── authService.ts
│   │   ├── accountService.ts
│   │   ├── transactionService.ts
│   │   └── ...
│   │
│   ├── store/                    # Redux store
│   │   ├── index.ts              # Store configuration
│   │   └── rootReducer.ts        # Root reducer
│   │
│   ├── types/                    # TypeScript types
│   │   ├── auth.ts
│   │   ├── user.ts
│   │   ├── account.ts
│   │   └── ...
│   │
│   ├── utils/                    # Utility functions
│   │   ├── auth.ts               # Auth utilities
│   │   ├── formatters.ts         # Data formatters
│   │   ├── validation.ts         # Form validation
│   │   └── ...
│   │
│   ├── App.tsx                   # Main App component
│   ├── main.tsx                  # Entry point
│   ├── routes.tsx                # Route definitions
│   └── vite-env.d.ts             # Vite type definitions
│
├── tests/                        # Test files
│   ├── unit/                     # Unit tests
│   ├── integration/              # Integration tests
│   └── e2e/                      # End-to-end tests (Cypress)
│
├── .env.example                  # Example environment variables
├── .eslintrc.js                  # ESLint configuration
├── index.html                    # HTML entry point
├── jest.config.js                # Jest configuration
├── package.json                  # Dependencies and scripts
├── postcss.config.js             # PostCSS configuration for Tailwind
├── tailwind.config.js            # Tailwind CSS configuration
├── tsconfig.json                 # TypeScript configuration
├── vite.config.ts                # Vite configuration
└── README.md                     # Frontend documentation
```

## Getting Started

### Prerequisites

- Node.js (v18 or later)
- npm or yarn
- Backend API running

### Installation

1. Install dependencies:
   ```bash
   npm install
   ```

2. Create a `.env` file with the following variables:
   ```
   VITE_API_URL=http://localhost:3000/api
   ```

### Development

To start the development server:

```bash
npm run dev
```

This will start the application in development mode at http://localhost:5173.

### Building for Production

To build the application for production:

```bash
npm run build
```

The built files will be in the `dist` directory.

## Features

### Authentication
- User login/registration
- JWT token management
- Role-based access control

### Banking Operations
- Account management
- Transaction processing
- Fund transfers
- Statement generation

### Administration
- User management
- Role assignment
- System monitoring
- Audit trail review

### Reporting
- Financial statements
- Transaction reports
- Customer activity reports

## Technologies Used

- React 19
- TypeScript
- Vite
- Tailwind CSS
- Mantine UI Components
- React Router
- Axios
- React Query
- Formik & Yup

## Testing

Run unit tests with:

```bash
npm test
```

## Contributing

1. Follow the established code style and organization
2. Write tests for new features
3. Keep components small and focused
4. Use TypeScript types for all components and functions
