import { Test } from '@nestjs/testing';
import { KeyResultService } from '../key-result.service';
import { PrismaService } from '../../prisma.service';
import { ObjectiveNotFoundException } from '../../objective/exception/objectiveError';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/client';
import { KeyResultNotFoundException } from '../exception/keyResult.exception';

describe('key-result', () => {
  describe('get keyResult for a particular objectiveId', () => {
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

    it('should return all the key results corresponding to the given objective id', async () => {
      const mockKeyResultList = [
        {
          id: '1',
          description: 'Test key result 1',
          progress: 97,
          objective_id: '1',
        },
        {
          id: '2',
          description: 'Test key result 2',
          progress: 97,
          objective_id: '1',
        },
      ];
      const mockObjective = {
        id: '1',
        title: 'Test',
      };

      mockPrismaService.keyResult.findMany.mockResolvedValue(mockKeyResultList);
      mockPrismaService.objective.findUnique.mockResolvedValue(mockObjective);

      const result = await keyResultService.getAll('1');
      expect(result).toBe(mockKeyResultList);
      expect(mockPrismaService.keyResult.findMany).toHaveBeenCalledTimes(1);
      expect(mockPrismaService.keyResult.findMany).toHaveBeenCalledWith({
        where: {
          objective_id: '1',
        },
      });
      expect(mockPrismaService.objective.findUnique).toHaveBeenCalledTimes(1);
      expect(mockPrismaService.objective.findUnique).toHaveBeenCalledWith({
        where: {
          id: '1',
        },
      });
    });
    it('should return ObjectiveNotFoundException if objective with given id not found', async () => {
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

  describe('create keyResult for a particular objectiveId', () => {
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

    it('should create and return the key result corresponding to the given objective id if objective exist', async () => {
      const mockKeyResult = {
        id: '1',
        description: 'Test key result 1',
        progress: 97,
        objective_id: '1',
      };

      const mockObjective = {
        id: '1',
        title: 'Test',
      };

      mockPrismaService.keyResult.create.mockResolvedValue(mockKeyResult);
      mockPrismaService.objective.findUnique.mockResolvedValue(mockObjective);

      const result = await keyResultService.create('1', {
        description: mockKeyResult.description,
        progress: mockKeyResult.progress,
      });

      expect(result).toBe(mockKeyResult);
      expect(mockPrismaService.keyResult.create).toHaveBeenCalledTimes(1);
      expect(mockPrismaService.keyResult.create).toHaveBeenCalledWith({
        data: {
          description: mockKeyResult.description,
          progress: mockKeyResult.progress,
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
    it('should return ObjectiveNotFoundException if objective with given id is not found', async () => {
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

  describe('delete keyResult for a particular keyResultId', () => {
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

    it('should delete and return the deleted key result if that keyResult exist', async () => {
      const mockKeyResult = {
        id: '1',
        description: 'Test key result 1',
        progress: 97,
        objective_id: '1',
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
    it('should return KeyResultNotFoundException if keyResult with given id is not found', async () => {
      const mockError = new PrismaClientKnownRequestError('NOT FOUND', {
        code: 'P2025',
        clientVersion: '4.0.0',
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

  describe('update keyResult with given id', () => {
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

    it('should update keyResult and return updated object', async () => {
      const keyResultId = '123';
      const updatePayload = { description: 'Updated Title' };

      const updatedKeyResult = {
        id: keyResultId,
        title: 'Updated Title',
      };

      mockPrismaService.keyResult.update.mockResolvedValue(updatedKeyResult);

      const result = await keyResultService.update(keyResultId, updatePayload);

      expect(result).toEqual(updatedKeyResult);
      expect(mockPrismaService.keyResult.update).toHaveBeenCalledWith({
        where: { id: keyResultId },
        data: updatePayload,
      });
      expect(mockPrismaService.keyResult.update).toHaveBeenCalledTimes(1);
    });

    it('should throw KeyResultNotFoundException if keyResult with given id not found', async () => {
      const keyResultId = '123';

      const prismaError = new PrismaClientKnownRequestError('Not found', {
        code: 'P2025',
        clientVersion: '5.x',
      });

      mockPrismaService.keyResult.update.mockRejectedValue(prismaError);

      await expect(
        keyResultService.update(keyResultId, { description: 'New' }),
      ).rejects.toThrow(KeyResultNotFoundException);

      expect(mockPrismaService.keyResult.update).toHaveBeenCalledWith({
        where: { id: keyResultId },
        data: { description: 'New' },
      });
      expect(mockPrismaService.keyResult.update).toHaveBeenCalledTimes(1);
    });
  });
});
