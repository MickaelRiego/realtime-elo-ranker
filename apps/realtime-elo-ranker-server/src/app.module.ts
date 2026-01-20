// apps/realtime-elo-ranker-server/src/app.module.ts
import { Module } from '@nestjs/common';
import { EventEmitterModule } from '@nestjs/event-emitter';
import { PlayerModule } from './player/player.module';
import { MatchModule } from './match/match.module';
import { EloModule } from './elo/elo.module'; // <--- Import du nouveau module
import { RankingController } from './ranking/ranking.controller';

@Module({
  imports: [EventEmitterModule.forRoot(), EloModule, PlayerModule, MatchModule],
  controllers: [RankingController],
})
export class AppModule {}
