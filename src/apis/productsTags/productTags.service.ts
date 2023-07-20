import { Injectable } from '@nestjs/common';
import { In, Repository } from 'typeorm';
import { ProductTag } from './entities/productTag.entity';
import { InjectRepository } from '@nestjs/typeorm';
import {
  IProductsTagsServiceBulkInsert,
  IProductsTagsServiceFindByNames,
} from './interfaces/products-tags-service.interface';

@Injectable()
export class ProductsTagsService {
  constructor(
    @InjectRepository(ProductTag)
    private readonly productTagsRepository: Repository<ProductTag>,
  ) {}

  findByNames({ tagNames }: IProductsTagsServiceFindByNames) {
    return this.productTagsRepository.find({
      where: { name: In(tagNames) }, // In: tagNames에 있는 이름 다찾아보기
    });
  }

  bulkInsert({ names }: IProductsTagsServiceBulkInsert) {
    return this.productTagsRepository.insert(names); // bulk-insert는 save()로 불가능
  }
}
