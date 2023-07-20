import {
  Injectable,
  Scope,
  UnprocessableEntityException,
} from '@nestjs/common';
import { CreateProductInput } from './dto/create-product.input';
import { Product } from './entities/product.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { UpdateProductInput } from './dto/update-product.input';
import { ProductsSalesLocationsService } from '../productsSalesLocations/productsSalesLocations.service';
import { ProductsTagsService } from '../productsTags/productTags.service';

@Injectable({ scope: Scope.DEFAULT })
export class ProductsService {
  constructor(
    @InjectRepository(Product)
    private readonly productsRepository: Repository<Product>,
    private readonly productsSalesLocationService: ProductsSalesLocationsService,
    private readonly productsTagsService: ProductsTagsService,
  ) {}

  async findAll(): Promise<Product[]> {
    return await this.productsRepository.find({
      // relation은 데이터 join할때 어떤 데이터랑 조인할지 작성하는 곳이다.
      relations: ['productSalesLocation', 'productCategory'],
    });
  }

  async findOne(id: string): Promise<Product> {
    return await this.productsRepository.findOne({
      where: { id: id },
      relations: ['productSalesLocation', 'productCategory'],
    });
  }

  async create(createProductInput: CreateProductInput): Promise<Product> {
    // // 상품 하나만 등록할때 사용하는 방법
    // const result = await this.productsRepository.save({
    //   //   name: '마우스',
    //   //   price: 3000,
    //   //   description: '좋은 마우스',
    //   ...createProductInput,
    // });
    // // result 안에는 무엇이 있나?
    // // result = { id: .... , name: .... }
    // return result;
    //
    // 2. 상품과 상품거래위치를 같이 등록하는 방법
    const { productSalesLocation, pruductCategoryId, productTags, ...product } =
      createProductInput;

    // 2-1 상품 거래위치 등록
    const result = await this.productsSalesLocationService.create({
      productSalesLocation,
    }); // 서비스를 타고 넘어가야 하는 이유 : 레포지토리에 직접 접근하면 검증로직을 통일 시킬 수 없음.

    // 2-2 상품태그 등록
    // productTags가 ['#전자제품', '#영등포', '#컴퓨터']와 같은 패턴이라고 가정
    const tagNames = productTags.map((item) => item.replace('#', ''));

    const prevTags = await this.productsTagsService.findByNames({ tagNames });

    const temp = [];
    tagNames.forEach((item) => {
      const isExists = prevTags.find((prevItem) => item === prevItem.name);
      if (!isExists) {
        temp.push({ name: item });
      }
    });

    const newTags = await this.productsTagsService.bulkInsert({ names: temp });
    const tags = [...prevTags, ...newTags.identifiers];

    const result2 = await this.productsRepository.save({
      ...product,
      productSalesLocation: result,
      productCategory: {
        id: pruductCategoryId,
        // 만약에 name까지 받고 싶으면
        // createProductInput에 name까지 추가해서 받아오면 됨.
      },
      productTags: tags,
    });

    return result2;
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

  async delete({ productId }: IProductsServiceDelete): Promise<boolean> {
    // 1. 실제 삭제
    // const result = await this.productsRepository.delete({ id: productId });

    // 2. 소프트 삭제 - isDeleted (repository에 추가해서 소프트적으로만 삭제)
    // this.productsRepository.update({ id: productId }, { isDeleted: true });

    // 3. 소프트 삭제 - deletedAt
    // this.productsRepository.update( { id : productId }, { deletedAt : new Date() } );

    // 4. 그래서 NestJS가 이미 제공해줌. 소프트 삭제(TypeORM) - softRemove
    this.productsRepository.softRemove({ id: productId });
    /*
    단점 : id로만 삭제가능
    장점 : 여러 id 한번에 삭제 가능 ex) softRemove({id:qqq}, {id:aaa}, ....)
    */

    // 5. softDelete
    const result = await this.productsRepository.softDelete({ id: productId });
    return result.affected ? true : false;
    /*
    단점 : 여러 id 한번에 삭제 불가능
    장점 : 다른 컬럼으로도 삭제 가능
    */
  }
}

interface IProductsServiceDelete {
  productId: string;
}
