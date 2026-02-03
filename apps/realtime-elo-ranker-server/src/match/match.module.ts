import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MatchService } from './match.service';
import { MatchController } from './match.controller';
import { Match } from './entities/match.entity';
import { PlayerModule } from '../player/player.module';
import { EloModule } from '../elo/elo.module';

@Module({
  imports: [TypeOrmModule.forFeature([Match]), PlayerModule, EloModule],
  controllers: [MatchController],
  providers: [MatchService],
})
export class MatchModule {}
