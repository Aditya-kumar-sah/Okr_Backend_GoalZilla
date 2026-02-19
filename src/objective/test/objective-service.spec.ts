import { Test } from '@nestjs/testing';
import { ObjectiveService } from '../objective.service';
import { PrismaService } from '../../prisma.service';
import {
  ObjectiveNotFoundException,
  ObjectiveTitleDuplicateException,
} from '../exception/objectiveError';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/client';

describe('objective-service', () => {
  describe('get all objectives', () => {
    const mockPrismaService = {
      objective: {
        findMany: jest.fn(),
      },
    };
    let objectiveService: ObjectiveService;
    beforeEach(async () => {
      jest.clearAllMocks();
      const moduleRef = await Test.createTestingModule({
        providers: [
          ObjectiveService,
          { provide: PrismaService, useValue: mockPrismaService },
        ],
      }).compile();
      objectiveService = await moduleRef.resolve(ObjectiveService);
    });

    it('should return all objectives with their key results when objectives exist', async () => {
      const mockObjectiveList = [
        {
          id: '1',
          title: 'Test 1',
          createdAt: new Date(),
          keyResult: [
            {
              id: '1',
              description: 'Test key result 1',
              currentProgress: 97,
              targetProgress: 100,
              isCompleted: false,
              objectiveId: '1',
              metric: 'Percentage',
            },
            {
              id: '2',
              description: 'Test key result 2',
              currentProgress: 97,
              targetProgress: 100,
              isCompleted: false,
              objectiveId: '1',
              metric: 'Percentage',
            },
          ],
        },
      ];

      mockPrismaService.objective.findMany.mockResolvedValue(mockObjectiveList);

      const result = await objectiveService.getAll();
      expect(result).toBe(mockObjectiveList);
      expect(mockPrismaService.objective.findMany).toHaveBeenCalledTimes(1);
      expect(mockPrismaService.objective.findMany).toHaveBeenCalledWith({
        include: {
          keyResult: true,
        },
      });
    });

    it('should return empty array when no objectives exist', async () => {
      mockPrismaService.objective.findMany.mockResolvedValue([]);

      const result = await objectiveService.getAll();
      expect(result).toEqual([]);
      expect(mockPrismaService.objective.findMany).toHaveBeenCalledTimes(1);
      expect(mockPrismaService.objective.findMany).toHaveBeenCalledWith({
        include: {
          keyResult: true,
        },
      });
    });
  });

  describe('create objective', () => {
    const mockPrismaService = {
      objective: {
        create: jest.fn(),
      },
    };
    let objectiveService: ObjectiveService;
    beforeEach(async () => {
      jest.clearAllMocks();
      const moduleRef = await Test.createTestingModule({
        providers: [
          ObjectiveService,
          { provide: PrismaService, useValue: mockPrismaService },
        ],
      }).compile();
      objectiveService = await moduleRef.resolve(ObjectiveService);
    });

    it('should create objective and return created objective with all properties', async () => {
      const mockObjective = {
        id: '1',
        title: 'Test 1',
        createdAt: new Date(),
      };

      mockPrismaService.objective.create.mockResolvedValue(mockObjective);

      const result = await objectiveService.create({ title: 'Test 1' });
      expect(result).toBe(mockObjective);
      expect(mockPrismaService.objective.create).toHaveBeenCalledTimes(1);
      expect(mockPrismaService.objective.create).toHaveBeenCalledWith({
        data: {
          title: 'Test 1',
        },
      });
    });

    it('should throw ObjectiveTitleDuplicateException when creating objective with duplicate title', async () => {
      const mockError = new PrismaClientKnownRequestError(
        'Unique constraint failed on the fields: (title)',
        {
          code: 'P2002',
          clientVersion: '5.x',
        },
      );

      mockPrismaService.objective.create.mockRejectedValue(mockError);

      await expect(
        objectiveService.create({ title: 'Test 1' }),
      ).rejects.toThrow(ObjectiveTitleDuplicateException);

      expect(mockPrismaService.objective.create).toHaveBeenCalledTimes(1);
      expect(mockPrismaService.objective.create).toHaveBeenCalledWith({
        data: {
          title: 'Test 1',
        },
      });
    });
  });

  describe('delete objective by id', () => {
    const mockPrismaService = {
      objective: {
        delete: jest.fn(),
      },
    };
    let objectiveService: ObjectiveService;
    beforeEach(async () => {
      jest.clearAllMocks();
      const moduleRef = await Test.createTestingModule({
        providers: [
          ObjectiveService,
          { provide: PrismaService, useValue: mockPrismaService },
        ],
      }).compile();
      objectiveService = await moduleRef.resolve(ObjectiveService);
    });

    it('should delete objective and return deleted objective when objective exists', async () => {
      const mockObjective = {
        id: '1',
        title: 'Test 1',
        createdAt: new Date(),
      };

      mockPrismaService.objective.delete.mockResolvedValue(mockObjective);

      const result = await objectiveService.delete('1');
      expect(result).toBe(mockObjective);
      expect(mockPrismaService.objective.delete).toHaveBeenCalledTimes(1);
      expect(mockPrismaService.objective.delete).toHaveBeenCalledWith({
        where: {
          id: '1',
        },
      });
    });

    it('should throw ObjectiveNotFoundException when deleting non-existent objective', async () => {
      const mockError = new PrismaClientKnownRequestError(
        'An operation failed because it depends on one or more records that were required but not found. Record to delete does not exist.',
        {
          code: 'P2025',
          clientVersion: '5.x',
        },
      );

      mockPrismaService.objective.delete.mockRejectedValue(mockError);

      await expect(objectiveService.delete('1')).rejects.toThrow(
        ObjectiveNotFoundException,
      );

      expect(mockPrismaService.objective.delete).toHaveBeenCalledTimes(1);
      expect(mockPrismaService.objective.delete).toHaveBeenCalledWith({
        where: {
          id: '1',
        },
      });
    });
  });

  describe('update objective by id', () => {
    const mockPrismaService = {
      objective: {
        update: jest.fn(),
      },
    };
    let objectiveService: ObjectiveService;
    beforeEach(async () => {
      jest.clearAllMocks();
      const moduleRef = await Test.createTestingModule({
        providers: [
          ObjectiveService,
          { provide: PrismaService, useValue: mockPrismaService },
        ],
      }).compile();
      objectiveService = await moduleRef.resolve(ObjectiveService);
    });

    it('should update objective and return updated objective when objective exists', async () => {
      const updatedObjective = {
        id: '1',
        title: 'Updated Title',
        createdAt: new Date(),
      };

      mockPrismaService.objective.update.mockResolvedValue(updatedObjective);

      const result = await objectiveService.update('1', { title: 'Updated Title' });
      expect(result).toEqual(updatedObjective);
      expect(mockPrismaService.objective.update).toHaveBeenCalledTimes(1);
      expect(mockPrismaService.objective.update).toHaveBeenCalledWith({
        where: {
          id: '1',
        },
        data: {
          title: 'Updated Title',
        },
      });
    });

    it('should throw ObjectiveNotFoundException when updating non-existent objective', async () => {
      const mockError = new PrismaClientKnownRequestError(
        'An operation failed because it depends on one or more records that were required but not found. Record to update does not exist.',
        {
          code: 'P2025',
          clientVersion: '5.x',
        },
      );

      mockPrismaService.objective.update.mockRejectedValue(mockError);

      await expect(
        objectiveService.update('1', { title: 'Updated Title' }),
      ).rejects.toThrow(ObjectiveNotFoundException);

      expect(mockPrismaService.objective.update).toHaveBeenCalledTimes(1);
      expect(mockPrismaService.objective.update).toHaveBeenCalledWith({
        where: {
          id: '1',
        },
        data: {
          title: 'Updated Title',
        },
      });
    });

    it('should throw ObjectiveTitleDuplicateException when updating objective with duplicate title', async () => {
      const mockError = new PrismaClientKnownRequestError(
        'Unique constraint failed on the fields: (title)',
        {
          code: 'P2002',
          clientVersion: '5.x',
        },
      );

      mockPrismaService.objective.update.mockRejectedValue(mockError);

      await expect(
        objectiveService.update('1', { title: 'Existing Title' }),
      ).rejects.toThrow(ObjectiveTitleDuplicateException);

      expect(mockPrismaService.objective.update).toHaveBeenCalledTimes(1);
      expect(mockPrismaService.objective.update).toHaveBeenCalledWith({
        where: {
          id: '1',
        },
        data: {
          title: 'Existing Title',
        },
      });
    });
  });

  describe('get objective by id', () => {
    const mockPrismaService = {
      objective: {
        findUnique: jest.fn(),
      },
    };
    let objectiveService: ObjectiveService;
    beforeEach(async () => {
      jest.clearAllMocks();
      const moduleRef = await Test.createTestingModule({
        providers: [
          ObjectiveService,
          { provide: PrismaService, useValue: mockPrismaService },
        ],
      }).compile();
      objectiveService = await moduleRef.resolve(ObjectiveService);
    });

    it('should return objective with all key results when objective exists', async () => {
      const mockObjective = {
        id: '1',
        title: 'Test 1',
        createdAt: new Date(),
        keyResult: [
          {
            id: '1',
            description: 'Test 1 key',
            currentProgress: 100,
            targetProgress: 100,
            isCompleted: false,
            objectiveId: '1',
            metric: 'Percentage',
          },
        ],
      };

      mockPrismaService.objective.findUnique.mockResolvedValue(mockObjective);

      const result = await objectiveService.getObjectiveById('1');
      expect(result).toBe(mockObjective);
      expect(mockPrismaService.objective.findUnique).toHaveBeenCalledTimes(1);
      expect(mockPrismaService.objective.findUnique).toHaveBeenCalledWith({
        where: {
          id: '1',
        },
        include: {
          keyResult: true,
        },
      });
    });

    it('should throw ObjectiveNotFoundException when objective does not exist', async () => {
      mockPrismaService.objective.findUnique.mockResolvedValue(null);

      await expect(objectiveService.getObjectiveById('1')).rejects.toThrow(
        ObjectiveNotFoundException,
      );

      expect(mockPrismaService.objective.findUnique).toHaveBeenCalledTimes(1);
      expect(mockPrismaService.objective.findUnique).toHaveBeenCalledWith({
        where: {
          id: '1',
        },
        include: {
          keyResult: true,
        },
      });
    });
  });

  const getMockObjective = (progressData: number[][]) => {
    return {
      id: '1',
      title: 'Test 1',
      createdAt: new Date(),
      keyResult: progressData.map((progress, index) => {
        return {
          id: String(index),
          currentProgress: progress[0],
          targetProgress: progress[1],
          isCompleted: progress[0] >= progress[1],
          objectiveId: '1',
          description: `Key Result ${index + 1}`,
          metric: 'Percentage',
        };
      }),
    };
  };

  describe('check if objective is complete', () => {
    const mockPrismaService = {
      objective: {
        findUnique: jest.fn(),
      },
    };
    let objectiveService: ObjectiveService;
    beforeEach(async () => {
      jest.clearAllMocks();
      const moduleRef = await Test.createTestingModule({
        providers: [
          ObjectiveService,
          { provide: PrismaService, useValue: mockPrismaService },
        ],
      }).compile();
      objectiveService = await moduleRef.resolve(ObjectiveService);
    });

    it('should return isObjectCompleted as true and objectiveProgress as 100 when single key result reaches target progress', async () => {
      mockPrismaService.objective.findUnique.mockResolvedValue(
        getMockObjective([[100, 100]]),
      );

      const result = await objectiveService.isComplete('1');
      expect(result).toEqual({ isObjectCompleted: true, objectiveProgress: 100 });
    });

    it('should return isObjectCompleted as true and objectiveProgress as 100 when all key results reach target progress', async () => {
      mockPrismaService.objective.findUnique.mockResolvedValue(
        getMockObjective([
          [100, 100],
          [120, 120],
        ]),
      );

      const result = await objectiveService.isComplete('1');
      expect(result).toEqual({ isObjectCompleted: true, objectiveProgress: 100 });
    });

    it('should return isObjectCompleted as false and correct objectiveProgress when one key result is below target progress', async () => {
      mockPrismaService.objective.findUnique.mockResolvedValue(
        getMockObjective([
          [100, 100],
          [70, 100],
        ]),
      );

      const result = await objectiveService.isComplete('1');
      expect(result).toEqual({ isObjectCompleted: false, objectiveProgress: 85 });
    });

    it('should return isObjectCompleted as false and zero objectiveProgress when all key results have no progress', async () => {
      mockPrismaService.objective.findUnique.mockResolvedValue(
        getMockObjective([
          [0, 100],
          [0, 100],
        ]),
      );

      const result = await objectiveService.isComplete('1');
      expect(result).toEqual({ isObjectCompleted: false, objectiveProgress: 0 });
    });

    it('should return isObjectCompleted as false and 50 percent objectiveProgress when half of key result progress is complete', async () => {
      mockPrismaService.objective.findUnique.mockResolvedValue(
        getMockObjective([[50, 100]]),
      );

      const result = await objectiveService.isComplete('1');
      expect(result).toEqual({ isObjectCompleted: false, objectiveProgress: 50 });
    });

    it('should return isObjectCompleted as true and objectiveProgress as 100 when objective has no key results', async () => {
      const objectiveWithNoKeyResults = {
        id: '1',
        title: 'Test 1',
        createdAt: new Date(),
        keyResult: [],
      };
      mockPrismaService.objective.findUnique.mockResolvedValue(
        objectiveWithNoKeyResults,
      );

      const result = await objectiveService.isComplete('1');
      expect(result).toEqual({ isObjectCompleted: true, objectiveProgress: 100 });
    });

    it('should throw ObjectiveNotFoundException when objective does not exist', async () => {
      mockPrismaService.objective.findUnique.mockResolvedValue(null);

      await expect(objectiveService.isComplete('1')).rejects.toThrow(
        ObjectiveNotFoundException,
      );

      expect(mockPrismaService.objective.findUnique).toHaveBeenCalledTimes(1);
      expect(mockPrismaService.objective.findUnique).toHaveBeenCalledWith({
        where: {
          id: '1',
        },
        include: {
          keyResult: true,
        },
      });
    });
  });
});
