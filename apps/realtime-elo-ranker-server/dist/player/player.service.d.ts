import { CreatePlayerDto } from './dto/create-player.dto';
import { UpdatePlayerDto } from './dto/update-player.dto';
export declare class PlayerService {
    create(createPlayerDto: CreatePlayerDto): string;
    findAll(): string;
    findOne(id: number): string;
    update(id: number, updatePlayerDto: UpdatePlayerDto): string;
    remove(id: number): string;
}
