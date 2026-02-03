import { Controller, Post, Body, Get, Param } from '@nestjs/common';
import { PlayerService } from './player.service';
import { CreatePlayerDto } from './dto/create-player.dto';

@Controller('player')
export class PlayerController {
  constructor(private readonly playerService: PlayerService) {}

  @Post()
  async create(@Body() createPlayerDto: CreatePlayerDto) {
    const player = await this.playerService.create(createPlayerDto);
    return {
      id: player.id,
      rank: player.elo,
    };
  }

  @Get()
  async findAll() {
    const players = await this.playerService.findAll();
    return players.map((p) => ({
      id: p.id,
      rank: p.elo,
    }));
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    const player = await this.playerService.findOne(id);
    return {
      id: player.id,
      rank: player.elo,
    };
  }
}
