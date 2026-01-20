import {
  Injectable,
  UnprocessableEntityException,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { CreateMatchDto } from './dto/create-match.dto';
import { PlayerService } from '../player/player.service';
import { EloService } from '../elo/elo.service';
import { Match } from './entities/match.entity';
import { UpdateMatchDto } from './dto/update-match.dto';

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

    if (winner === loser) {
      throw new BadRequestException(
        'Un joueur ne peut pas jouer contre lui-même',
      );
    }

    const p1 = this.playerService.findOne(winner);
    const p2 = this.playerService.findOne(loser);

    if (!p1 || !p2) {
      throw new UnprocessableEntityException({
        code: 422,
        message: 'Joueur introuvable',
      });
    }

    // Calcul des probabilités (Expected Score)
    const probP1 = this.eloService.calculateExpectedScore(p1.elo, p2.elo);
    const probP2 = this.eloService.calculateExpectedScore(p2.elo, p1.elo);

    // Score réel (1 = victoire, 0.5 = nul, 0 = défaite)
    const scoreP1 = draw ? 0.5 : 1;
    const scoreP2 = draw ? 0.5 : 0;

    // Calcul des nouveaux classements
    const newElo1 = this.eloService.calculateNewRating(p1.elo, scoreP1, probP1);
    const newElo2 = this.eloService.calculateNewRating(p2.elo, scoreP2, probP2);

    // Mise à jour des joueurs
    // Attention: J'utilise ici la méthode updateElo créée spécifiquement dans PlayerService
    this.playerService.updateElo(p1.id, newElo1);
    this.playerService.updateElo(p2.id, newElo2);

    // Emission des événements de mise à jour
    this.eloService.emitUpdate(p1);
    this.eloService.emitUpdate(p2);

    // Création et stockage du match
    const newMatch: Match = {
      id: this.idCounter++,
      player1ID: winner,
      player2ID: loser,
      winnerID: draw ? null : winner,
      playedAt: new Date(),
    };

    this.matches.push(newMatch);

    return {
      match: newMatch,
      winner: { id: p1.id, rank: newElo1 },
      loser: { id: p2.id, rank: newElo2 },
    };
  }

  findAll(): Match[] {
    return this.matches;
  }

  findOne(id: number): Match {
    const match = this.matches.find((m) => m.id === id);
    if (!match) {
      throw new NotFoundException(`Match avec l'ID ${id} non trouvé`);
    }
    return match;
  }

  update(_id: number, _updateMatchDto: UpdateMatchDto) {
    throw new UnprocessableEntityException(
      "La modification de match est interdite pour garantir l'intégrité du classement Elo.",
    );
  }

  remove(id: number) {
    const index = this.matches.findIndex((m) => m.id === id);
    if (index === -1) {
      throw new NotFoundException(`Match avec l'ID ${id} non trouvé`);
    }
    const removed = this.matches.splice(index, 1);
    return removed[0];
  }
}
