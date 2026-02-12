import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import { KeyResultDto } from './dto/key-result.dto';
import { ObjectiveNotFoundException } from '../objective/exception/objectiveError';
import { KeyResultNotFoundException } from './exception/keyResult.exception';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/client';
@Injectable()
export class KeyResultService {
  constructor(private readonly prismaService: PrismaService) {}

  async getAll(objectiveId: string) {
    const objective = await this.prismaService.objective.findUnique({
      where: {
        id: objectiveId,
      },
    });

    if (!objective) {
      throw new ObjectiveNotFoundException(
        `Objective not found !`,
        objectiveId,
      );
    }

    return this.prismaService.keyResult.findMany({
      where: {
        objectiveId: objectiveId,
      },
    });
  }

  async create(objectiveId: string, createKeyResultDto: KeyResultDto) {
    const objective = await this.prismaService.objective.findUnique({
      where: {
        id: objectiveId,
      },
    });

    if (!objective) {
      throw new ObjectiveNotFoundException(
        `Objective not found !`,
        objectiveId,
      );
    }

    return this.prismaService.keyResult.create({
      data: {
        ...createKeyResultDto,
        objective: {
          connect: { id: objectiveId },
        },
      },
    });
  }

  async remove(keyResultId: string) {
    try {
      return await this.prismaService.keyResult.delete({
        where: {
          id: keyResultId,
        },
      });
    } catch (error) {
      if (
        error instanceof PrismaClientKnownRequestError &&
        error.code === 'P2025'
      ) {
        throw new KeyResultNotFoundException(
          'KeyResult not found',
          keyResultId,
        );
      }
    }
  }

  async update(keyResultId: string, keyResult: KeyResultDto) {
    try {
      return await this.prismaService.keyResult.update({
        where: {
          id: keyResultId,
        },
        data: {
          ...keyResult,
        },
      });
    } catch (error) {
      if (
        error instanceof PrismaClientKnownRequestError &&
        error.code === 'P2025'
      ) {
        throw new KeyResultNotFoundException(
          'KeyResult not found',
          keyResultId,
        );
      }
    }
  }
}
