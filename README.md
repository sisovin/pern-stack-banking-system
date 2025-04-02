# PERN Stack Banking System

A comprehensive banking system built using the PERN stack (PostgreSQL, Express, React, Node.js).

## Project Structure

This project is organized into two main parts:

- \`backend/\`: Express.js API with PostgreSQL database using Drizzle ORM
- \`frontend/\`: React application with TypeScript, Material-UI and Tailwind CSS

## Getting Started

### Prerequisites

- Node.js (v18 or later)
- PostgreSQL (v14 or later)
- npm or yarn

### Installation

1. Clone the repository:
   \`\`\`bash
   git clone <repository-url>
   cd pern-stack-banking-system
   \`\`\`

2. Install dependencies:
   \`\`\`bash
   npm run install:all
   \`\`\`

3. Configure environment variables:
   - Create \`.env\` files in both \`backend/\` and \`frontend/\` directories
   - See the README in each directory for required variables

### Running the Application

Start both the backend and frontend:
\`\`\`bash
npm start
\`\`\`

Or run them separately:
\`\`\`bash
npm run start:backend
npm run start:frontend
\`\`\`

## Features

- User authentication and authorization
- Account management
- Transaction processing
- Financial reporting
- Double-entry accounting
- API documentation
- User roles and permissions


## Full Project Structure

The project structure provides a comprehensive file/folder structure for your PERN Stack Banking System that supports both the backend and frontend requirements. The structure will incorporate TypeScript, Redux for state management, Material-UI with Tailwind CSS, unit testing, internationalization, responsive design, JWT authentication, and file upload capabilities.

### Root Directory Structure

```
pern-stack-banking-system/
├── .github/                      # GitHub Actions workflows for CI/CD
├── backend/                      # Backend Express application
├── frontend/                     # Frontend React application
├── shared/                       # Shared TypeScript interfaces/types
├── .gitignore                    # Git ignore file
├── README.md                     # Project README
├── docker-compose.yml            # Docker setup for development
└── package.json                  # Root package.json for workspace scripts
```

### Backend Structure

```
backend/
├── src/
│   ├── config/                   # Configuration files
│   │   ├── database.ts           # Database connection configuration
│   │   ├── jwt.ts                # JWT configuration
│   │   ├── logging.ts            # Logging configuration
│   │   └── env.ts                # Environment variables management
│   │
│   ├── controllers/              # Request handlers
│   │   ├── auth/                 # Authentication controllers
│   │   ├── users/                # User management controllers
│   │   ├── accounts/             # Account management controllers
│   │   ├── customers/            # Customer management controllers
│   │   ├── transactions/         # Transaction controllers
│   │   ├── accounting/           # Accounting system controllers
│   │   └── reports/              # Reporting controllers
│   │
│   ├── db/                       # Database related files
│   │   ├── migrations/           # Drizzle migrations
│   │   ├── schema/               # Drizzle schema definitions
│   │   │   ├── users.ts
│   │   │   ├── roles.ts
│   │   │   ├── accounts.ts
│   │   │   ├── customers.ts
│   │   │   ├── transactions.ts
│   │   │   ├── journalEntries.ts
│   │   │   └── ...
│   │   ├── index.ts              # Database connection
│   │   └── seed.ts               # Seed data for development
│   │
│   ├── middleware/               # Express middleware
│   │   ├── auth.ts               # Authentication middleware
│   │   ├── rbac.ts               # Role-based access control
│   │   ├── validation.ts         # Request validation
│   │   ├── errorHandler.ts       # Error handling
│   │   └── audit.ts              # Audit logging middleware
│   │
│   ├── models/                   # Business logic models
│   │   ├── user.ts
│   │   ├── role.ts
│   │   ├── account.ts
│   │   ├── customer.ts
│   │   ├── transaction.ts
│   │   ├── journalEntry.ts
│   │   └── ...
│   │
│   ├── routes/                   # API route definitions
│   │   ├── auth.ts
│   │   ├── users.ts
│   │   ├── accounts.ts
│   │   ├── customers.ts
│   │   ├── transactions.ts
│   │   └── ...
│   │
│   ├── services/                 # Business logic services
│   │   ├── auth/                 # Authentication services
│   │   ├── user/                 # User services
│   │   ├── account/              # Account services
│   │   ├── transaction/          # Transaction services
│   │   ├── accounting/           # Accounting services
│   │   └── ...
│   │
│   ├── utils/                    # Utility functions
│   │   ├── passwords.ts          # Password hashing (Argon2)
│   │   ├── tokens.ts             # JWT handling
│   │   ├── validation.ts         # Input validation
│   │   └── ...
│   │
│   ├── types/                    # TypeScript type definitions
│   │   ├── express.d.ts          # Express type extensions
│   │   └── ...
│   │
│   ├── app.ts                    # Express app setup
│   └── server.ts                 # Server entry point
│
├── tests/                        # Test files
│   ├── unit/                     # Unit tests
│   ├── integration/              # Integration tests
│   └── e2e/                      # End-to-end tests
│
├── .env.example                  # Example environment variables
├── .eslintrc.js                  # ESLint configuration
├── jest.config.js                # Jest configuration
├── nodemon.json                  # Nodemon configuration
├── package.json                  # Dependencies and scripts
├── tsconfig.json                 # TypeScript configuration
└── README.md                     # Backend documentation
```

### Frontend Structure (React with Vite)

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

### Shared Types Directory

```
shared/
├── src/
│   ├── interfaces/               # Shared interfaces
│   │   ├── auth.ts
│   │   ├── user.ts
│   │   ├── account.ts
│   │   ├── transaction.ts
│   │   └── ...
│   │
│   ├── enums/                    # Shared enums
│   │   ├── accountTypes.ts
│   │   ├── transactionTypes.ts
│   │   ├── userRoles.ts
│   │   └── ...
│   │
│   └── index.ts                  # Export all shared types
│
├── package.json                  # Package configuration
└── tsconfig.json                 # TypeScript configuration
```

### Key Features of this Structure

1. **TypeScript Integration**: Both backend and frontend use TypeScript for type safety.

2. **Redux Setup**: Frontend includes a full Redux setup with slices for different features.

3. **UI Components**: Structured for Material-UI with Tailwind integration.

4. **Responsive Design**: Framework for responsive components with mobile support.

5. **Internationalization**: Includes locales directory for i18n support.

6. **Authentication**: JWT token handling in both backend and frontend.

7. **File Upload**: Backend structure supports file upload features.

8. **Testing**: Comprehensive test structure for all parts of the application.

9. **Network Configuration**: Can be set up for viewing from the specific IP (192.168.50.131).

10. **Modular Structure**: Clear separation of concerns with domain-driven organization.
