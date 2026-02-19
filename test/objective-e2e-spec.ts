import { INestApplication } from '@nestjs/common';
import { App } from 'supertest/types';
import { Test, TestingModule } from '@nestjs/testing';
import { AppModule } from '../src/app.module';
import { PrismaService } from '../src/prisma.service';
import request from 'supertest';

describe('objective-e2e', () => {
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

  afterAll(async () => {
    await app.close();
  });

  describe('GET /objective', () => {
    it('should return an array of objectives when objectives exist', async () => {
      const objective = await prismaService.objective.create({
        data: {
          title: 'Improve Code Quality',
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

    it('should return an empty array when no objectives exist', async () => {
      await request(app.getHttpServer())
        .get('/objective')
        .expect(200)
        .expect([]);
    });

    it('should return all objectives with their key results', async () => {
      const obj1 = await prismaService.objective.create({
        data: { title: 'Q1 Goals' },
        include: { keyResult: true },
      });

      const obj2 = await prismaService.objective.create({
        data: { title: 'Q2 Goals' },
        include: { keyResult: true },
      });

      const response = await request(app.getHttpServer())
        .get('/objective')
        .expect(200);

      expect(response.body).toHaveLength(2);
      expect(response.body.map((o) => o.title)).toContain('Q1 Goals');
      expect(response.body.map((o) => o.title)).toContain('Q2 Goals');
    });
  });

  describe('POST /objective', () => {
    it('should create an objective with valid title', async () => {
      const response = await request(app.getHttpServer())
        .post('/objective')
        .send({ title: 'Improve Code Quality' })
        .expect(201);

      expect(response.body).toMatchObject({
        title: 'Improve Code Quality',
      });
      expect(response.body).toHaveProperty('id');
      expect(response.body).toHaveProperty('createdAt');
    });

    it('should throw ObjectiveTitleDuplicateException when creating objective with duplicate title', async () => {
      await prismaService.objective.create({
        data: { title: 'Unique Goal' },
      });

      await request(app.getHttpServer())
        .post('/objective')
        .send({ title: 'Unique Goal' })
        .expect(400);
    });

    it('should require title field when creating objective', async () => {
      await request(app.getHttpServer())
        .post('/objective')
        .send({})
        .expect(400);
    });

    it('should trim and create objective with whitespace in title', async () => {
      const response = await request(app.getHttpServer())
        .post('/objective')
        .send({ title: '  Trimmed Goal  ' })
        .expect(201);

      expect(response.body.title).toBeDefined();
    });
  });

  describe('GET /objective/:id', () => {
    it('should return objective with key results when objective exists', async () => {
      const objective = await prismaService.objective.create({
        data: { title: 'Test Objective' },
        include: { keyResult: true },
      });

      const response = await request(app.getHttpServer())
        .get(`/objective/${objective.id}`)
        .expect(200);

      expect(response.body).toMatchObject({
        id: objective.id,
        title: 'Test Objective',
      });
      expect(response.body).toHaveProperty('keyResult');
    });

    it('should throw ObjectiveNotFoundException when objective does not exist', async () => {
      const fakeId = '00000000-0000-0000-0000-000000000000';

      await request(app.getHttpServer())
        .get(`/objective/${fakeId}`)
        .expect(404);
    });

    it('should return objective with associated key results', async () => {
      const objective = await prismaService.objective.create({
        data: {
          title: 'Goal with KRs',
          keyResult: {
            create: [
              {
                description: 'KR 1',
                currentProgress: 50,
                targetProgress: 100,
                metric: 'percent',
              },
              {
                description: 'KR 2',
                currentProgress: 25,
                targetProgress: 100,
                metric: 'items',
              },
            ],
          },
        },
        include: { keyResult: true },
      });

      const response = await request(app.getHttpServer())
        .get(`/objective/${objective.id}`)
        .expect(200);

      expect(response.body.keyResult).toHaveLength(2);
      expect(response.body.keyResult[0].description).toBe('KR 1');
    });
  });

  describe('PUT /objective/:id', () => {
    it('should update objective and return updated object when objective exists', async () => {
      const objective = await prismaService.objective.create({
        data: { title: 'Original Title' },
      });

      const response = await request(app.getHttpServer())
        .put(`/objective/${objective.id}`)
        .send({ title: 'Updated Title' })
        .expect(200);

      expect(response.body).toMatchObject({
        id: objective.id,
        title: 'Updated Title',
      });
    });

    it('should throw ObjectiveNotFoundException when updating non-existent objective', async () => {
      const fakeId = '00000000-0000-0000-0000-000000000000';

      await request(app.getHttpServer())
        .put(`/objective/${fakeId}`)
        .send({ title: 'New Title' })
        .expect(404);
    });

    it('should throw ObjectiveTitleDuplicateException when updating to existing title', async () => {
      const obj1 = await prismaService.objective.create({
        data: { title: 'Title One' },
      });

      await prismaService.objective.create({
        data: { title: 'Title Two' },
      });

      await request(app.getHttpServer())
        .put(`/objective/${obj1.id}`)
        .send({ title: 'Title Two' })
        .expect(400);
    });

    it('should update objective with same title without error', async () => {
      const objective = await prismaService.objective.create({
        data: { title: 'Same Title' },
      });

      const response = await request(app.getHttpServer())
        .put(`/objective/${objective.id}`)
        .send({ title: 'Same Title' })
        .expect(200);

      expect(response.body.title).toBe('Same Title');
    });
  });

  describe('DELETE /objective/:id', () => {
    it('should delete and return deleted objective when objective exists', async () => {
      const objective = await prismaService.objective.create({
        data: { title: 'To Delete' },
      });

      const response = await request(app.getHttpServer())
        .delete(`/objective/${objective.id}`)
        .expect(200);

      expect(response.body).toMatchObject({
        id: objective.id,
        title: 'To Delete',
      });

      const deleted = await prismaService.objective.findUnique({
        where: { id: objective.id },
      });

      expect(deleted).toBeNull();
    });

    it('should throw ObjectiveNotFoundException when deleting non-existent objective', async () => {
      const fakeId = '00000000-0000-0000-0000-000000000000';

      await request(app.getHttpServer())
        .delete(`/objective/${fakeId}`)
        .expect(404);
    });

    it('should delete objective and cascade delete associated key results', async () => {
      const objective = await prismaService.objective.create({
        data: {
          title: 'Goal with KRs to Delete',
          keyResult: {
            create: [
              {
                description: 'KR to delete',
                currentProgress: 10,
                targetProgress: 100,
              },
            ],
          },
        },
        include: { keyResult: true },
      });

      await request(app.getHttpServer())
        .delete(`/objective/${objective.id}`)
        .expect(200);

      const keyResults = await prismaService.keyResult.findMany({
        where: { objectiveId: objective.id },
      });

      expect(keyResults).toHaveLength(0);
    });
  });

  describe('GET /objective/:id/isComplete', () => {
    it('should return isObjectCompleted true and progress 100 when all key results are complete', async () => {
      const objective = await prismaService.objective.create({
        data: {
          title: 'Complete Goal',
          keyResult: {
            create: [
              {
                description: 'KR 1',
                currentProgress: 100,
                targetProgress: 100,
              },
              {
                description: 'KR 2',
                currentProgress: 150,
                targetProgress: 100,
              },
            ],
          },
        },
      });

      const response = await request(app.getHttpServer())
        .get(`/objective/${objective.id}/is-complete`)
        .expect(200);

      expect(response.body).toEqual({
        isObjectCompleted: true,
        objectiveProgress: 100,
      });
    });

    it('should return isObjectCompleted false when one key result is below target', async () => {
      const objective = await prismaService.objective.create({
        data: {
          title: 'Incomplete Goal',
          keyResult: {
            create: [
              {
                description: 'KR 1',
                currentProgress: 100,
                targetProgress: 100,
              },
              {
                description: 'KR 2',
                currentProgress: 50,
                targetProgress: 100,
              },
            ],
          },
        },
      });

      const response = await request(app.getHttpServer())
        .get(`/objective/${objective.id}/is-complete`)
        .expect(200);

      expect(response.body.isObjectCompleted).toBe(false);
      expect(response.body.objectiveProgress).toBe(75);
    });

    it('should return progress 100 for objective with no key results', async () => {
      const objective = await prismaService.objective.create({
        data: { title: 'Goal Without KRs' },
      });

      const response = await request(app.getHttpServer())
        .get(`/objective/${objective.id}/is-complete`)
        .expect(200);

      expect(response.body).toEqual({
        isObjectCompleted: true,
        objectiveProgress: 100,
      });
    });

    it('should calculate progress correctly with multiple key results', async () => {
      const objective = await prismaService.objective.create({
        data: {
          title: 'Multi KR Goal',
          keyResult: {
            create: [
              {
                description: 'KR 1 - 50% done',
                currentProgress: 50,
                targetProgress: 100,
              },
              {
                description: 'KR 2 - 100% done',
                currentProgress: 100,
                targetProgress: 100,
              },
              {
                description: 'KR 3 - 0% done',
                currentProgress: 0,
                targetProgress: 100,
              },
            ],
          },
        },
      });

      const response = await request(app.getHttpServer())
        .get(`/objective/${objective.id}/is-complete`)
        .expect(200);

      expect(response.body.isObjectCompleted).toBe(false);
      expect(response.body.objectiveProgress).toBeCloseTo(50, 1);
    });

    it('should throw ObjectiveNotFoundException when objective does not exist', async () => {
      const fakeId = '00000000-0000-0000-0000-000000000000';

      await request(app.getHttpServer())
        .get(`/objective/${fakeId}/is-complete`)
        .expect(404);
    });
  });
});
