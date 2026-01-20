import { PlayerService } from './player.service';
import { CreatePlayerDto } from './dto/create-player.dto';
import { UpdatePlayerDto } from './dto/update-player.dto';
export declare class PlayerController {
    private readonly playerService;
    constructor(playerService: PlayerService);
    create(createPlayerDto: CreatePlayerDto): string;
    findAll(): string;
    findOne(id: string): string;
    update(id: string, updatePlayerDto: UpdatePlayerDto): string;
    remove(id: string): string;
}
