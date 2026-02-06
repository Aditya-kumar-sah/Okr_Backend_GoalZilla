import { Injectable } from '@nestjs/common';
import {PrismaService} from "../prisma.service";
import {KeyResult} from "./dto/key-result.dto";
@Injectable()
export class KeyResultService {
    constructor(private readonly prismaService: PrismaService) {}

    getAll(objectiveId:string) {
        return this.prismaService.keyResult.findMany({
            where : {
                objective_id : objectiveId
            }
        });
    }

    async create(objectiveId: string, createKeyResultDto: KeyResult) {
        return this.prismaService.keyResult.create({
            data: {
                ...createKeyResultDto,
                objective: {
                    connect: { id: objectiveId },
                },
            },
        });
    }
}

