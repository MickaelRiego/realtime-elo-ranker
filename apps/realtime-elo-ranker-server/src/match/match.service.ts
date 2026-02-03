import {
  Injectable,
  UnprocessableEntityException,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateMatchDto } from './dto/create-match.dto';
import { PlayerService } from '../player/player.service';
import { EloService } from '../elo/elo.service';
import { Match } from './entities/match.entity';

@Injectable()
export class MatchService {
  constructor(
    @InjectRepository(Match)
    private readonly matchRepository: Repository<Match>,
    private readonly playerService: PlayerService,
    private readonly eloService: EloService,
  ) {}

  async create(createMatchDto: CreateMatchDto) {
    const { winner, loser, draw } = createMatchDto;

    if (winner === loser) {
      throw new BadRequestException(
        'Un joueur ne peut pas jouer contre lui-même',
      );
    }

    const p1 = await this.playerService.findOne(winner);
    const p2 = await this.playerService.findOne(loser);

    if (!p1 || !p2) {
      throw new UnprocessableEntityException('Joueur introuvable');
    }

    const probP1 = this.eloService.calculateExpectedScore(p1.elo, p2.elo);
    const probP2 = this.eloService.calculateExpectedScore(p2.elo, p1.elo);

    const scoreP1 = draw ? 0.5 : 1;
    const scoreP2 = draw ? 0.5 : 0;

    const newElo1 = this.eloService.calculateNewRating(p1.elo, scoreP1, probP1);
    const newElo2 = this.eloService.calculateNewRating(p2.elo, scoreP2, probP2);

    await this.playerService.updateElo(p1.id, newElo1);
    await this.playerService.updateElo(p2.id, newElo2);

    const savedP1 = await this.playerService.findOne(p1.id);
    const savedP2 = await this.playerService.findOne(p2.id);

    this.eloService.emitUpdate(savedP1);
    this.eloService.emitUpdate(savedP2);

    const newMatch = this.matchRepository.create({
      player1ID: winner,
      player2ID: loser,
      winnerID: draw ? null : winner,
      playedAt: new Date(),
    });

    await this.matchRepository.save(newMatch);

    return {
      match: newMatch,
      winner: { id: p1.id, rank: newElo1 },
      loser: { id: p2.id, rank: newElo2 },
    };
  }

  async findAll() {
    return this.matchRepository.find();
  }

  async findOne(id: number) {
    const match = await this.matchRepository.findOneBy({ id });
    if (!match) throw new NotFoundException(`Match ${id} non trouvé`);
    return match;
  }

  // CORRECTION : utilisation de 'any' pour éviter l'erreur de compilation
  update(_id: number, _updateMatchDto: any) {
    throw new UnprocessableEntityException('Modification interdite');
  }

  async remove(id: number) {
    const match = await this.findOne(id);
    return this.matchRepository.remove(match);
  }
}