import { Injectable } from '@nestjs/common';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { Player } from '../player/entities/player.entity';

@Injectable()
export class EloService {
  private ranking: Player[] = [];

  constructor(private readonly eventEmitter: EventEmitter2) {}

  // APPEL par PlayerService à chaque changement
  updateRanking(players: Player[]) {
    this.ranking = [...players].sort((a, b) => b.elo - a.elo);
    // On emet l'événement pour le SSE
    this.eventEmitter.emit('ranking.update', this.ranking);
  }

  getRanking() {
    return this.ranking;
  }
}
