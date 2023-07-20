import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { ProductSalesLocation } from './entities/productSaleLocation.entity';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class ProductsSalesLocationsService {
  constructor(
    @InjectRepository(ProductSalesLocation)
    private readonly productSalesLocationRepository: Repository<ProductSalesLocation>,
  ) {}

  async create({ productSalesLocation }) {
    return await this.productSalesLocationRepository.save({
      ...productSalesLocation,
    });
  }
}
