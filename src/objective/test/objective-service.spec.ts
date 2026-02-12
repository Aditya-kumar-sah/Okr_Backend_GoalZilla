import { ObjectiveService } from '../objective.service';
import { Test } from '@nestjs/testing';
import { PrismaService } from '../../prisma.service';
import {
  ObjectiveNotFoundException,
  ObjectiveTitleDuplicateException,
} from '../exception/objectiveError';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/client';

describe('ObjectiveService', () => {
  describe('get All Objective', () => {
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

    it('should return an array of Objectives', async () => {
      const mockObjectiveList = [
        {
          id: '1',
          title: 'Test 1',
          keyResult: [
            {
              id: '1',
              description: 'Test key result 1',
              progress: 97,
              objective_id: '1',
              target_progress: 100,
              metric: 'Percentage',
            },
            {
              id: '2',
              description: 'Test key result 2',
              progress: 97,
              objective_id: '1',
              target_progress: 100,
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
  });

  describe('create Objective', () => {
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
    it('should create Objective and return created objective', async () => {
      const mockObjective = {
        id: '1',
        title: 'Test 1',
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
    it('should throw ObjectiveTitleDuplicateException if objective with given title already exists ', async () => {
      const mockError = new PrismaClientKnownRequestError(
        'Unique constraint failed',
        {
          code: 'P2002',
          clientVersion: '4.0.0',
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

  describe('delete Objective', () => {
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
    it('should delete Objective and return deleted objective', async () => {
      const mockObjective = {
        id: '1',
        title: 'Test 1',
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
    it('should throw ObjectiveNotFoundException if objective with given id do not exists ', async () => {
      const mockError = new PrismaClientKnownRequestError(
        'Unique constraint failed',
        {
          code: 'P2025',
          clientVersion: '4.0.0',
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

  describe('update Objective', () => {
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
    it('should update Objective and return updated objective', async () => {
      mockPrismaService.objective.update.mockResolvedValue({
        id: '1',
        title: 'Test 2',
      });

      const result = await objectiveService.update('1', { title: 'Test 2' });
      expect(result).toEqual({ id: '1', title: 'Test 2' });
      expect(mockPrismaService.objective.update).toHaveBeenCalledTimes(1);
      expect(mockPrismaService.objective.update).toHaveBeenCalledWith({
        where: {
          id: '1',
        },
        data: {
          title: 'Test 2',
        },
      });
    });
    it('should throw ObjectiveNotFoundException if objective with given id do not exists ', async () => {
      const mockError = new PrismaClientKnownRequestError(
        'Unique constraint failed',
        {
          code: 'P2025',
          clientVersion: '4.0.0',
        },
      );

      mockPrismaService.objective.update.mockRejectedValue(mockError);

      await expect(
        objectiveService.update('1', { title: 'Test' }),
      ).rejects.toThrow(ObjectiveNotFoundException);

      expect(mockPrismaService.objective.update).toHaveBeenCalledTimes(1);
      expect(mockPrismaService.objective.update).toHaveBeenCalledWith({
        where: {
          id: '1',
        },
        data: {
          title: 'Test',
        },
      });
    });
    it('should throw ObjectiveTitleDuplicateException if objective with given updated title already exists ', async () => {
      const mockError = new PrismaClientKnownRequestError(
        'Unique constraint failed',
        {
          code: 'P2002',
          clientVersion: '4.0.0',
        },
      );

      mockPrismaService.objective.update.mockRejectedValue(mockError);

      await expect(
        objectiveService.update('1', { title: 'Test' }),
      ).rejects.toThrow(ObjectiveTitleDuplicateException);

      expect(mockPrismaService.objective.update).toHaveBeenCalledTimes(1);
      expect(mockPrismaService.objective.update).toHaveBeenCalledWith({
        where: {
          id: '1',
        },
        data: {
          title: 'Test',
        },
      });
    });
  });

  describe('get Objective by Id', () => {
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
    it('should return objective with given id such that objective with that id exist', async () => {
      const mockObjective = {
        id: '1',
        title: 'Test 1',
        keyResult: [
          {
            id: '1',
            description: 'Test 1 key',
            progress: 100,
            objective_id: '1',
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
    it('should throw ObjectiveNotFoundException if objective with given id do not exists ', async () => {
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

  const getMockObjective = (progress: number[][]) => {
    return {
      id: '1',
      title: 'Test 1',
      keyResult: progress.map((currentProgress, index) => {
        return {
          id: index,
          progress: currentProgress[0],
          target_progress: currentProgress[1],
          isCompleted: false,
          objective_id: '1',
        };
      }),
    };
  };

  describe('is Objective completed', () => {
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

    // it.each([[[100, 100]], [[100]]])(
    //   'should return true if all keyResults are %p',
    //   async (parameter) => {
    //     mockPrismaService.objective.findUnique.mockResolvedValue(
    //       getMockObjective(parameter),
    //     );
    //     const result = await objectiveService.isComplete('1');
    //     expect(result).toBeTruthy();
    //   },
    // );

    it.each([
      {
        progress: [[100, 100]],
        message:
          'isObjectCompleted as true and objectiveProgress as 100% if progress of every keyResult is 100%',
        expected: { isObjectCompleted: true, objectiveProgress: 100 },
      },
      {
        progress: [
          [100, 100],
          [120, 120],
        ],
        message:
          'isObjectCompleted as true and objectiveProgress as 100% if progress of every keyResult is equal to target progress',
        expected: { isObjectCompleted: true, objectiveProgress: 100 },
      },
      {
        progress: [
          [100, 100],
          [70, 100],
        ],
        message:
          'isObjectCompleted as false and objectiveProgress not as 100% if progress of one of keyResult is not equal to target progress',
        expected: { isObjectCompleted: false, objectiveProgress: 85 },
      },
    ])(`it should return $message`, async (parameter) => {
      mockPrismaService.objective.findUnique.mockResolvedValue(
        getMockObjective(parameter.progress),
      );
      const result = await objectiveService.isComplete('1');
      expect(result).toEqual(parameter.expected);
    });

    // it('should return false if one of the key-result is not completed', async () => {
    //   mockPrismaService.objective.findUnique.mockResolvedValue(
    //     getMockObjective([100, 50]),
    //   );
    //   const result = await objectiveService.isComplete('1');
    //   expect(result).toBeFalsy();
    // });

    it('should throw ObjectiveNotFoundException if objective with given id do not exists ', async () => {
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
