// apps/realtime-elo-ranker-server/src/player/player.service.ts
import { Injectable } from '@nestjs/common';
import { Player } from './entities/player.entity';
import { EloService } from '../elo/elo.service';
import { CreatePlayerDto } from './dto/create-player.dto';

@Injectable()
export class PlayerService {
  private players: Player[] = [];
  private idCounter = 1;

  constructor(private readonly eloService: EloService) {}

  create(createPlayerDto: CreatePlayerDto) {
    // moyenne des rangs existants ou 1200
    const initialElo =
      this.players.length > 0
        ? Math.round(
            this.players.reduce((acc, p) => acc + p.elo, 0) /
              this.players.length,
          )
        : 1200;

    const newPlayer: Player = {
      id: createPlayerDto.id || `${this.idCounter - 1}`,
      username: createPlayerDto.username || `Joueur ${this.idCounter - 1}`,
      elo: initialElo,
    };

    this.players.push(newPlayer);
    this.eloService.updateRanking(this.players);
    return newPlayer;
  }

  findAll() {
    return this.players;
  }

  findOne(id: string) {
    return this.players.find((p) => p.id === id);
  }

  update(id: string, elo: number) {
    const player = this.players.find((p) => p.id === id);
    if (player) {
      player.elo = elo;
      this.eloService.updateRanking(this.players);
      return player;
    }
    return null;
  }

  remove(id: string) {
    this.players.find((p) => p.id === id); // TODO
  }
}
