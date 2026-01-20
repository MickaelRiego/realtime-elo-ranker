import { Module } from '@nestjs/common';
import { PlayerModule } from './player/player.module';
import { MatchModule } from './match/match.module';
import { EloService } from './elo/elo.service';
import { RankingController } from './ranking/ranking.controller';

@Module({
  imports: [PlayerModule, MatchModule],
  controllers: [RankingController],
  providers: [EloService],
  exports: [EloService],
})
export class AppModule {}
