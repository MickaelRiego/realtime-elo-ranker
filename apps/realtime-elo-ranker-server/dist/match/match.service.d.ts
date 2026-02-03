import { Repository } from 'typeorm';
import { CreateMatchDto } from './dto/create-match.dto';
import { PlayerService } from '../player/player.service';
import { EloService } from '../elo/elo.service';
import { Match } from './entities/match.entity';
export declare class MatchService {
    private readonly matchRepository;
    private readonly playerService;
    private readonly eloService;
    constructor(matchRepository: Repository<Match>, playerService: PlayerService, eloService: EloService);
    create(createMatchDto: CreateMatchDto): Promise<{
        match: Match;
        winner: {
            id: string;
            rank: number;
        };
        loser: {
            id: string;
            rank: number;
        };
    }>;
    findAll(): Promise<Match[]>;
    findOne(id: number): Promise<Match>;
    update(_id: number, _updateMatchDto: any): void;
    remove(id: number): Promise<Match>;
}
