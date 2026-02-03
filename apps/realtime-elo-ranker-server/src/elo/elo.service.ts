import { Injectable } from '@nestjs/common';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { Player } from '../player/entities/player.entity';

@Injectable()
export class EloService {
  getRankingEvents() {
    throw new Error('Method not implemented.');
  }
  private readonly K_FACTOR = 32;
  private ranking: Player[] = [];

  constructor(private eventEmitter: EventEmitter2) {}

  calculateExpectedScore(ratingPlayer: number, ratingOpponent: number): number {
    const diff = ratingOpponent - ratingPlayer;
    return 1 / (1 + Math.pow(10, diff / 400));
  }

  calculateNewRating(
    currentRating: number,
    actualScore: number,
    expectedScore: number,
  ): number {
    const newRating =
      currentRating + this.K_FACTOR * (actualScore - expectedScore);
    return Math.round(newRating);
  }

  updateRanking(players: Player[]) {
    this.ranking = [...players].sort((a, b) => b.elo - a.elo);
    this.eventEmitter.emit('ranking.update', {
      type: 'RankingUpdate',
      players: this.ranking,
    });
  }

  getRanking(): Player[] {
    return this.ranking;
  }

  emitUpdate(player: Player) {
    this.eventEmitter.emit('player.update', player);
  }
}
