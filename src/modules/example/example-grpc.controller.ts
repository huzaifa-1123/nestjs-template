import { Controller, UseGuards } from '@nestjs/common';
import { GrpcMethod } from '@nestjs/microservices';
import { GrpcAuthGuard } from '../../common/guards/grpc-auth.guard';
import { GrpcUserDecorator } from '../../common/decorators';
import type { GrpcUser } from '../../common/types';

interface GetExampleRequest {
  id: string;
}

interface GetExampleResponse {
  id: string;
  name: string;
  description: string;
  createdAt: string;
}

interface CreateExampleRequest {
  name: string;
  description: string;
}

interface CreateExampleResponse {
  id: string;
  name: string;
  description: string;
  createdAt: string;
}

@Controller()
@UseGuards(GrpcAuthGuard)
export class ExampleGrpcController {
  @GrpcMethod('ExampleService', 'GetExample')
  async getExample(
    data: GetExampleRequest,
    @GrpcUserDecorator() user: GrpcUser,
  ): Promise<GetExampleResponse> {
    // Example implementation with user context
    console.log('Request from user:', user);
    
    return {
      id: data.id,
      name: 'Example Name',
      description: 'Example Description',
      createdAt: new Date().toISOString(),
    };
  }

  @GrpcMethod('ExampleService', 'CreateExample')
  async createExample(
    data: CreateExampleRequest,
    @GrpcUserDecorator() user: GrpcUser,
  ): Promise<CreateExampleResponse> {
    // Example implementation with user context
    console.log('Create request from user:', user);
    
    return {
      id: Math.random().toString(36).substring(7),
      name: data.name,
      description: data.description,
      createdAt: new Date().toISOString(),
    };
  }
}
