import { ObjectiveService } from '../objective.service';
import { Test } from '@nestjs/testing';
import { PrismaService } from '../../prisma.service';
import { ObjectiveTitleDuplicateException } from '../exception/objectiveError';

describe('ObjectiveService', () => {
  describe('get All Objective', () => {
    const mockPrismaService = {
      objective: {
        findMany: jest.fn(),
      },
    };
    let objectiveService: ObjectiveService;
    beforeEach(async () => {
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
            },
            {
              id: '2',
              description: 'Test key result 2',
              progress: 97,
              objective_id: '1',
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
      const mockError = {
        code: 'P2002',
      };

      mockPrismaService.objective.create.mockRejectedValue(mockError);

      await expect(
        objectiveService.create({ title: 'Test 1' }),
      ).rejects.toBeInstanceOf(ObjectiveTitleDuplicateException);

      expect(mockPrismaService.objective.create).toHaveBeenCalledTimes(1);
      expect(mockPrismaService.objective.create).toHaveBeenCalledWith({
        data: {
          title: 'Test 1',
        },
      });
    });
  });
});
