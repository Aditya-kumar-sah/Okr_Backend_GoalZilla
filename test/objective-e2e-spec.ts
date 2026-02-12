import { INestApplication } from '@nestjs/common';
import { App } from 'supertest/types';
import { Test, TestingModule } from '@nestjs/testing';
import { AppModule } from '../src/app.module';
import { PrismaService } from '../src/prisma.service';
import request from 'supertest';

describe('ObjectiveE2E', () => {
  let app: INestApplication<App>;
  let prismaService: PrismaService;

  beforeEach(async () => {
    const moduleRef: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleRef.createNestApplication();

    await app.init();

    prismaService = app.get(PrismaService);
    await prismaService.objective.deleteMany({});
  });

  describe('GET  /objective', () => {
    it('should return an array of objectives', async () => {
      const objective = await prismaService.objective.create({
        data: {
          title: 'Aditya',
        },
        include: {
          keyResult: true,
        },
      });

      await request(app.getHttpServer())
        .get('/objective')
        .expect(200)
        .expect([
          {
            id: objective.id,
            createdAt: objective.createdAt.toISOString(),
            title: objective.title,
            keyResult: objective.keyResult,
          },
        ]);
    });

    describe('POST /objective', () => {
      it('should create an objective', async () => {
        const response = await request(app.getHttpServer())
          .post('/objective')
          .send({ title: 'Aditya' })
          .expect(201);

        expect(response.body).toMatchObject({
          title: 'Aditya',
        });

      });
    });
  });
});
