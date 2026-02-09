import { ClientGrpc, ClientProxyFactory, Transport } from '@nestjs/microservices';
import { join } from 'path';
import { Metadata } from '@grpc/grpc-js';
import { Observable } from 'rxjs';

/**
 * Example gRPC Client
 * This demonstrates how to call the gRPC service with user metadata in headers
 * 
 * NOTE: This is a simplified example. In production, metadata handling in NestJS gRPC
 * requires proper interceptor setup or using lower-level gRPC client libraries.
 * 
 * For true metadata passing with NestJS microservices, consider:
 * 1. Using gRPC interceptors
 * 2. Using @grpc/grpc-js directly for more control
 * 3. Setting up custom gRPC client with metadata support
 */

interface ExampleService {
  getExample(data: { id: string }): Observable<any>;
  createExample(data: { name: string; description: string }): Observable<any>;
}

/**
 * Example 1: Basic gRPC Client Call
 * This shows the structure but metadata passing requires additional setup
 */
async function callGrpcService() {
  // Create gRPC client
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

  // Connect to the service
  await client.connect();

  // User metadata that should be passed (requires interceptor setup)
  const user = {
    uuid: '123e4567-e89b-12d3-a456-426614174000',
    email: 'user@example.com',
    userPermission: 'ADMIN',
  };

  console.log('Calling gRPC service with user context:', user);
  console.log('Note: Actual metadata passing requires interceptor setup');

  try {
    // Call GetExample method
    const getResult$ = client.send('ExampleService.GetExample', { id: '1' });
    getResult$.subscribe({
      next: (result) => console.log('GetExample Result:', result),
      error: (err) => console.error('GetExample Error:', err),
    });

    // Call CreateExample method
    const createResult$ = client.send('ExampleService.CreateExample', {
      name: 'Test',
      description: 'Test Description',
    });
    
    createResult$.subscribe({
      next: (result) => console.log('CreateExample Result:', result),
      error: (err) => console.error('CreateExample Error:', err),
    });

    // Give time for async operations to complete
    await new Promise(resolve => setTimeout(resolve, 2000));
  } catch (error) {
    console.error('Error calling gRPC service:', error);
  } finally {
    await client.close();
  }
}

/**
 * Example 2: Using ClientGrpc for typed service calls
 */
async function callGrpcServiceTyped() {
  const clientProxy = ClientProxyFactory.create({
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

  await clientProxy.connect();

  const client = clientProxy as unknown as ClientGrpc;
  const exampleService = client.getService<ExampleService>('ExampleService');

  // User context (requires interceptor for actual metadata passing)
  const user = {
    uuid: '123e4567-e89b-12d3-a456-426614174000',
    email: 'user@example.com',
    userPermission: 'ADMIN',
  };

  console.log('Typed gRPC call with user:', user);

  try {
    // Make typed call
    const result$ = exampleService.getExample({ id: '1' });
    result$.subscribe({
      next: (result) => {
        console.log('Typed call result:', result);
        clientProxy.close();
      },
      error: (err) => {
        console.error('Error:', err);
        clientProxy.close();
      },
    });
  } catch (error) {
    console.error('Error:', error);
    await clientProxy.close();
  }
}

/**
 * Example 3: Using @grpc/grpc-js directly for full metadata control
 * This is the recommended approach for passing metadata
 */
function callWithNativeGrpc() {
  const grpc = require('@grpc/grpc-js');
  const protoLoader = require('@grpc/proto-loader');
  
  // Load proto files
  const PROTO_PATH = join(__dirname, '../proto/example.proto');
  const packageDefinition = protoLoader.loadSync(PROTO_PATH, {
    keepCase: true,
    longs: String,
    enums: String,
    defaults: true,
    oneofs: true,
  });
  
  const exampleProto = grpc.loadPackageDefinition(packageDefinition).example;
  
  // Create client
  const client = new exampleProto.ExampleService(
    'localhost:5000',
    grpc.credentials.createInsecure()
  );
  
  // Prepare metadata with user information
  const metadata = new Metadata();
  const user = {
    uuid: '123e4567-e89b-12d3-a456-426614174000',
    email: 'user@example.com',
    userPermission: 'ADMIN',
  };
  metadata.set('user', JSON.stringify(user));
  
  // Make call with metadata
  client.getExample({ id: '1' }, metadata, (error: any, response: any) => {
    if (error) {
      console.error('Error:', error);
    } else {
      console.log('Response with metadata:', response);
    }
  });
}

// Run example
if (require.main === module) {
  console.log('=== gRPC Client Examples ===\n');
  
  console.log('Example 1: Basic NestJS Client');
  callGrpcService()
    .then(() => console.log('\n✓ Example 1 completed'))
    .catch(err => console.error('Example 1 failed:', err));
}

export { callGrpcService, callGrpcServiceTyped, callWithNativeGrpc };
