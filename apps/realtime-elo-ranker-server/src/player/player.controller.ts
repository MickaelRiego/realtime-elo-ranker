import { Controller, Post, Body, Get, Param } from '@nestjs/common';
import { PlayerService } from './player.service';
import { CreatePlayerDto } from './dto/create-player.dto';

@Controller('player')
export class PlayerController {
  constructor(private readonly playerService: PlayerService) {}

  @Post()
  create(@Body() createPlayerDto: CreatePlayerDto) {
    const player = this.playerService.create(createPlayerDto);
    return {
      id: player.id,
      rank: player.elo,
    };
  }

  @Get()
  findAll() {
    return this.playerService.findAll().map((p) => ({
      id: p.id,
      rank: p.elo,
    }));
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    const player = this.playerService.findOne(id);
    return {
      id: player.id,
      rank: player.elo,
    };
  }
}
