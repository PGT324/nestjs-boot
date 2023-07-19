import {
  HttpException,
  HttpStatus,
  Injectable,
  Scope,
  UnprocessableEntityException,
} from '@nestjs/common';
import { CreateProductInput } from './dto/create-product.input';
import { Product } from './entities/product.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { UpdateProductInput } from './dto/update-product.input';

@Injectable({ scope: Scope.DEFAULT })
export class ProductsService {
  constructor(
    @InjectRepository(Product)
    private readonly productsRepository: Repository<Product>,
  ) {}

  async findAll(): Promise<Product[]> {
    return await this.productsRepository.find();
  }

  async findOne(id: string): Promise<Product> {
    return await this.productsRepository.findOne({ where: { id: id } });
  }

  async create(createProductInput: CreateProductInput): Promise<Product> {
    const result = await this.productsRepository.save({
      //   name: '마우스',
      //   price: 3000,
      //   description: '좋은 마우스',
      ...createProductInput,
    });

    // result 안에는 무엇이 있나?
    // result = { id: .... , name: .... }
    return result;
  }

  async update(
    productId: string,
    updateProductInput: UpdateProductInput,
  ): Promise<Product> {
    // 기존 findOne로직을 재사용하여 로직을 통일시키자.
    const product = await this.findOne(productId);
    // const product = await this.productsRepository.findOne({
    //   where: { id: productId },
    // });

    // 검증은 리졸버 말고 서비스에서!!
    this.checkSoldout(product);

    /* 
    this.productRepository.create() => DB 접속이랑 관련없음 (등록을 위한 빈 객체 생성)
    this.productRepository.insert() => 결과를 객체로 못 돌려받는 등록방법
    this.productRepository.update() => 결과를 객체로 못 돌려받는 수정방법
    */

    const result = await this.productsRepository.save({
      // 수정할 대상의 id로 product를 하나 찾고 그 정보를 좍 깔아놓고
      // 만약 수정할 데이터가 들어오면 기존거를 수정해주고, 안들어오면 기존거로 등록하고
      // 수정되지않은 결과값도 모두 반환하고 싶을때 사용한다.
      ...product,
      ...updateProductInput,
    });

    return result;
  }

  // 예외처리를 모든 로직에서 다 해주면 불필요 하므로 함수를 따로 만들어서 가져다 사용한다.
  checkSoldout(product: Product): void {
    // 예외처리
    // if (product.isSoldout) {
    //   throw new HttpException(
    //     '이미 판매완료된 상품입니다!',
    //     HttpStatus.UNPROCESSABLE_ENTITY,
    //   );
    // } => 밑에랑 같은 거임

    if (product.isSoldout) {
      throw new UnprocessableEntityException('이미 판매완료된 상품입니다!');
    }
  }
}
