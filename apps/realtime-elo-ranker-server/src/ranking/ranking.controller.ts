import { Controller, Get, Sse, MessageEvent } from '@nestjs/common';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { Observable } from 'rxjs';
import { EloService } from '../elo/elo.service';

@Controller('ranking')
export class RankingController {
  constructor(
    private readonly eloService: EloService,
    private readonly eventEmitter: EventEmitter2,
  ) {}

  @Get()
  getRanking() {
    return this.eloService.getRanking().map((p) => ({
      id: p.id,
      rank: p.elo,
    }));
  }

  @Sse('events')
  sse(): Observable<MessageEvent> {
    return new Observable((observer) => {
      const currentRanking = this.eloService.getRanking().map((p) => ({
        id: p.id,
        rank: p.elo,
      }));

      observer.next({
        data: { type: 'RankingUpdate', players: currentRanking },
      } as MessageEvent);

      const listener = (eventData: any) => {
        observer.next({ data: eventData } as MessageEvent);
      };

      this.eventEmitter.on('ranking.update', listener);

      return () => {
        this.eventEmitter.removeListener('ranking.update', listener);
      };
    });
  }
}
