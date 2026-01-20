import { Injectable } from '@nestjs/common';
import { CreatePlayerDto } from './dto/create-player.dto';
import { UpdatePlayerDto } from './dto/update-player.dto';
import { Player } from './entities/player.entity';
import { EloService } from 'src/elo/elo.service';

@Injectable()
export class PlayerService {
  private players: Player[] = [];
  private idCounter = 1;

  constructor(private readonly eloService: EloService) {}

  create(createPlayerDto: CreatePlayerDto) {
    const newPlayer: Player = {
      id: this.idCounter++,
      username: createPlayerDto.username || `Joueur ${this.idCounter}`,
      elo: 1200, // ELO de base
    };
    this.players.push(newPlayer);

    // On prévient le service de classement qu'il faut mettre à jour
    this.eloService.updateRanking(this.players);

    return newPlayer;
  }

  findAll() {
    return this.players;
  }

  findOne(id: number) {
    return this.players.find((p) => p.id === id);
  }

  update(id: number, updatePlayerDto: UpdatePlayerDto) {
    const playerIndex = this.players.findIndex((p) => p.id === id);
    if (playerIndex > -1) {
      // Fusion des données
      this.players[playerIndex] = {
        ...this.players[playerIndex],
        ...updatePlayerDto,
      };
      // Mise à jour du classement si l'ELO a changé
      this.eloService.updateRanking(this.players);
      return this.players[playerIndex];
    }
    return null;
  }

  remove(id: number) {
    const index = this.players.findIndex((p) => p.id === id);
    if (index > -1) {
      const deleted = this.players.splice(index, 1);
      this.eloService.updateRanking(this.players);
      return deleted[0];
    }
    return null;
  }
}
