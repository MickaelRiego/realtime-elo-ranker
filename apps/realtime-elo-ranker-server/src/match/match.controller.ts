import { Controller, Post, Body } from '@nestjs/common';
import { MatchService } from './match.service';
import { CreateMatchDto } from './dto/create-match.dto';

@Controller('match')
export class MatchController {
  constructor(private readonly matchService: MatchService) {}

  @Post()
  async create(@Body() createMatchDto: CreateMatchDto) {
    const result = await this.matchService.create(createMatchDto);
    return {
      winner: result.winner,
      loser: result.loser,
    };
  }
}
