import { Module } from '@nestjs/common';
import { ExampleGrpcController } from './example-grpc.controller';

@Module({
  controllers: [ExampleGrpcController],
})
export class ExampleModule {}
