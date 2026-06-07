import { IsNotEmpty, IsString } from 'class-validator';

export class SkuSearchQueryDto {
  @IsString()
  @IsNotEmpty()
  sku: string;
}
