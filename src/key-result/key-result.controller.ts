import {Body, Controller, Get, Param, Post} from '@nestjs/common';
import {KeyResult} from "./dto/key-result.dto";
import {KeyResultService} from "./key-result.service";

@Controller('objective/:objectiveId/keyResult')
export class KeyResultController {
    constructor(private readonly keyResultsService: KeyResultService) {
        this.keyResultsService = keyResultsService;
    }

    @Get()
    getAllByObjectId(@Param('objectiveId') objectiveId:string) {
        return this.keyResultsService.getAll(objectiveId);
    }

    @Post()
    create(
        @Param('objectiveId') objectiveId: string,
        @Body() createKeyResultDto: KeyResult,
    ) {
        return this.keyResultsService.create(objectiveId, createKeyResultDto);
    }
}




