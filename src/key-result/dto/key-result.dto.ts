import {
  IsBoolean,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
} from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class KeyResultDto {
  @ApiPropertyOptional({
    description: 'Whether the key result is completed',
    example: false,
    default: false,
  })
  @IsBoolean()
  @IsOptional()
  isCompleted: boolean;

  @ApiProperty({
    description: 'Current progress of the key result',
    example: 50,
  })
  @IsNumber()
  @IsNotEmpty()
  currentProgress: number;

  @ApiPropertyOptional({
    description: 'Target progress for the key result',
    example: 100,
  })
  @IsNumber()
  @IsOptional()
  targetProgress: number;

  @ApiProperty({
    description: 'Description of the key result',
    example: 'Increase user engagement by 50%',
  })
  @IsString()
  @IsNotEmpty()
  description: string;

  @ApiPropertyOptional({
    description: 'Metric for measuring the key result',
    example: 'percentage',
  })
  @IsString()
  @IsOptional()
  metric: string;
}
