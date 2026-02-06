import {Test} from "@nestjs/testing";
import {KeyResultService} from "../key-result.service";
import {PrismaService} from "../../prisma.service";

describe('key-result', () => {

    const mockPrismaService = {
        keyResult: {
            findMany: jest.fn()
        },
    };
    let keyResultService: KeyResultService;


    describe('get keyResult for a particular objectiveId', () => {

        beforeEach(async () => {
            const moduleRef = await Test.createTestingModule({
                providers: [KeyResultService, {provide: PrismaService, useValue: mockPrismaService}],

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
                }
            ]

            mockPrismaService.keyResult.findMany.mockResolvedValue(mockKeyResultList);

            const result = await keyResultService.getAll('1');
            expect(result).toBe(mockKeyResultList);
            expect(mockPrismaService.keyResult.findMany).toHaveBeenCalledTimes(1);
            expect(mockPrismaService.keyResult.findMany).toHaveBeenCalledWith({
                where: {
                    objective_id: '1',
                }
            });
        });
    })
})