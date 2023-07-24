import { Module } from '@nestjs/common';
import { ProductsResolver } from './products.resolver';
import { ProductsService } from './products.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Product } from './entities/product.entity';
import { ProductsSalesLocationsService } from '../productsSalesLocations/productsSalesLocations.service';
import { ProductSalesLocation } from '../productsSalesLocations/entities/productSaleLocation.entity';
import { ProductsTagsService } from '../productsTags/productTags.service';
import { ProductTag } from '../productsTags/entities/productTag.entity';
import { ProductSubscriber } from './entities/product.subscriber';

@Module({
  imports: [
    TypeOrmModule.forFeature([Product, ProductSalesLocation, ProductTag]),
  ],
  providers: [
    ProductsResolver,
    ProductsService,
    ProductsSalesLocationsService,
    ProductsTagsService,
    ProductSubscriber,
  ],
})
export class ProductsModule {}
