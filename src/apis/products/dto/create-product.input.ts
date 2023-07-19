import { Field, InputType } from '@nestjs/graphql';
import { IsNumber, IsString, Min } from 'class-validator';

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
}
