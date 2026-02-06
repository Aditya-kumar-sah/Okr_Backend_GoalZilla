import { Module } from '@nestjs/common';
import {ObjectiveService} from "./objective.service";
import {PrismaService} from "../prisma.service";
import {ObjectiveController} from "./objective.controller";
import {KeyResultModule} from "../key-result/key-result.module"

@Module({
    imports: [KeyResultModule],
    controllers : [ObjectiveController],
    providers : [PrismaService,ObjectiveService]
})
export class ObjectiveModule {}
