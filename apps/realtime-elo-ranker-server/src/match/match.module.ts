import { Module } from '@nestjs/common';
import { MatchService } from './match.service';
import { MatchController } from './match.controller';
import { PlayerModule } from '../player/player.module';
import { EloModule } from '../elo/elo.module';

@Module({
  imports: [PlayerModule, EloModule],
  controllers: [MatchController],
  providers: [MatchService],
})
export class MatchModule {}
