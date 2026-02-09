import { Module } from '@nestjs/common';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { join } from 'path';
import { GrpcClientService } from './grpc-client.service';

@Module({
  imports: [
    ClientsModule.register([
      {
        name: 'EXAMPLE_GRPC_CLIENT',
        transport: Transport.GRPC,
        options: {
          package: ['example', 'common'],
          protoPath: [
            join(__dirname, '../../proto/example.proto'),
            join(__dirname, '../../proto/common.proto'),
          ],
          url: process.env.EXAMPLE_SERVICE_URL || 'localhost:5000',
        },
      },
    ]),
  ],
  providers: [GrpcClientService],
  exports: [GrpcClientService],
})
export class GrpcClientModule {}
