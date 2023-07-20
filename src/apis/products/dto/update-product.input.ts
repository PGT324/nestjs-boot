import { InputType, OmitType, PartialType } from '@nestjs/graphql';
import { CreateProductInput } from './create-product.input';

// partial타입은 물음표를 붙혀서 상속한다.
@InputType()
export class UpdateProductInput extends PartialType(
  OmitType(CreateProductInput, ['productTags'], InputType),
) {}

// PickType(CreateProductInput, ['name', 'price']);     // => 골라서 사용
// OmitType(CreateProductInput, ['description']);       // => 빼서 사용
// PartialType(CreateProductInput);                     // => 물음표 만들기
