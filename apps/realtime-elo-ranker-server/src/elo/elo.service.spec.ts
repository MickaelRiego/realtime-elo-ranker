import { Test, TestingModule } from '@nestjs/testing';
import { EloService } from './elo.service';
import { EventEmitter2 } from '@nestjs/event-emitter';

describe('EloService', () => {
  let service: EloService;
  let eventEmitter: EventEmitter2;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        EloService,
        {
          provide: EventEmitter2,
          useValue: { emit: jest.fn() },
        },
      ],
    }).compile();

    service = module.get<EloService>(EloService);
    eventEmitter = module.get<EventEmitter2>(EventEmitter2);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('updateRanking', () => {
    it('should sort players and emit event', () => {
      const p1 = { id: 'A', elo: 1000 } as any;
      const p2 = { id: 'B', elo: 2000 } as any;

      service.updateRanking([p1, p2]);

      const ranking = service.getRanking();
      expect(ranking[0].id).toBe('B');
      expect(eventEmitter.emit).toHaveBeenCalledWith(
        'ranking.update',
        expect.anything(),
      );
    });
  });

  describe('emitUpdate', () => {
    it('should emit player.update', () => {
      const p = { id: 'A', elo: 1200 } as any;
      service.emitUpdate(p);
      expect(eventEmitter.emit).toHaveBeenCalledWith('player.update', p);
    });
  });

  describe('Math Logic', () => {
    it('should calculate expected score correctly', () => {
      // Même niveau = 0.5
      expect(service.calculateExpectedScore(1200, 1200)).toBe(0.5);
      // Plus fort > 0.5
      expect(service.calculateExpectedScore(2000, 1000)).toBeGreaterThan(0.5);
      // Plus faible < 0.5
      expect(service.calculateExpectedScore(1000, 2000)).toBeLessThan(0.5);
    });

    it('should calculate new rating correctly', () => {
      // Victoire normale
      expect(service.calculateNewRating(1200, 1, 0.5)).toBe(1216);
      // Défaite normale
      expect(service.calculateNewRating(1200, 0, 0.5)).toBe(1184);
    });
  });
});
