"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.MatchService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const player_service_1 = require("../player/player.service");
const elo_service_1 = require("../elo/elo.service");
const match_entity_1 = require("./entities/match.entity");
let MatchService = class MatchService {
    matchRepository;
    playerService;
    eloService;
    constructor(matchRepository, playerService, eloService) {
        this.matchRepository = matchRepository;
        this.playerService = playerService;
        this.eloService = eloService;
    }
    async create(createMatchDto) {
        const { winner, loser, draw } = createMatchDto;
        if (winner === loser) {
            throw new common_1.BadRequestException('Un joueur ne peut pas jouer contre lui-même');
        }
        const p1 = await this.playerService.findOne(winner);
        const p2 = await this.playerService.findOne(loser);
        if (!p1 || !p2) {
            throw new common_1.UnprocessableEntityException('Joueur introuvable');
        }
        const probP1 = this.eloService.calculateExpectedScore(p1.elo, p2.elo);
        const probP2 = this.eloService.calculateExpectedScore(p2.elo, p1.elo);
        const scoreP1 = draw ? 0.5 : 1;
        const scoreP2 = draw ? 0.5 : 0;
        const newElo1 = this.eloService.calculateNewRating(p1.elo, scoreP1, probP1);
        const newElo2 = this.eloService.calculateNewRating(p2.elo, scoreP2, probP2);
        await this.playerService.updateElo(p1.id, newElo1);
        await this.playerService.updateElo(p2.id, newElo2);
        const savedP1 = await this.playerService.findOne(p1.id);
        const savedP2 = await this.playerService.findOne(p2.id);
        this.eloService.emitUpdate(savedP1);
        this.eloService.emitUpdate(savedP2);
        const newMatch = this.matchRepository.create({
            player1ID: winner,
            player2ID: loser,
            winnerID: draw ? null : winner,
            playedAt: new Date(),
        });
        await this.matchRepository.save(newMatch);
        return {
            match: newMatch,
            winner: { id: p1.id, rank: newElo1 },
            loser: { id: p2.id, rank: newElo2 },
        };
    }
    async findAll() {
        return this.matchRepository.find();
    }
    async findOne(id) {
        const match = await this.matchRepository.findOneBy({ id });
        if (!match)
            throw new common_1.NotFoundException(`Match ${id} non trouvé`);
        return match;
    }
    update(_id, _updateMatchDto) {
        throw new common_1.UnprocessableEntityException('Modification interdite');
    }
    async remove(id) {
        const match = await this.findOne(id);
        return this.matchRepository.remove(match);
    }
};
exports.MatchService = MatchService;
exports.MatchService = MatchService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(match_entity_1.Match)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        player_service_1.PlayerService,
        elo_service_1.EloService])
], MatchService);
//# sourceMappingURL=match.service.js.map