import { OnModuleInit } from '@nestjs/common';
import { Repository } from 'typeorm';
import { Player } from './entities/player.entity';
import { EloService } from '../elo/elo.service';
import { CreatePlayerDto } from './dto/create-player.dto';
export declare class PlayerService implements OnModuleInit {
    private readonly playerRepository;
    private readonly eloService;
    constructor(playerRepository: Repository<Player>, eloService: EloService);
    onModuleInit(): Promise<void>;
    syncRanking(): Promise<void>;
    create(createPlayerDto: CreatePlayerDto): Promise<Player>;
    findAll(): Promise<Player[]>;
    findOne(id: string): Promise<Player>;
    update(id: string, _updatePlayerDto: any): Promise<Player>;
    updateElo(id: string, elo: number): Promise<Player>;
    remove(id: string): Promise<Player>;
}
