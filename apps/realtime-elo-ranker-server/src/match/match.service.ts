import { Injectable, UnprocessableEntityException } from '@nestjs/common';
import { CreateMatchDto } from './dto/create-match.dto';
import { PlayerService } from '../player/player.service';
import { EloService } from '../elo/elo.service';
import { Match } from './entities/match.entity';
@Injectable()
export class MatchService {
  private matches: Match[] = [];
  private idCounter = 1;

  constructor(
    private readonly playerService: PlayerService,
    private readonly eloService: EloService,
  ) {}

  create(createMatchDto: CreateMatchDto) {
    const { winner, loser, draw } = createMatchDto;

    const p1 = this.playerService.findOne(winner);
    const p2 = this.playerService.findOne(loser);

    if (!p1 || !p2) {
      throw new UnprocessableEntityException({
        code: 422,
        message: 'Joueur introuvable',
      });
    }

    const probP1 = this.eloService.calculateExpectedScore(p1.elo, p2.elo);
    const probP2 = this.eloService.calculateExpectedScore(p2.elo, p1.elo);

    const scoreP1 = draw ? 0.5 : 1;
    const scoreP2 = draw ? 0.5 : 0;

    const newElo1 = this.eloService.calculateNewRating(p1.elo, scoreP1, probP1);
    const newElo2 = this.eloService.calculateNewRating(p2.elo, scoreP2, probP2);

    this.playerService.update(p1.id, newElo1);
    this.playerService.update(p2.id, newElo2);

    this.eloService.emitUpdate(p1);
    this.eloService.emitUpdate(p2);

    // Création de l'objet Match respectant l'entité
    const newMatch: Match = {
      id: this.idCounter++,
      player1ID: winner,
      player2ID: loser,
      winnerID: draw ? null : winner,
      playedAt: new Date(),
    };

    this.matches.push(newMatch);

    return {
      winner: { id: p1.id, rank: newElo1 },
      loser: { id: p2.id, rank: newElo2 },
    };
  }

  findAll(): Match[] {
    return this.matches;
  }
}
