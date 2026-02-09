import { Inject, Injectable, OnModuleInit } from '@nestjs/common';
import type { ClientGrpc } from '@nestjs/microservices';
import type { GrpcUser } from '../../common/types';
import { Metadata } from '@grpc/grpc-js';
import { Observable } from 'rxjs';

interface ExampleService {
  getExample(data: { id: string }): any;
  createExample(data: { name: string; description: string }): any;
}

@Injectable()
export class GrpcClientService implements OnModuleInit {
  private exampleService: ExampleService;

  constructor(@Inject('EXAMPLE_GRPC_CLIENT') private client: ClientGrpc) {}

  onModuleInit() {
    this.exampleService = this.client.getService<ExampleService>('ExampleService');
  }

  /**
   * Helper method to create metadata with user information
   */
  private createMetadata(user: GrpcUser): Metadata {
    const metadata = new Metadata();
    metadata.set('user', JSON.stringify(user));
    return metadata;
  }

  /**
   * Example: Get example by ID
   * Note: In actual gRPC calls, metadata is passed through context, not as a parameter
   */
  async getExample(id: string, user: GrpcUser): Promise<any> {
    // For actual implementation, you would need to set up metadata differently
    // This is a simplified example
    return new Promise((resolve, reject) => {
      const result$ = this.exampleService.getExample({ id }) as Observable<any>;
      result$.subscribe({
        next: (data) => resolve(data),
        error: (err) => reject(err),
      });
    });
  }

  /**
   * Example: Create example
   */
  async createExample(
    data: { name: string; description: string },
    user: GrpcUser,
  ): Promise<any> {
    return new Promise((resolve, reject) => {
      const result$ = this.exampleService.createExample(data) as Observable<any>;
      result$.subscribe({
        next: (data) => resolve(data),
        error: (err) => reject(err),
      });
    });
  }
}
