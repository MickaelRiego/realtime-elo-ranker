import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PlayerModule } from './player/player.module';
import { MatchModule } from './match/match.module';
import { EloService } from './elo/elo.service';

@Module({
  imports: [PlayerModule, MatchModule],
  controllers: [AppController],
  providers: [AppService, EloService],
})
export class AppModule {}
