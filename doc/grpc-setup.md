# gRPC Service Configuration

This is a NestJS-based gRPC service that supports both REST API and gRPC communication.

## Features

- **Hybrid Service**: Supports both REST API (HTTP) and gRPC
- **gRPC Authentication**: Guards validate user metadata in gRPC headers
- **Health Check**: REST API endpoints for service status
- **Type Safety**: Full TypeScript support with proto file definitions

## Architecture

### REST API
- **Port**: 3000 (default, configurable via `PORT` env variable)
- **Base Path**: `/api`
- **Health Endpoints**:
  - `GET /api/health` - Basic health check
  - `GET /api/health/status` - Detailed status with uptime

### gRPC Service
- **Port**: 5000 (default, configurable via `GRPC_PORT` env variable)
- **Proto Files**: Located in `/proto` directory
- **Services**: 
  - ExampleService (sample implementation)

## gRPC Authentication

All gRPC methods are protected by `GrpcAuthGuard`, which validates the presence of a user object in the request metadata.

### Required User Metadata

Every gRPC request must include a `user` header with the following JSON structure:

```json
{
  "uuid": "string",
  "email": "string",
  "userPermission": "ADMIN" | "USER" | "MODERATOR" | "GUEST"
}
```

### Example: Calling gRPC Service

#### From Node.js/NestJS Client
```typescript
import { ClientProxyFactory, Transport } from '@nestjs/microservices';
import { join } from 'path';

const client = ClientProxyFactory.create({
  transport: Transport.GRPC,
  options: {
    package: ['example', 'common'],
    protoPath: [
      join(__dirname, '../proto/example.proto'),
      join(__dirname, '../proto/common.proto'),
    ],
    url: 'localhost:5000',
  },
});

await client.connect();

// Prepare user metadata
const user = {
  uuid: '123e4567-e89b-12d3-a456-426614174000',
  email: 'user@example.com',
  userPermission: 'ADMIN',
};

const metadata = new Map();
metadata.set('user', JSON.stringify(user));

// Make the call
const result = await client
  .send('ExampleService.GetExample', { id: '1' }, { metadata })
  .toPromise();
```

#### From Other Languages (Python, Go, etc.)
```python
import grpc
import json
import example_pb2
import example_pb2_grpc

# Create channel
channel = grpc.insecure_channel('localhost:5000')
stub = example_pb2_grpc.ExampleServiceStub(channel)

# Prepare user metadata
user = {
    'uuid': '123e4567-e89b-12d3-a456-426614174000',
    'email': 'user@example.com',
    'userPermission': 'ADMIN'
}

metadata = [('user', json.dumps(user))]

# Make the call
response = stub.GetExample(
    example_pb2.GetExampleRequest(id='1'),
    metadata=metadata
)
```

## Project Structure

```
src/
├── common/
│   ├── types/
│   │   ├── user-permission.enum.ts    # User permission enum
│   │   └── grpc-user.interface.ts     # gRPC user interface
│   ├── guards/
│   │   └── grpc-auth.guard.ts         # gRPC authentication guard
│   └── decorators/
│       └── grpc-user.decorator.ts     # Extract user from metadata
├── modules/
│   ├── health/
│   │   ├── health.controller.ts       # REST health endpoints
│   │   └── health.module.ts
│   └── example/
│       ├── example-grpc.controller.ts # gRPC service implementation
│       └── example.module.ts
└── main.ts                             # Application bootstrap with gRPC config

proto/
├── common.proto                        # Shared proto definitions
└── example.proto                       # Example service proto
```

## Environment Variables

```bash
# HTTP Server
PORT=3000

# gRPC Server
GRPC_PORT=5000

# Database (existing)
DATABASE_URL=postgresql://user:password@localhost:5432/dbname

# Timezone
TZ=UTC
```

## Creating New gRPC Services

1. **Create Proto File** (`proto/your-service.proto`):
```protobuf
syntax = "proto3";

package yourservice;

service YourService {
  rpc YourMethod(YourRequest) returns (YourResponse);
}

message YourRequest {
  string id = 1;
}

message YourResponse {
  string result = 1;
}
```

