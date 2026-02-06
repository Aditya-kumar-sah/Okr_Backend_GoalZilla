import {Body, Controller, Delete, Get, Param, Post, Put, UseFilters} from '@nestjs/common';
import {ObjectiveDto} from "./dto/objective.dto";
import {ObjectiveService} from "./objective.service";
import {ObjectiveNotFoundExceptionFilter, ObjectiveTitleDuplicateExceptionFilter} from "./exception/objectiveError.filter";
@UseFilters(ObjectiveNotFoundExceptionFilter,ObjectiveTitleDuplicateExceptionFilter)
@Controller('objective')
export class ObjectiveController {
    constructor(private readonly objectiveService: ObjectiveService) {}

    @Get()
    getAll(){
        return this.objectiveService.getAll();
    }

    @Get(":objectiveId")
    getObjectiveById(@Param('objectiveId') objectiveId: string){
        return this.objectiveService.getObjectiveById(objectiveId);
    }

    @Post()
    create(@Body() objectiveDto: ObjectiveDto){
        return this.objectiveService.create(objectiveDto);
    }

    @Delete(":objectiveId")
    delete(@Param('objectiveId') objectiveId: string){
        return this.objectiveService.delete(objectiveId)
    }

    @Put(':objectiveId')
    update(@Param('objectiveId') objectiveId: string, @Body() updatedObjectiveDto: Partial<ObjectiveDto>){
        return this.objectiveService.update(objectiveId, updatedObjectiveDto);
    }

}
