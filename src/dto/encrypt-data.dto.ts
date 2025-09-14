import { IsString, Length } from 'class-validator';

export class EncryptDataDto {
  @IsString()
  @Length(1, 2000)
  payload: string;
}
