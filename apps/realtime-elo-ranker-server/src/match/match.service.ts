import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { CreateMatchDto } from './dto/create-match.dto';
import { UpdateMatchDto } from './dto/update-match.dto';
import { Match } from './entities/match.entity';
import { PlayerService } from 'src/player/player.service';

@Injectable()
export class MatchService {
  private matches: Match[] = [];
  private idCounter = 1;
  private readonly K_FACTOR = 32;

  constructor(private readonly playerService: PlayerService) {}

  create(createMatchDto: CreateMatchDto) {
    const { player1ID, player2ID, winnerID } = createMatchDto;

    if (player1ID === player2ID) {
      throw new BadRequestException(
        'Un joueur ne peut pas jouer contre lui même',
      );
    }

    if (winnerID !== player1ID && winnerID !== player2ID) {
      throw new BadRequestException('Il doit y avoir un gagnant');
    }

    // récupération des joueurs
    const p1 = this.playerService.findOne(player1ID);
    const p2 = this.playerService.findOne(player2ID);

    if (!p1 || !p2) {
      throw new NotFoundException('un des joueurs est introuvable');
    }

    // calcul probabilités
    const probP1 = 1 / (1 + Math.pow(10, (p2.elo - p1.elo) / 400));
    const probP2 = 1 / (1 + Math.pow(10, (p1.elo - p2.elo) / 400));

    // score réel
    const scoreP1 = winnerID === p1.id ? 1 : 0;
    const scoreP2 = winnerID === p2.id ? 1 : 0;

    // maj elo
    const newElo1 = Math.round(p1.elo + this.K_FACTOR * (scoreP1 - probP1));
    const newElo2 = Math.round(p2.elo + this.K_FACTOR * (scoreP2 - probP2));

    // maj joueurs
    this.playerService.update(p1.id, { elo: newElo1 } as any);
    this.playerService.update(p2.id, { elo: newElo2 } as any);

    const match: Match = {
      id: this.idCounter++,
      player1ID,
      player2ID,
      winnerID,
      playedAt: new Date(),
    };

    this.matches.push(match);

    return match;
  }

  findAll() {
    return this.matches;
  }

  findOne(id: number) {
    return `This action returns a #${id} match`;
  }

  update(id: number, updateMatchDto: UpdateMatchDto) {
    return `This action updates a #${id} match`;
  }

  remove(id: number) {
    return `This action removes a #${id} match`;
  }
}
