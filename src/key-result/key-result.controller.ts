import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  UseFilters,
  ValidationPipe,
} from '@nestjs/common';
import { KeyResultDto } from './dto/key-result.dto';
import { KeyResultService } from './key-result.service';
import { ObjectiveNotFoundExceptionFilter } from '../objective/exception/objectiveError.filter';
import { KeyResultNotFoundExceptionFilter } from './exception/keyResult.exception.filter';

@Controller('objective/:objectiveId/keyResult')
@UseFilters(ObjectiveNotFoundExceptionFilter, KeyResultNotFoundExceptionFilter)
export class KeyResultController {
  constructor(private readonly keyResultsService: KeyResultService) {
    this.keyResultsService = keyResultsService;
  }

  @Get()
  getAllByObjectId(@Param('objectiveId') objectiveId: string) {
    return this.keyResultsService.getAll(objectiveId);
  }

  @Post()
  create(
    @Param('objectiveId') objectiveId: string,
    @Body(
      new ValidationPipe({
        whitelist: true,
        forbidNonWhitelisted: true,
        transform: true,
      }),
    )
    createKeyResultDto: KeyResultDto,
  ) {
    return this.keyResultsService.create(objectiveId, createKeyResultDto);
  }

  @Delete(':keyResultId')
  remove(@Param('keyResultId') keyResultId: string) {
    return this.keyResultsService.remove(keyResultId);
  }

  @Put(':keyResultId')
  update(
    @Param('keyResultId') keyResultId: string,
    @Body(
      new ValidationPipe({
        whitelist: true,
        forbidNonWhitelisted: true,
        transform: true,
      }),
    )
    keyResult: KeyResultDto,
  ) {
    return this.keyResultsService.update(keyResultId, keyResult);
  }
}
