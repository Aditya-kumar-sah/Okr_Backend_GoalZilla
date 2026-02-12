import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import { KeyResult } from './dto/key-result.dto';
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
        objective_id: objectiveId,
      },
    });
  }

  async create(objectiveId: string, createKeyResultDto: KeyResult) {
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

  async update(keyResultId: string, keyResult: Partial<KeyResult>) {
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
