import { Field, InputType } from '@nestjs/graphql';
import { IsNumber, IsString, Min } from 'class-validator';
import { ProductSalesLocationInput } from 'src/apis/productsSalesLocations/dto/productSaleLocation.input';

@InputType()
export class CreateProductInput {
  @IsString()
  @Field(() => String)
  name: string;

  @IsString()
  @Field(() => String)
  description: string;

  @Min(0)
  @IsNumber()
  @Field(() => Number)
  price: number;

  @Field(() => ProductSalesLocationInput)
  productSalesLocation: ProductSalesLocationInput;

  @Field(() => String)
  pruductCategoryId: string;

  @Field(() => [String])
  productTags: string[];
}
