import { Test, TestingModule } from '@nestjs/testing';
import { MatchService } from './match.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Match } from './entities/match.entity';
import { PlayerService } from '../player/player.service';
import { EloService } from '../elo/elo.service';
import {
  BadRequestException,
  UnprocessableEntityException,
  NotFoundException,
} from '@nestjs/common';

describe('MatchService', () => {
  let service: MatchService;
  let playerService: any;
  let eloService: any;
  let repo: any;

  beforeEach(async () => {
    playerService = { findOne: jest.fn(), updateElo: jest.fn() };
    eloService = {
      calculateExpectedScore: jest.fn(),
      calculateNewRating: jest.fn(),
      emitUpdate: jest.fn(),
    };
    repo = {
      create: jest.fn(),
      save: jest.fn(),
      find: jest.fn(),
      findOneBy: jest.fn(),
      remove: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        MatchService,
        { provide: getRepositoryToken(Match), useValue: repo },
        { provide: PlayerService, useValue: playerService },
        { provide: EloService, useValue: eloService },
      ],
    }).compile();

    service = module.get<MatchService>(MatchService);
  });

  describe('create', () => {
    it('should throw BadRequest if winner == loser', async () => {
      await expect(
        service.create({ winner: 'A', loser: 'A', draw: false }),
      ).rejects.toThrow(BadRequestException);
    });

    it('should throw UnprocessableEntity if player not found', async () => {
      playerService.findOne.mockResolvedValue(null);
      await expect(
        service.create({ winner: 'A', loser: 'B', draw: false }),
      ).rejects.toThrow(UnprocessableEntityException);
    });

    it('should process match (Win)', async () => {
      playerService.findOne.mockResolvedValue({ id: 'P', elo: 1000 });
      eloService.calculateExpectedScore.mockReturnValue(0.5);
      eloService.calculateNewRating.mockReturnValue(1016);
      repo.create.mockReturnValue({});
      repo.save.mockResolvedValue({});

      const res = await service.create({
        winner: 'A',
        loser: 'B',
        draw: false,
      });

      expect(eloService.calculateNewRating).toHaveBeenCalled(); // Score 1 vs 0
      expect(playerService.updateElo).toHaveBeenCalledTimes(2);
      expect(res.winner.rank).toBe(1016);
    });

    it('should process match (Draw)', async () => {
      playerService.findOne.mockResolvedValue({ id: 'P', elo: 1000 });
      eloService.calculateExpectedScore.mockReturnValue(0.5);
      repo.create.mockReturnValue({});
      repo.save.mockResolvedValue({});

      await service.create({ winner: 'A', loser: 'B', draw: true });

      // On vérifie que le calcul se fait bien avec 0.5 (Draw)
      expect(eloService.calculateNewRating).toHaveBeenCalledWith(
        expect.any(Number),
        0.5,
        expect.any(Number),
      );
    });
  });

  describe('Finder methods', () => {
    it('findAll', async () => {
      repo.find.mockResolvedValue([]);
      expect(await service.findAll()).toEqual([]);
    });

    it('findOne success', async () => {
      repo.findOneBy.mockResolvedValue({ id: 1 });
      expect(await service.findOne(1)).toEqual({ id: 1 });
    });

    it('findOne fail', async () => {
      repo.findOneBy.mockResolvedValue(null);
      await expect(service.findOne(1)).rejects.toThrow(NotFoundException);
    });
  });

  describe('update & remove', () => {
    it('update should throw (forbidden)', () => {
      expect(() => service.update(1, {} as any)).toThrow(
        UnprocessableEntityException,
      );
    });

    it('remove should work', async () => {
      const m = { id: 1 };
      jest.spyOn(service, 'findOne').mockResolvedValue(m as any);
      await service.remove(1);
      expect(repo.remove).toHaveBeenCalledWith(m);
    });
  });
});
