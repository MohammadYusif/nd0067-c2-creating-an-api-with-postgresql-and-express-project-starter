# Storefront Backend API

A RESTful API for a storefront application built with Node.js, Express, TypeScript, and PostgreSQL.

## Technologies Used

- **PostgreSQL** - Database
- **Node.js** - Runtime environment
- **Express** - Web framework
- **TypeScript** - Programming language
- **dotenv** - Environment variable management
- **db-migrate** - Database migrations
- **jsonwebtoken** - JWT authentication
- **bcrypt** - Password hashing
- **Jasmine** - Testing framework
- **Supertest** - HTTP testing

## Getting Started

### Prerequisites

- Node.js (v12 or higher)
- PostgreSQL (v12 or higher)
- npm or yarn

### Installation

1. Clone the repository
```bash
git clone <repository-url>
cd nd0067-c2-creating-an-api-with-postgresql-and-express-project-starter
```

2. Install dependencies
```bash
npm install
```

### Database Setup

1. Start PostgreSQL service using Docker
```bash
docker-compose up -d
```

Alternatively, if you have PostgreSQL installed locally, ensure it's running.

2. Create the databases
```bash
# Connect to PostgreSQL
psql -U postgres

# Create databases
CREATE DATABASE storefront_dev;
CREATE DATABASE storefront_test;

# Exit psql
\q
```

3. Configure environment variables

The `.env` file should contain:
```env
POSTGRES_HOST=127.0.0.1
POSTGRES_PORT=5432
POSTGRES_DB=storefront_dev
POSTGRES_TEST_DB=storefront_test
POSTGRES_USER=postgres
POSTGRES_PASSWORD=postgres
BCRYPT_PASSWORD=my-secret-pepper-2024
SALT_ROUNDS=10
TOKEN_SECRET=my-super-secret-jwt-token-2024
ENV=dev
```

**Note:** For submission purposes, the `.env` file is included, but in production, this file should be in `.gitignore` and never committed.

4. Run database migrations
```bash
npm run migrate:up
```

To reset the database:
```bash
npm run migrate:reset
```

### Running the Application

#### Development Mode (with auto-reload)
```bash
npm run watch
```

#### Production Mode
```bash
npm run tsc
npm start
```

The server will start on `http://localhost:3000`

### Running Tests

```bash
npm test
```

This will:
1. Set the environment to test mode
2. Run migrations on the test database
3. Execute all Jasmine test suites
4. Reset the test database

## Ports

- **Backend API**: Port 3000
- **PostgreSQL Database**: Port 5432

## Project Structure

```
src/
├── database.ts           # Database connection
├── server.ts            # Express app configuration
├── models/              # Database models
│   ├── user.ts
│   ├── product.ts
│   └── order.ts
├── handlers/            # Route handlers
│   ├── users.ts
│   ├── products.ts
│   └── orders.ts
├── middleware/          # Custom middleware
│   └── auth.ts
└── tests/              # Test suites
    ├── userSpec.ts
    ├── productSpec.ts
    ├── orderSpec.ts
    ├── userEndpointSpec.ts
    ├── productEndpointSpec.ts
    └── orderEndpointSpec.ts
```

## Available Scripts

- `npm run watch` - Start development server with auto-reload
- `npm run tsc` - Compile TypeScript to JavaScript
- `npm start` - Start production server
- `npm test` - Run test suite
- `npm run migrate:up` - Run database migrations
- `npm run migrate:down` - Rollback last migration
- `npm run migrate:reset` - Reset all migrations

## API Endpoints

See [REQUIREMENTS.md](REQUIREMENTS.md) for detailed API documentation including:
- All available endpoints
- HTTP methods
- Request/response formats
- Authentication requirements
- Database schema

## Authentication

This API uses JWT (JSON Web Tokens) for authentication. To access protected routes:

1. Create a user or authenticate via `/users` or `/users/authenticate`
2. Use the returned token in the Authorization header:
```
Authorization: Bearer <your-token>
```

## Security Features

- Password hashing with bcrypt and salt
- JWT-based authentication
- Environment variables for sensitive data
- Protected routes with authentication middleware
