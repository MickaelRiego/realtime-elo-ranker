import { Controller, Get, Sse, MessageEvent } from '@nestjs/common';
import { EloService } from '../elo/elo.service';
import { map, Observable } from 'rxjs';

@Controller('ranking')
export class RankingController {
  constructor(private readonly eloService: EloService) {}

  // recup du classement actuel
  @Get()
  getRanking() {
    const ranking = this.eloService.getRanking();

    return ranking.map((p) => ({
      id: p.id.toString(),
      rank: p.elo,
    }));
  }

  // Abonnement aux mises à jour en temps réel (SSE)
  @Sse('events')
  sse(): Observable<MessageEvent> {
    return this.eloService.getRankingEvents().pipe(
      map((player) => ({
        data: {
          type: 'RankingUpdate',
          player: {
            id: player.id.toString(),
            rank: player.elo,
          },
        },
      })),
    );
  }
}
