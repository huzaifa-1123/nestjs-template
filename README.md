# NestJS Template

This is a **NestJS** application template configured with **Drizzle ORM**, **PostgreSQL**, **Pino Logger**, and **gRPC** microservices support.

## Tech Stack

- **Framework:** [NestJS](https://nestjs.com/)
- **Microservices:** gRPC with @nestjs/microservices
- **Database:** [PostgreSQL](https://www.postgresql.org/)
- **ORM:** [Drizzle ORM](https://orm.drizzle.team/)
- **Logging:** [Pino](https://getpino.io/)
- **Validation:** class-validator & class-transformer
- **Environment:** dotenv

## Architecture

This template supports **hybrid mode**, running both:
- **REST API** (HTTP) on port 3000 (configurable)
- **gRPC Server** on port 5000 (configurable)

### Key Features

✅ gRPC server with authentication guards  
✅ REST API with health check endpoints  
✅ User context validation in gRPC headers  
✅ Type-safe proto file definitions  
✅ Database integration with Drizzle ORM  
✅ Structured logging with Pino  

## Prerequisites

- Node.js (v18+)
- PostgreSQL Database
- pnpm (recommended) or npm

## Getting Started

### 1. Install Dependencies

```bash
pnpm install
# or
npm install
```

### 2. Environment Configuration

Create a `.env` file in the root directory and configure the following variables:

```env
NODE_ENV=development

# HTTP Server
PORT=3000

# gRPC Server
GRPC_PORT=5000

# Logging
LOG_LEVEL=info
TZ=UTC

# Database
DB_URI="postgresql://username:password@localhost:5432/database_name"
```

### 3. Database Setup

Generate migrations and migrate the database:

pnpm start:dev
# or
npm run start:dev

# Production mode
pnpm start:prod
# or
npm run start:prod
```

The application will start:
- **HTTP Server** at `http://localhost:3000`
- **gRPC Server** at `localhost:5000`

### 5. Testing the Services

#### REST API Health Check
```bash
curl http://localhost:3000/api/health
```
pnpm build` / `npm run build`: Build the application
- `pnpm start:dev` / `npm run start:dev`: Start in development mode
- `pnpm start:prod` / `npm run start:prod`: Start in production mode
- `pnpm format` / `npm run format`: Format code with Prettier
- `pnpm lint` / `npm run lint`: Lint code with ESLint
- `pnpm db:generate` / `npm run db:generate`: Generate database migrations
- `pnpm db:migrate` / `npm run db:migrate`: Run database migrations
- `pnpm db:studio` / `npm run db:studio`: Open Drizzle Studio

## Project Structure

```
src/
├── common/
│   ├── types/              # Shared types and enums
│   ├── guards/             # gRPC and HTTP guards
│   ├── decorators/         # Custom decorators
│   ├── filters/            # Exception filters
│   └── middleware/         # HTTP middleware
├── modules/
│   ├── health/             # Health check endpoints (REST)
│   ├── example/            # Example gRPC service
│   └── grpc-client/        # gRPC client for calling other services
├── database/               # Database configuration
└── repository/             # Data access layer

proto/
├── common.proto            # Shared proto definitions
└── example.proto           # Example service definitions

examples/
└── grpc-client.example.ts  # gRPC client usage examples
```

## Documentation

- [Onboarding Guide](./doc/onboard.md)
- [gRPC Setup & Usage](./doc/grpc-setup.md)

## Development Guidelines

### Creating New gRPC Services

1. Create proto file in `proto/` directory
2. Create controller with `@GrpcMethod()` decorators
3. Apply `@UseGuards(GrpcAuthGuard)` for authentication
4. Use `@GrpcUserDecorator()` to access user context
5. Add service to `app.module.ts`

See [gRPC Setup Documentation](./doc/grpc-setup.md) for detailed instructions.

### REST API Endpoints

- All REST endpoints use `/api` prefix
- Health checks: `/api/health` and `/api/health/status`
- Global exception filter handles all errors
- Validation pipes enabled globally
```json
{
  "uuid": "string",
  "email": "string",
  "userPermission": "ADMIN" | "USER" | "MODERATOR" | "GUEST"
}
```

This is validated by the `GrpcAuthGuard`. See [gRPC Setup Documentation](./doc/grpc-setup.md) for details.un migrations
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
