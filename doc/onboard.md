# Project Onboarding Guide

This guide explains how to start a new project using this template.

## 1. Clean Up the Template

Before starting your feature implementation, remove the example `User` resource code.

### Delete Files / Directories

- `src/modules/users` (Directory)
- `src/repository/user.repository.ts` (File)
- `src/database/schema/users.ts` (File)
- `src/database/migrations` (Directory) - _Reset migrations for your new project_

### Clean Up Code References

1.  **`src/database/schema/index.ts`**: Remove `export * from './users';`.
2.  **`src/repository/repository.module.ts`**: Remove `UserRepository` from `providers` and `exports`, and remove the import.
3.  **`src/app.module.ts`**: Remove `UserModule` from `imports` and remove the import.

## 2. Development Workflow

### Schema Design

1.  Create new schema files in `src/database/schema/` (e.g., `src/database/schema/posts.ts`).
2.  Export your new schema in `src/database/schema/index.ts`.

### Database Migrations

After modifying your schema:

1.  **Generate Migration**:
    ```bash
    npm run db:generate
    ```
2.  **Run Migration**:
    ```bash
    npm run db:migrate
    ```

### Creating Modules

1.  Create a new module structure inside `src/modules/`.
2.  Connect your new module to `src/app.module.ts`.

### Response Format

All API responses must follow a consistent format using the `Response` service located in `src/common/helpers/response.service.ts`.

#### Success Response

```typescript
{
  success: true,
  statusCode: 200, // or other success codes
  data: { ... },   // payload
  message: "Request successful",
  meta: ...        // optional metadata (e.g. pagination)
}
```

#### Error Response

```typescript
{
  success: false,
  statusCode: 400, // or other error codes
  data: null,
  message: "Request Failed",
  meta: ...
}
```

## 3. Project Structure

A brief overview of the project folders:

- **`src/common`**: Shared utilities, configurations, middleware, and helpers (e.g., `logger.utils.ts`, `response.service.ts`).
- **`src/database`**: Database configuration, Drizzle ORM setup, schema definitions (`schema/`), and migrations (`migrations/`).
- **`src/modules`**: Feature-specific modules (e.g., `users`, `posts`). Each module typically contains its own controller, service, and DTOs.
- **`src/repository`**: Data access layer. Repositories abstract database operations from services.
- **`doc`**: Project documentation.

### Note

Specific onboarding steps may vary depending on the service requirements. This guide provides a general starting point from the template. Also this document will include flow/logic/partial code explanation.
