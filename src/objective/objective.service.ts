import {Injectable} from '@nestjs/common';
import {PrismaService} from "../prisma.service";
import {ObjectiveDto} from "./dto/objective.dto";
import {
    ObjectiveNotFoundException, ObjectiveTitleDuplicateException
} from "./exception/objectiveError";
import {throwError} from "rxjs";

@Injectable()
export class ObjectiveService {
    constructor(private readonly  prismaService : PrismaService) {};



    async getAll() {
        return await this.prismaService.objective.findMany({
            include : {
                keyResult : true,
            }
        });
    }

    async create(objectiveDto: ObjectiveDto) {
        try {
            return await this.prismaService.objective.create({
                data:{
                    title: objectiveDto.title,
                    keyResult : {
                        create : objectiveDto.keyResults
                    }
                }
            });
        }catch (error) {
            if(error.code === "P2002"){
                throw new ObjectiveTitleDuplicateException(`Objective with title ${objectiveDto.title} already exists!`);
            }
            throw error
        }
    }
    async delete(objectiveId: string) {
        try {
            return await this.prismaService.objective.delete({
                where : {
                    id : objectiveId
                }
            });
        }catch (error) {
            if(error.code==='P2025'){
                throw new ObjectiveNotFoundException("Objective not found",objectiveId)
            }

            throw error
        }
    }

    async update(objectiveId:string,updatedObjectiveDto :Partial<ObjectiveDto>){
        return await this.prismaService.objective.update({
            where : {
                id:objectiveId
            },
            data : updatedObjectiveDto
        });
    }

    async getObjectiveById(objectiveId: string) {
        const objective  = await this.prismaService.objective.findUnique({
            where : {
                id : objectiveId
            },
            include:{
                keyResult : true,
            }
        });
        if(!objective){
            throw new ObjectiveNotFoundException("Objective not found with id ",objectiveId);
        }

        return objective;
    }
}
