import { Test, TestingModule } from '@nestjs/testing';
import { RankingController } from './ranking.controller';
import { EloService } from '../elo/elo.service';
import { EventEmitter2 } from '@nestjs/event-emitter';

describe('RankingController', () => {
  let controller: RankingController;
  let eventEmitter: EventEmitter2;

  const mockEloService = {
    getRanking: jest.fn().mockReturnValue([{ id: 'Alice', elo: 1200 }]),
  };

  const mockEventEmitter = {
    on: jest.fn(),
    removeListener: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [RankingController],
      providers: [
        { provide: EloService, useValue: mockEloService },
        { provide: EventEmitter2, useValue: mockEventEmitter },
      ],
    }).compile();

    controller = module.get<RankingController>(RankingController);
    eventEmitter = module.get<EventEmitter2>(EventEmitter2);
  });

  describe('sse', () => {
    it('should emit properly formatted RankingUpdate event', (done) => {
      const observable = controller.sse();

      let listenerCallback: any;
      (eventEmitter.on as jest.Mock).mockImplementation((event, cb) => {
        listenerCallback = cb;
      });

      const sub = observable.subscribe({
        next: (event) => {
          expect(event.data).toEqual({
            type: 'RankingUpdate',
            player: {
              id: 'Alice',
              name: 'Alice',
              rank: 1250,
            },
          });
          sub.unsubscribe();
          done();
        },
      });

      setTimeout(() => {
        if (listenerCallback) {
          listenerCallback({ id: 'Alice', elo: 1250 });
        }
      }, 10);
    });
  });
});
