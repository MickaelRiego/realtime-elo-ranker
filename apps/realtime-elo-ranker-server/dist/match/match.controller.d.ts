import { MatchService } from './match.service';
import { CreateMatchDto } from './dto/create-match.dto';
import { UpdateMatchDto } from './dto/update-match.dto';
export declare class MatchController {
    private readonly matchService;
    constructor(matchService: MatchService);
    create(createMatchDto: CreateMatchDto): string;
    findAll(): string;
    findOne(id: string): string;
    update(id: string, updateMatchDto: UpdateMatchDto): string;
    remove(id: string): string;
}
