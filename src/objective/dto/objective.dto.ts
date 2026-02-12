import { IsNotEmpty, IsString } from 'class-validator';

export class ObjectiveDto {
  @IsString()
  @IsNotEmpty()
  title: string;
}
