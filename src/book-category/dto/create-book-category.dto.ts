import { IsString, IsOptional } from 'class-validator';

export class CreateBookCategoryDto {
  @IsString()
  name: string;

  @IsOptional()
  @IsString()
  description?: string;
}
