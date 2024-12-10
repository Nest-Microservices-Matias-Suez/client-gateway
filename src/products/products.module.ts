import { Module } from '@nestjs/common';
import { ClientsModule, Transport } from '@nestjs/microservices';

import { ProductsController } from './products.controller';
import { envs, PRODUCTS_SERVICE } from '../config';

@Module({
  controllers: [ProductsController],
  providers: [],
  imports: [
    ClientsModule.register([
      {
        name: PRODUCTS_SERVICE,
        transport: Transport.TCP,
        options: {
          host: envs.productsMicroserviceHost,
          port: envs.productsMicroservicePort,
        },
      },
    ]),
  ],
})
export class ProductsModule {}