2. **Create Controller** (`src/modules/your-service/your-service-grpc.controller.ts`):
```typescript
import { Controller, UseGuards } from '@nestjs/common';
import { GrpcMethod } from '@nestjs/microservices';
import { GrpcAuthGuard } from '../../common/guards/grpc-auth.guard';
import { GrpcUserDecorator } from '../../common/decorators';
import { GrpcUser } from '../../common/types';

@Controller()
@UseGuards(GrpcAuthGuard)
export class YourServiceGrpcController {
  @GrpcMethod('YourService', 'YourMethod')
  async yourMethod(
    data: YourRequest,
    @GrpcUserDecorator() user: GrpcUser,
  ): Promise<YourResponse> {
    // Your implementation with user context
    return { result: 'success' };
  }
}
```

3. **Update main.ts** to include your proto file in the gRPC options

4. **Create Module** and add to `app.module.ts`

## Running the Service

```bash
# Development
pnpm start:dev

# Production
pnpm build
pnpm start:prod
```

The service will start:
- HTTP server on port 3000
- gRPC server on port 5000

## Testing

### Test REST API
```bash
curl http://localhost:3000/api/health
```

### Test gRPC Service
Use the example client in `examples/grpc-client.example.ts`:
```bash
npx ts-node examples/grpc-client.example.ts
```

Or use gRPC tools like [grpcurl](https://github.com/fullstorydev/grpcurl):
```bash
grpcurl -plaintext \
  -H 'user: {"uuid":"123","email":"test@example.com","userPermission":"ADMIN"}' \
  localhost:5000 example.ExampleService/GetExample
```

## Error Handling

The gRPC guard will throw `UnauthorizedException` if:
- User metadata is missing
- User metadata is malformed JSON
- User object is missing required fields (uuid, email, userPermission)

Errors are automatically converted to gRPC status codes by NestJS.

## Communication with Other Services

### As a Client (Calling Other gRPC Services)

Create a client module in your service:

```typescript
import { Module } from '@nestjs/common';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { join } from 'path';

@Module({
  imports: [
    ClientsModule.register([
      {
        name: 'OTHER_SERVICE',
        transport: Transport.GRPC,
        options: {
          package: 'otherservice',
          protoPath: join(__dirname, '../proto/other-service.proto'),
          url: 'other-service:5000',
        },
      },
    ]),
  ],
})
export class OtherServiceClientModule {}
```

Then inject and use in your service:
```typescript
import { Inject, Injectable } from '@nestjs/common';
import { ClientGrpc } from '@nestjs/microservices';

@Injectable()
export class YourService {
  private otherService: any;

  constructor(@Inject('OTHER_SERVICE') private client: ClientGrpc) {}

  onModuleInit() {
    this.otherService = this.client.getService('OtherServiceName');
  }

  async callOtherService() {
    // Add user metadata when calling other services
    const user = { /* user context */ };
    const metadata = { user: JSON.stringify(user) };
    
    return await this.otherService.someMethod(data, metadata).toPromise();
  }
}
```

## Best Practices

1. **Always include user metadata** in gRPC calls
2. **Use the guard** on all gRPC controllers that need authentication
3. **Extract user context** using `@GrpcUserDecorator()` in your handlers
4. **Type your proto messages** properly for better type safety
5. **Handle errors gracefully** - gRPC errors are different from HTTP errors
6. **Log user actions** using the user context from metadata

## Security Considerations

- The current implementation expects user metadata to be provided by a trusted upstream service (e.g., API Gateway)
- User metadata is passed as JSON in headers - ensure proper validation
- Consider adding JWT token validation if needed
- Use TLS/SSL for production gRPC communication
- Implement rate limiting for production deployments

## Future Enhancements

- [ ] Add JWT token validation in gRPC guard
- [ ] Implement gRPC interceptors for logging
- [ ] Add gRPC health check service
- [ ] Implement streaming endpoints
- [ ] Add Prometheus metrics for gRPC
- [ ] Add distributed tracing support
