import { Module } from '@nestjs/common';
import { RankingController } from './ranking.controller';
import { EloModule } from '../elo/elo.module';

@Module({
  imports: [EloModule],
  controllers: [RankingController],
})
export class RankingModule {}
