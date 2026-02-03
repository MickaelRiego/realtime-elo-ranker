import {
  Injectable,
  ConflictException,
  NotFoundException,
  OnModuleInit,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Player } from './entities/player.entity';
import { EloService } from '../elo/elo.service';
import { CreatePlayerDto } from './dto/create-player.dto';
// SUPPRESSION DE LA LIGNE IMPORT UPDATE-PLAYER

@Injectable()
export class PlayerService implements OnModuleInit {
  constructor(
    @InjectRepository(Player)
    private readonly playerRepository: Repository<Player>,
    private readonly eloService: EloService,
  ) {}

  async onModuleInit() {
    await this.syncRanking();
  }

  async syncRanking() {
    const allPlayers = await this.playerRepository.find();
    this.eloService.updateRanking(allPlayers);
  }

  async create(createPlayerDto: CreatePlayerDto) {
    const existing = await this.playerRepository.findOneBy({
      id: createPlayerDto.id,
    });
    if (existing) {
      throw new ConflictException(
        `Le joueur '${createPlayerDto.id}' existe déjà.`,
      );
    }

    const players = await this.playerRepository.find();
    const initialElo =
      players.length > 0
        ? Math.round(
            players.reduce((acc, p) => acc + p.elo, 0) / players.length,
          )
        : 1200;

    const newPlayer = this.playerRepository.create({
      id: createPlayerDto.id,
      elo: initialElo,
    });

    const savedPlayer = await this.playerRepository.save(newPlayer);
    await this.syncRanking();
    this.eloService.emitUpdate(savedPlayer);

    return savedPlayer;
  }

  async findAll() {
    return this.playerRepository.find();
  }

  async findOne(id: string) {
    const player = await this.playerRepository.findOneBy({ id });
    if (!player) throw new NotFoundException(`Joueur '${id}' non trouvé`);
    return player;
  }

  // CORRECTION : utilisation de 'any'
  async update(id: string, _updatePlayerDto: any) {
    return this.findOne(id);
  }

  async updateElo(id: string, elo: number) {
    const player = await this.findOne(id);
    player.elo = elo;
    const saved = await this.playerRepository.save(player);
    await this.syncRanking();
    return saved;
  }

  async remove(id: string) {
    const player = await this.findOne(id);
    const removed = await this.playerRepository.remove(player);
    await this.syncRanking();
    return removed;
  }
}
