import { Test, TestingModule } from '@nestjs/testing';
import { AppController } from './app.controller';
import { EloService } from './elo/elo.service';
import { EventEmitter2 } from '@nestjs/event-emitter';

describe('AppController', () => {
  let appController: AppController;
  let eventEmitter: EventEmitter2;

  const mockEloService = {
    getRanking: jest.fn().mockReturnValue([{ id: 'A', elo: 1200 }]),
  };

  const mockEventEmitter = {
    on: jest.fn(),
    removeListener: jest.fn(),
    emit: jest.fn(),
  };

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      controllers: [AppController],
      providers: [
        { provide: EloService, useValue: mockEloService },
        { provide: EventEmitter2, useValue: mockEventEmitter },
      ],
    }).compile();

    appController = app.get<AppController>(AppController);
    eventEmitter = app.get<EventEmitter2>(EventEmitter2);
  });

  it('should be defined', () => {
    expect(appController).toBeDefined();
  });

  describe('getRanking', () => {
    it('should return ranking', () => {
      expect(appController.getRanking()).toHaveLength(1);
    });
  });

  describe('sse', () => {
    it('should emit initial ranking and listen to events', (done) => {
      const observable = appController.sse();
      let count = 0;

      let listenerCallback: any;
      (eventEmitter.on as jest.Mock).mockImplementation((event, cb) => {
        listenerCallback = cb;
      });

      const sub = observable.subscribe({
        next: (event) => {
          count++;
          if (count === 1) {
            // 1. Initial emission
            expect(event.data).toEqual([{ id: 'A', elo: 1200 }]);

            // FIX: On attend que la souscription soit finie (event loop)
            setTimeout(() => {
              if (listenerCallback) listenerCallback({ type: 'update' });
            }, 10);
          } else if (count === 2) {
            // 2. Update emission
            expect(event.data).toEqual({ type: 'update' });
            sub.unsubscribe();
            done();
          }
        },
        error: (err) => done(err),
      });
    });
  });
});
