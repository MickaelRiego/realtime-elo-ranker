import { EventEmitter2 } from '@nestjs/event-emitter';
import { Player } from '../player/entities/player.entity';
export declare class EloService {
    private eventEmitter;
    getRankingEvents(): void;
    private readonly K_FACTOR;
    private ranking;
    constructor(eventEmitter: EventEmitter2);
    calculateExpectedScore(ratingPlayer: number, ratingOpponent: number): number;
    calculateNewRating(currentRating: number, actualScore: number, expectedScore: number): number;
    updateRanking(players: Player[]): void;
    getRanking(): Player[];
    emitUpdate(player: Player): void;
}
