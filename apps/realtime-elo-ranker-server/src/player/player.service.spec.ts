import { Test, TestingModule } from '@nestjs/testing';
import { PlayerService } from './player.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Player } from './entities/player.entity';
import { EloService } from '../elo/elo.service';
import { ConflictException, NotFoundException } from '@nestjs/common';

describe('PlayerService', () => {
  let service: PlayerService;
  let repo: any;
  let eloService: any;

  const mockRepo = {
    find: jest.fn(),
    findOneBy: jest.fn(),
    create: jest.fn(),
    save: jest.fn(),
    remove: jest.fn(),
  };

  const mockElo = {
    updateRanking: jest.fn(),
    emitUpdate: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        PlayerService,
        { provide: getRepositoryToken(Player), useValue: mockRepo },
        { provide: EloService, useValue: mockElo },
      ],
    }).compile();

    service = module.get<PlayerService>(PlayerService);
    repo = module.get(getRepositoryToken(Player));
    eloService = module.get(EloService);
    jest.clearAllMocks();
  });

  it('onModuleInit should sync ranking', async () => {
    mockRepo.find.mockResolvedValue([]);
    await service.onModuleInit();
    expect(eloService.updateRanking).toHaveBeenCalled();
  });

  describe('create', () => {
    it('should create a player with default ELO if no players', async () => {
      mockRepo.findOneBy.mockResolvedValue(null);
      mockRepo.find.mockResolvedValue([]); // Moyenne -> 1200
      mockRepo.create.mockReturnValue({ id: 'Alice', elo: 1200 });
      mockRepo.save.mockResolvedValue({ id: 'Alice', elo: 1200 });

      const res = await service.create({ id: 'Alice' });
      expect(res.elo).toBe(1200);
      expect(eloService.emitUpdate).toHaveBeenCalled();
    });

    it('should create a player with average ELO', async () => {
      mockRepo.findOneBy.mockResolvedValue(null);
      mockRepo.find.mockResolvedValue([{ elo: 1000 }, { elo: 2000 }]); // Moyenne -> 1500
      mockRepo.create.mockReturnValue({ id: 'Bob', elo: 1500 });
      mockRepo.save.mockResolvedValue({ id: 'Bob', elo: 1500 });

      const res = await service.create({ id: 'Bob' });
      expect(res.elo).toBe(1500);
    });

    it('should throw ConflictException if exists', async () => {
      mockRepo.findOneBy.mockResolvedValue({ id: 'Alice' });
      await expect(service.create({ id: 'Alice' })).rejects.toThrow(
        ConflictException,
      );
    });
  });

  describe('findOne', () => {
    it('should return player', async () => {
      mockRepo.findOneBy.mockResolvedValue({ id: 'A' });
      expect(await service.findOne('A')).toEqual({ id: 'A' });
    });
    it('should throw NotFoundException', async () => {
      mockRepo.findOneBy.mockResolvedValue(null);
      await expect(service.findOne('X')).rejects.toThrow(NotFoundException);
    });
  });

  describe('update & updateElo', () => {
    it('update should call findOne and save', async () => {
      const p = { id: 'A' };
      jest.spyOn(service, 'findOne').mockResolvedValue(p as any);
      await service.update('A', { id: 'Ignored' } as any);
      expect(service.findOne).toHaveBeenCalledWith('A');
    });

    it('updateElo should update elo and sync', async () => {
      const p = { id: 'A', elo: 1000 };
      jest.spyOn(service, 'findOne').mockResolvedValue(p as any);
      mockRepo.save.mockResolvedValue({ ...p, elo: 1200 });

      await service.updateElo('A', 1200);
      expect(p.elo).toBe(1200);
      expect(mockRepo.save).toHaveBeenCalled();
      expect(eloService.updateRanking).toHaveBeenCalled();
    });
  });

  describe('remove', () => {
    it('should remove player', async () => {
      const p = { id: 'A' };
      jest.spyOn(service, 'findOne').mockResolvedValue(p as any);
      await service.remove('A');
      expect(mockRepo.remove).toHaveBeenCalledWith(p);
      expect(eloService.updateRanking).toHaveBeenCalled();
    });
  });
});
