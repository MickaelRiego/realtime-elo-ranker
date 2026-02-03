import { Test, TestingModule } from '@nestjs/testing';
import { RankingController } from './ranking.controller';
import { EloService } from '../elo/elo.service';
import { EventEmitter2 } from '@nestjs/event-emitter';

describe('RankingController', () => {
  let controller: RankingController;

  const mockEloService = {
    getRanking: jest.fn().mockReturnValue([
      { id: 'Alice', elo: 1200 },
      { id: 'Bob', elo: 1100 },
    ]),
  };

  const mockEventEmitter = {
    on: jest.fn(),
    removeListener: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [RankingController],
      providers: [
        {
          provide: EloService,
          useValue: mockEloService,
        },
        {
          provide: EventEmitter2,
          useValue: mockEventEmitter,
        },
      ],
    }).compile();

    controller = module.get<RankingController>(RankingController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('getRanking', () => {
    it('should return the ranking list mapped correctly', () => {
      const result = controller.getRanking();

      expect(result).toEqual([
        { id: 'Alice', rank: 1200 },
        { id: 'Bob', rank: 1100 },
      ]);
      expect(mockEloService.getRanking).toHaveBeenCalled();
    });
  });
});
