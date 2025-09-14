import { IsString } from 'class-validator';

export class DecryptDataDto {
  @IsString()
  data1: string;

  @IsString()
  data2: string;
}