// apps/realtime-elo-ranker-server/src/player/player.service.ts
import { Injectable, NotFoundException } from '@nestjs/common';
import { Player } from './entities/player.entity';
import { EloService } from '../elo/elo.service';
import { CreatePlayerDto } from './dto/create-player.dto';
import { UpdatePlayerDto } from './dto/update-player.dto';

@Injectable()
export class PlayerService {
  private players: Player[] = [];
  private idCounter = 1;

  constructor(private readonly eloService: EloService) {}

  create(createPlayerDto: CreatePlayerDto) {
    const initialElo =
      this.players.length > 0
        ? Math.round(
            this.players.reduce((acc, p) => acc + p.elo, 0) /
              this.players.length,
          )
        : 1200;

    const newId = (this.idCounter++).toString();

    const newPlayer: Player = {
      id: createPlayerDto.id || newId,
      username: createPlayerDto.username || `Joueur ${newId}`,
      elo: initialElo,
    };

    this.players.push(newPlayer);
    this.eloService.updateRanking(this.players);

    this.eloService.emitUpdate(newPlayer);

    return newPlayer;
  }

  findAll() {
    return this.players;
  }

  findOne(id: string) {
    const player = this.players.find((p) => p.id === id);
    if (!player) {
      throw new NotFoundException(`Joueur avec l'ID ${id} non trouvé`);
    }
    return player;
  }

  update(id: string, updatePlayerDto: UpdatePlayerDto) {
    const player = this.findOne(id);
    if (updatePlayerDto.username) {
      player.username = updatePlayerDto.username;
    }

    return player;
  }

  // Méthode spécifique utilisée par MatchService pour mettre à jour le score
  updateElo(id: string, elo: number) {
    const player = this.players.find((p) => p.id === id);
    if (player) {
      player.elo = elo;
      this.eloService.updateRanking(this.players);
      return player;
    }
    return null;
  }

  remove(id: string) {
    const index = this.players.findIndex((p) => p.id === id);
    if (index === -1) {
      throw new NotFoundException(`Joueur avec l'ID ${id} non trouvé`);
    }
    const removedPlayer = this.players.splice(index, 1)[0];
    this.eloService.updateRanking(this.players);
    return removedPlayer;
  }
}
