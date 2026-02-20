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
import { KeyResultDto } from './dto/key-result.dto';
import { KeyResultService } from './key-result.service';
import { ObjectiveNotFoundExceptionFilter } from '../objective/exception/objectiveError.filter';
import { KeyResultNotFoundExceptionFilter } from './exception/keyResult.exception.filter';

@ApiTags('Key Result')
@Controller('objective/:objectiveId/keyResult')
@UseFilters(ObjectiveNotFoundExceptionFilter, KeyResultNotFoundExceptionFilter)
export class KeyResultController {
  constructor(private readonly keyResultsService: KeyResultService) {
    this.keyResultsService = keyResultsService;
  }

  @Get()
  @ApiOperation({ summary: 'Get all key results for an objective' })
  @ApiParam({
    name: 'objectiveId',
    description: 'The ID of the objective',
    type: 'string',
  })
  @ApiResponse({
    status: 200,
    description: 'Returns list of key results for the objective',
  })
  @ApiResponse({ status: 404, description: 'Objective not found' })
  getAllByObjectId(@Param('objectiveId') objectiveId: string) {
    return this.keyResultsService.getAll(objectiveId);
  }

  @Post()
  @ApiOperation({ summary: 'Create a new key result for an objective' })
  @ApiParam({
    name: 'objectiveId',
    description: 'The ID of the objective',
    type: 'string',
  })
  @ApiBody({
    type: KeyResultDto,
    description: 'Key result data',
  })
  @ApiResponse({
    status: 201,
    description: 'Key result created successfully',
  })
  @ApiResponse({ status: 400, description: 'Invalid input data' })
  @ApiResponse({ status: 404, description: 'Objective not found' })
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
  @ApiOperation({ summary: 'Delete a key result' })
  @ApiParam({
    name: 'objectiveId',
    description: 'The ID of the objective',
    type: 'string',
  })
  @ApiParam({
    name: 'keyResultId',
    description: 'The ID of the key result to delete',
    type: 'string',
  })
  @ApiResponse({
    status: 200,
    description: 'Key result deleted successfully',
  })
  @ApiResponse({ status: 404, description: 'Key result not found' })
  remove(@Param('keyResultId') keyResultId: string) {
    return this.keyResultsService.remove(keyResultId);
  }

  @Put(':keyResultId')
  @ApiOperation({ summary: 'Update a key result' })
  @ApiParam({
    name: 'objectiveId',
    description: 'The ID of the objective',
    type: 'string',
  })
  @ApiParam({
    name: 'keyResultId',
    description: 'The ID of the key result to update',
    type: 'string',
  })
  @ApiBody({
    type: KeyResultDto,
    description: 'Updated key result data',
  })
  @ApiResponse({
    status: 200,
    description: 'Key result updated successfully',
  })
  @ApiResponse({ status: 400, description: 'Invalid input data' })
  @ApiResponse({ status: 404, description: 'Key result not found' })
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
