import {IsBoolean, IsNotEmpty, IsNumber, IsOptional, IsString, Max, Min} from "class-validator";

export class KeyResult {
    @IsBoolean()
    @IsOptional()
    isCompleted? : boolean;

    @IsNumber()
    @IsNotEmpty()
    @Max(100)
    @Min(0)
    progress : number;

    @IsString()
    @IsNotEmpty()
    description  : string
}

export class UpdateKeyResultDto {
    @IsBoolean()
    @IsOptional()
    isCompleted : boolean;

    @IsNumber()
    @IsNotEmpty()
    @Max(100)
    @Min(0)
    @IsOptional()
    progress : number;

    @IsString()
    @IsNotEmpty()
    @IsOptional()
    description  : string
}

