# NestJS Template

This is a **NestJS** application template configured with **Drizzle ORM**, **PostgreSQL**, and **Pino Logger**.

## Tech Stack

- **Framework:** [NestJS](https://nestjs.com/)
- **Database:** [PostgreSQL](https://www.postgresql.org/)
- **ORM:** [Drizzle ORM](https://orm.drizzle.team/)
- **Logging:** [Pino](https://getpino.io/)
- **Validation:** class-validator & class-transformer
- **Environment:** dotenv

## Prerequisites

- Node.js
- PostgreSQL Database

## Getting Started

### 1. Install Dependencies

```bash
npm install
```

### 2. Environment Configuration

Create a `.env` file in the root directory and configure the following variables:

```env
NODE_ENV=development
PORT=3000
LOG_LEVEL=info
DB_URI="postgresql://username:password@localhost:5432/database_name"
```

### 3. Database Setup

Generate migrations and migrate the database:

```bash
# Generate migrations
npm run db:generate

# Run migrations
npm run db:migrate
```

### 4. Running the Application

```bash
# Development mode
npm run start:dev

# Production mode
npm run start:prod
```

## Scripts

- `npm run build`: Build the application
- `npm run format`: Format code with Prettier
- `npm run lint`: Lint code with ESLint
- `npm run test`: Run tests

## Onboard Doc

- [Onboard Doc](./doc/onboard.md)
