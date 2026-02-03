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
      name: p.id,
      rank: p.elo,
    }));
  }

  @Sse('events')
  sse(): Observable<MessageEvent> {
    return new Observable((observer) => {
      // Pour debug
      console.log('SSE: Connexion client établie');

      const listener = (player: any) => {
        console.log(`SSE: Envoi update pour ${player.id}`);
        const payload = {
          type: 'RankingUpdate',
          player: {
            id: player.id,
            name: player.id,
            rank: player.elo,
          },
        };

        observer.next({
          data: payload,
        } as MessageEvent);
      };

      this.eventEmitter.on('player.update', listener);

      return () => {
        this.eventEmitter.removeListener('player.update', listener);
      };
    });
  }
}