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
import {
  ApiOperation,
  ApiResponse,
  ApiParam,
  ApiBody,
  ApiTags,
} from '@nestjs/swagger';
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
@ApiTags('Objective')
@Controller('objective')
export class ObjectiveController {
  constructor(private readonly objectiveService: ObjectiveService) {}

  @Get(':objectiveId/isComplete')
  @ApiOperation({ summary: 'Check if objective is complete' })
  @ApiParam({
    name: 'objectiveId',
    description: 'The ID of the objective',
    type: 'string',
  })
  @ApiResponse({
    status: 200,
    description: 'Returns whether the objective is complete',
  })
  @ApiResponse({ status: 404, description: 'Objective not found' })
  isComplete(@Param('objectiveId') objectiveId: string) {
    return this.objectiveService.isComplete(objectiveId);
  }

  @Get()
  @ApiOperation({ summary: 'Get all objectives' })
  @ApiResponse({
    status: 200,
    description: 'Returns list of all objectives',
  })
  getAll() {
    return this.objectiveService.getAll();
  }

  @Get(':objectiveId')
  @ApiOperation({ summary: 'Get objective by ID' })
  @ApiParam({
    name: 'objectiveId',
    description: 'The ID of the objective',
    type: 'string',
  })
  @ApiResponse({
    status: 200,
    description: 'Returns the objective details',
  })
  @ApiResponse({ status: 404, description: 'Objective not found' })
  getObjectiveById(@Param('objectiveId') objectiveId: string) {
    return this.objectiveService.getObjectiveById(objectiveId);
  }

  @Post()
  @ApiOperation({ summary: 'Create a new objective' })
  @ApiBody({
    type: ObjectiveDto,
    description: 'Objective data',
  })
  @ApiResponse({
    status: 201,
    description: 'Objective created successfully',
  })
  @ApiResponse({ status: 400, description: 'Invalid input data' })
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
  @ApiOperation({ summary: 'Delete an objective' })
  @ApiParam({
    name: 'objectiveId',
    description: 'The ID of the objective to delete',
    type: 'string',
  })
  @ApiResponse({
    status: 200,
    description: 'Objective deleted successfully',
  })
  @ApiResponse({ status: 404, description: 'Objective not found' })
  delete(@Param('objectiveId') objectiveId: string) {
    return this.objectiveService.delete(objectiveId);
  }

  @Put(':objectiveId')
  @ApiOperation({ summary: 'Update an objective' })
  @ApiParam({
    name: 'objectiveId',
    description: 'The ID of the objective to update',
    type: 'string',
  })
  @ApiBody({
    type: ObjectiveDto,
    description: 'Updated objective data',
  })
  @ApiResponse({
    status: 200,
    description: 'Objective updated successfully',
  })
  @ApiResponse({ status: 400, description: 'Invalid input data' })
  @ApiResponse({ status: 404, description: 'Objective not found' })
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
