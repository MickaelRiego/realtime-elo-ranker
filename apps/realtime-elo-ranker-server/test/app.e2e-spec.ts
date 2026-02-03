import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import request from 'supertest';
import { AppModule } from './../src/app.module';
import { DataSource } from 'typeorm';

describe('AppController (e2e)', () => {
  let app: INestApplication;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    app.setGlobalPrefix('api');
    await app.init();

    const dataSource = app.get(DataSource);
    await dataSource.synchronize(true);
  });

  afterAll(async () => {
    await app.close();
  });

  describe('Scénario complet : Match ELO', () => {
    it('1. Créer Alice (Joueur A)', () => {
      return request(app.getHttpServer())
        .post('/api/player')
        .send({ id: 'Alice' })
        .expect(201)
        .expect((res) => {
          expect(res.body.id).toBe('Alice');
          expect(res.body.rank).toBe(1200);
        });
    });

    it('2. Créer Bob (Joueur B)', () => {
      return request(app.getHttpServer())
        .post('/api/player')
        .send({ id: 'Bob' })
        .expect(201)
        .expect((res) => {
          expect(res.body.id).toBe('Bob');
          expect(res.body.rank).toBe(1200);
        });
    });

    it('3. Alice bat Bob', () => {
      return request(app.getHttpServer())
        .post('/api/match')
        .send({
          winner: 'Alice',
          loser: 'Bob',
          draw: false,
        })
        .expect(201)
        .expect((res) => {
          expect(res.body.winner.id).toBe('Alice');
          expect(res.body.winner.rank).toBeGreaterThan(1200);
          expect(res.body.loser.id).toBe('Bob');
          expect(res.body.loser.rank).toBeLessThan(1200);
        });
    });

    it('4. Vérifier le classement global', () => {
      return request(app.getHttpServer())
        .get('/api/ranking')
        .expect(200)
        .expect((res) => {
          const ranking = res.body;
          expect(Array.isArray(ranking)).toBe(true);
          expect(ranking.length).toBeGreaterThanOrEqual(2);
          expect(ranking[0].id).toBe('Alice');
          expect(ranking[1].id).toBe('Bob');
        });
    });
  });
});