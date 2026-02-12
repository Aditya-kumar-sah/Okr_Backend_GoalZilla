import {
  IsBoolean,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
} from 'class-validator';

export class KeyResultDto {
  @IsBoolean()
  @IsOptional()
  isCompleted: boolean;

  @IsNumber()
  @IsNotEmpty()
  currentProgress: number;

  @IsNumber()
  @IsNotEmpty()
  targetProgress: number;

  @IsString()
  @IsNotEmpty()
  description: string;

  @IsString()
  @IsNotEmpty()
  metric: string;
}
