import { IsString, IsNumber, IsUUID } from 'class-validator';

export class CreateBookDto {
  @IsString()
  title: string;

  @IsString()
  author: string;

  @IsNumber()
  price: number;

  @IsUUID()
  categoryId: string;
}
