import { Injectable } from '@nestjs/common';
import { Subject, Observable } from 'rxjs';
import { Player } from '../player/entities/player.entity';

@Injectable()
export class EloService {
  private readonly K_FACTOR = 32; // Coefficient de pondération
  private ranking: Player[] = [];
  private rankingSubject = new Subject<Player>();

  // Calcule la probabilité de victoire (We)
  calculateExpectedScore(ratingPlayer: number, ratingOpponent: number): number {
    const diff = ratingOpponent - ratingPlayer;
    return 1 / (1 + Math.pow(10, diff / 400));
  }

  // Calcule le nouveau classement (Rn)
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
  }

  getRanking(): Player[] {
    return this.ranking;
  }

  emitUpdate(player: Player) {
    this.rankingSubject.next(player);
  }

  getRankingEvents(): Observable<Player> {
    return this.rankingSubject.asObservable();
  }
}
