import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import { ObjectiveDto } from './dto/objective.dto';
import {
  ObjectiveNotFoundException,
  ObjectiveTitleDuplicateException,
} from './exception/objectiveError';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/client';

@Injectable()
export class ObjectiveService {
  constructor(private readonly prismaService: PrismaService) {}

  async getAll() {
    return this.prismaService.objective.findMany({
      include: {
        keyResult: true,
      },
    });
  }

  async create(objectiveDto: ObjectiveDto) {
    try {
      return await this.prismaService.objective.create({
        data: {
          title: objectiveDto.title,
        },
      });
    } catch (error: any) {
      // console.log(error);
      if (
        error instanceof PrismaClientKnownRequestError &&
        error.code === 'P2002'
      ) {
        throw new ObjectiveTitleDuplicateException(
          `Objective with title ${objectiveDto.title} already exists!`,
        );
      }
      throw error;
    }
  }
  async delete(objectiveId: string) {
    try {
      return await this.prismaService.objective.delete({
        where: {
          id: objectiveId,
        },
      });
    } catch (error: any) {
      if (
        error instanceof PrismaClientKnownRequestError &&
        error.code === 'P2025'
      ) {
        throw new ObjectiveNotFoundException(
          'Objective not found',
          objectiveId,
        );
      }

      throw error;
    }
  }

  async update(objectiveId: string, updatedObjectiveDto: ObjectiveDto) {
    try {
      return await this.prismaService.objective.update({
        where: {
          id: objectiveId,
        },
        data: {
          title: updatedObjectiveDto.title,
        },
      });
    } catch (error: any) {
      if (
        error instanceof PrismaClientKnownRequestError &&
        error.code === 'P2002'
      ) {
        throw new ObjectiveTitleDuplicateException(
          `Objective with title ${updatedObjectiveDto.title} already exists!`,
        );
      }
      if (
        error instanceof PrismaClientKnownRequestError &&
        error.code === 'P2025'
      ) {
        throw new ObjectiveNotFoundException(
          'Objective not found',
          objectiveId,
        );
      }
      throw error;
    }
  }

  async getObjectiveById(objectiveId: string) {
    const objective = await this.prismaService.objective.findUnique({
      where: {
        id: objectiveId,
      },
      include: {
        keyResult: true,
      },
    });
    if (!objective) {
      throw new ObjectiveNotFoundException(
        'Objective not found with id ',
        objectiveId,
      );
    }

    return objective;
  }

  async isComplete(objectiveId: string) {
    const objective = await this.prismaService.objective.findUnique({
      where: { id: objectiveId },
      include: {
        keyResult: true,
      },
    });

    if (!objective) {
      throw new ObjectiveNotFoundException(
        'Objective not found with id ',
        objectiveId,
      );
    }
    let isObjectCompleted = true;
    let objectiveProgressSum: number = 0;
    let count = 0;
    objective.keyResult.forEach((currKeyResult) => {
      const keyResultProgressInPercentage =
        (currKeyResult.currentProgress / currKeyResult.targetProgress) * 100;
      objectiveProgressSum += keyResultProgressInPercentage;
      if (currKeyResult.currentProgress < currKeyResult.targetProgress) {
        isObjectCompleted = false;
      }
      count++;
    });

    if (count === 0) return { isObjectCompleted: true, objectiveProgress: 100 };

    const objectiveProgress = objectiveProgressSum / count;

    return { isObjectCompleted, objectiveProgress };
  }
}
