import { BadRequestException, Body, Controller, Delete, Get, Inject, Param, ParseIntPipe, Patch, Post, Query } from '@nestjs/common';
import { ClientProxy, RpcException } from '@nestjs/microservices';

import { PaginationDto } from '../common';
import { PRODUCTS_SERVICE } from '../config';
import { catchError, firstValueFrom } from 'rxjs';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';

@Controller('products')
export class ProductsController {
  constructor(
    @Inject( PRODUCTS_SERVICE ) private readonly productsClient: ClientProxy,
  ) {}

  @Post()
  create(
    @Body() createProductDto: CreateProductDto,
  ) {
    return this.productsClient.send(
      {
        cmd: `create_product`,
      },
      createProductDto,
    );
  }

  @Get()
  async findAll(
    @Query() paginationDto: PaginationDto,
  ) {
    const products = await this.productsClient.send({
        cmd: `find_all_products`,
      },
      paginationDto,
    );
    return products;
  }

  @Get(':id')
  async findOne(
    @Param('id') id: string,
  ) {
    const product = this.productsClient.send({
        cmd: `find_one_product`,
      }, { id, },
    ).pipe(
      catchError( (err) => {
        throw new RpcException( err );
      })
    );
    return product;
  }

  @Patch(':id')
  update(
    @Param('id', ParseIntPipe ) id: number,
    @Body() udpateProductDto: UpdateProductDto,
  ) {
    return this.productsClient.send(
      {
        cmd: `update_product`,
      }, {
        id,
        ...udpateProductDto,
      },
    ).pipe(
      catchError( (err) => {
        throw new RpcException( err );
      })
    );
  }

  @Delete(':id')
  deleteProduct(
    @Param('id') id: string,
  ) {
    return this.productsClient.send(
      {
        cmd: `delete_product`,
      }, { id, },
    );
  }
}
