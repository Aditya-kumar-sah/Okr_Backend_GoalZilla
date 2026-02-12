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
import { ObjectiveDto } from './dto/objective.dto';
import { ObjectiveService } from './objective.service';
import {
  ObjectiveNotFoundExceptionFilter,
  ObjectiveTitleDuplicateExceptionFilter,
} from './exception/objectiveError.filter';
@UseFilters(
  ObjectiveNotFoundExceptionFilter,
  ObjectiveTitleDuplicateExceptionFilter,
)
@Controller('objective')
export class ObjectiveController {
  constructor(private readonly objectiveService: ObjectiveService) {}

  @Get(':objectiveId/isComplete')
  isComplete(@Param('objectiveId') objectiveId: string) {
    return this.objectiveService.isComplete(objectiveId);
  }

  @Get()
  getAll() {
    return this.objectiveService.getAll();
  }

  @Get(':objectiveId')
  getObjectiveById(@Param('objectiveId') objectiveId: string) {
    return this.objectiveService.getObjectiveById(objectiveId);
  }

  @Post()
  create(
    @Body(
      new ValidationPipe({
        whitelist: true,
        forbidNonWhitelisted: true,
        transform: true,
      }),
    )
    objectiveDto: ObjectiveDto,
  ) {
    return this.objectiveService.create(objectiveDto);
  }

  @Delete(':objectiveId')
  delete(@Param('objectiveId') objectiveId: string) {
    return this.objectiveService.delete(objectiveId);
  }

  @Put(':objectiveId')
  update(
    @Param('objectiveId') objectiveId: string,
    @Body(
      new ValidationPipe({
        whitelist: true,
        forbidNonWhitelisted: true,
        transform: true,
      }),
    )
    updatedObjectiveDto: ObjectiveDto,
  ) {
    return this.objectiveService.update(objectiveId, updatedObjectiveDto);
  }
}
