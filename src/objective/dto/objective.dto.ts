import { IsNotEmpty, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class ObjectiveDto {
  @ApiProperty({
    description: 'The title of the objective',
    example: 'Increase product adoption',
  })
  @IsString()
  @IsNotEmpty()
  title: string;
}
