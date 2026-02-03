import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { EventEmitterModule } from '@nestjs/event-emitter';
import { PlayerModule } from './player/player.module';
import { MatchModule } from './match/match.module';
import { EloModule } from './elo/elo.module';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { Player } from './player/entities/player.entity';
import { Match } from './match/entities/match.entity';
import { RankingModule } from './ranking/ranking.module';

// on verif si on est en mode test (Jest définit NODE_ENV à 'test' automatiquement)
const isTest = process.env.NODE_ENV === 'test';

@Module({
  imports: [
    EventEmitterModule.forRoot(),
    TypeOrmModule.forRoot({
      type: 'sqljs',
      autoSave: !isTest,
      location: isTest ? ':memory:' : 'database.sqlite',
      entities: [Player, Match],
      synchronize: true,
      dropSchema: isTest,
    }),
    EloModule,
    PlayerModule,
    MatchModule,
    RankingModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
