import { Test } from '@nestjs/testing';
import { KeyResultService } from '../key-result.service';
import { PrismaService } from '../../prisma.service';
import { ObjectiveNotFoundException } from '../../objective/exception/objectiveError';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/client';
import { KeyResultNotFoundException } from '../exception/keyResult.exception';

describe('key-result-service', () => {
  describe('get key results for an objective', () => {
    const mockPrismaService = {
      keyResult: {
        findMany: jest.fn(),
      },
      objective: {
        findUnique: jest.fn(),
      },
    };
    let keyResultService: KeyResultService;
    beforeEach(async () => {
      jest.clearAllMocks();
      const moduleRef = await Test.createTestingModule({
        providers: [
          KeyResultService,
          { provide: PrismaService, useValue: mockPrismaService },
        ],
      }).compile();
      keyResultService = await moduleRef.resolve(KeyResultService);
    });

    it('should return all key results for the given objective when objective exists', async () => {
      const mockKeyResultList = [
        {
          id: '1',
          description: 'Increase unit test coverage',
          currentProgress: 30,
          targetProgress: 100,
          metric: 'percent',
          isCompleted: false,
          objectiveId: '1',
        },
        {
          id: '2',
          description: 'Reduce bug backlog',
          currentProgress: 10,
          targetProgress: 50,
          metric: 'items',
          isCompleted: false,
          objectiveId: '1',
        },
      ];
      const mockObjective = {
        id: '1',
        title: 'Improve Quality',
      };

      mockPrismaService.keyResult.findMany.mockResolvedValue(mockKeyResultList);
      mockPrismaService.objective.findUnique.mockResolvedValue(mockObjective);

      const result = await keyResultService.getAll('1');
      expect(result).toBe(mockKeyResultList);
      expect(mockPrismaService.keyResult.findMany).toHaveBeenCalledTimes(1);
      expect(mockPrismaService.keyResult.findMany).toHaveBeenCalledWith({
        where: {
          objectiveId: '1',
        },
      });
      expect(mockPrismaService.objective.findUnique).toHaveBeenCalledTimes(1);
      expect(mockPrismaService.objective.findUnique).toHaveBeenCalledWith({
        where: {
          id: '1',
        },
      });
    });

    it('should throw ObjectiveNotFoundException when objective with given id does not exist', async () => {
      mockPrismaService.objective.findUnique.mockResolvedValue(null);

      await expect(keyResultService.getAll('1')).rejects.toThrow(
        ObjectiveNotFoundException,
      );

      expect(mockPrismaService.objective.findUnique).toHaveBeenCalledTimes(1);
      expect(mockPrismaService.objective.findUnique).toHaveBeenCalledWith({
        where: {
          id: '1',
        },
      });
    });
  });

  describe('create key result for an objective', () => {
    const mockPrismaService = {
      keyResult: {
        create: jest.fn(),
      },
      objective: {
        findUnique: jest.fn(),
      },
    };
    let keyResultService: KeyResultService;
    beforeEach(async () => {
      jest.clearAllMocks();
      const moduleRef = await Test.createTestingModule({
        providers: [
          KeyResultService,
          { provide: PrismaService, useValue: mockPrismaService },
        ],
      }).compile();
      keyResultService = await moduleRef.resolve(KeyResultService);
    });

    it('should create and return key result when objective exists', async () => {
      const mockKeyResult = {
        id: '1',
        description: 'Increase unit test coverage',
        currentProgress: 0,
        targetProgress: 100,
        metric: 'percent',
        isCompleted: false,
        objectiveId: '1',
      };

      const mockObjective = {
        id: '1',
        title: 'Improve Quality',
      };

      mockPrismaService.keyResult.create.mockResolvedValue(mockKeyResult);
      mockPrismaService.objective.findUnique.mockResolvedValue(mockObjective);

      const result = await keyResultService.create('1', {
        description: mockKeyResult.description,
        currentProgress: mockKeyResult.currentProgress,
        targetProgress: mockKeyResult.targetProgress,
        metric: mockKeyResult.metric,
        isCompleted: mockKeyResult.isCompleted,
      } as any);

      expect(result).toBe(mockKeyResult);
      expect(mockPrismaService.keyResult.create).toHaveBeenCalledTimes(1);
      expect(mockPrismaService.keyResult.create).toHaveBeenCalledWith({
        data: {
          description: mockKeyResult.description,
          currentProgress: mockKeyResult.currentProgress,
          targetProgress: mockKeyResult.targetProgress,
          metric: mockKeyResult.metric,
          isCompleted: mockKeyResult.isCompleted,
          objective: {
            connect: { id: '1' },
          },
        },
      });
      expect(mockPrismaService.objective.findUnique).toHaveBeenCalledTimes(1);
      expect(mockPrismaService.objective.findUnique).toHaveBeenCalledWith({
        where: {
          id: '1',
        },
      });
    });

    it('should throw ObjectiveNotFoundException when creating key result for non-existent objective', async () => {
      mockPrismaService.objective.findUnique.mockResolvedValue(null);

      await expect(
        keyResultService.create('1', { description: 'x', currentProgress: 0 } as any),
      ).rejects.toThrow(ObjectiveNotFoundException);

      expect(mockPrismaService.objective.findUnique).toHaveBeenCalledTimes(1);
      expect(mockPrismaService.objective.findUnique).toHaveBeenCalledWith({
        where: {
          id: '1',
        },
      });
    });
  });

  describe('delete key result by id', () => {
    const mockPrismaService = {
      keyResult: {
        delete: jest.fn(),
      },
    };
    let keyResultService: KeyResultService;
    beforeEach(async () => {
      jest.clearAllMocks();
      const moduleRef = await Test.createTestingModule({
        providers: [
          KeyResultService,
          { provide: PrismaService, useValue: mockPrismaService },
        ],
      }).compile();
      keyResultService = await moduleRef.resolve(KeyResultService);
    });

    it('should delete and return the deleted key result when it exists', async () => {
      const mockKeyResult = {
        id: '1',
        description: 'Reduce bug backlog',
        currentProgress: 10,
        targetProgress: 50,
        metric: 'items',
        isCompleted: false,
        objectiveId: '1',
      };

      mockPrismaService.keyResult.delete.mockResolvedValue(mockKeyResult);

      const result = await keyResultService.remove('1');

      expect(result).toBe(mockKeyResult);
      expect(mockPrismaService.keyResult.delete).toHaveBeenCalledTimes(1);
      expect(mockPrismaService.keyResult.delete).toHaveBeenCalledWith({
        where: {
          id: '1',
        },
      });
    });

    it('should throw KeyResultNotFoundException when delete target does not exist', async () => {
      const mockError = new PrismaClientKnownRequestError('NOT FOUND', {
        code: 'P2025',
        clientVersion: '5.x',
      });
      mockPrismaService.keyResult.delete.mockRejectedValue(mockError);

      await expect(keyResultService.remove('1')).rejects.toThrow(
        KeyResultNotFoundException,
      );

      expect(mockPrismaService.keyResult.delete).toHaveBeenCalledTimes(1);
      expect(mockPrismaService.keyResult.delete).toHaveBeenCalledWith({
        where: {
          id: '1',
        },
      });
    });
  });

  describe('update key result by id', () => {
    const mockPrismaService = {
      keyResult: {
        update: jest.fn(),
      },
    };
    let keyResultService: KeyResultService;

    beforeEach(async () => {
      jest.clearAllMocks();
      const moduleRef = await Test.createTestingModule({
        providers: [
          KeyResultService,
          { provide: PrismaService, useValue: mockPrismaService },
        ],
      }).compile();
      keyResultService = await moduleRef.resolve(KeyResultService);
    });

    it('should update key result and return updated object when it exists', async () => {
      const keyResultId = '123';
      const updatePayload = { description: 'Updated Description', currentProgress: 60 };

      const updatedKeyResult = {
        id: keyResultId,
        description: updatePayload.description,
        currentProgress: updatePayload.currentProgress,
        targetProgress: 100,
        isCompleted: false,
        objectiveId: '1',
      };

      mockPrismaService.keyResult.update.mockResolvedValue(updatedKeyResult);

      const result = await keyResultService.update(keyResultId, updatePayload as any);

      expect(result).toEqual(updatedKeyResult);
      expect(mockPrismaService.keyResult.update).toHaveBeenCalledWith({
        where: { id: keyResultId },
        data: updatePayload,
      });
      expect(mockPrismaService.keyResult.update).toHaveBeenCalledTimes(1);
    });

    it('should throw KeyResultNotFoundException when updating non-existent key result', async () => {
      const keyResultId = '123';

      const prismaError = new PrismaClientKnownRequestError('Not found', {
        code: 'P2025',
        clientVersion: '5.x',
      });

      mockPrismaService.keyResult.update.mockRejectedValue(prismaError);

      await expect(
        keyResultService.update(keyResultId, { description: 'New' } as any),
      ).rejects.toThrow(KeyResultNotFoundException);

      expect(mockPrismaService.keyResult.update).toHaveBeenCalledWith({
        where: { id: keyResultId },
        data: { description: 'New' },
      });
      expect(mockPrismaService.keyResult.update).toHaveBeenCalledTimes(1);
    });
  });
});
