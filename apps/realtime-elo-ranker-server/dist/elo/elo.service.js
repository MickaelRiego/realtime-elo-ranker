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
Object.defineProperty(exports, "__esModule", { value: true });
exports.EloService = void 0;
const common_1 = require("@nestjs/common");
const event_emitter_1 = require("@nestjs/event-emitter");
let EloService = class EloService {
    eventEmitter;
    getRankingEvents() {
        throw new Error('Method not implemented.');
    }
    K_FACTOR = 32;
    ranking = [];
    constructor(eventEmitter) {
        this.eventEmitter = eventEmitter;
    }
    calculateExpectedScore(ratingPlayer, ratingOpponent) {
        const diff = ratingOpponent - ratingPlayer;
        return 1 / (1 + Math.pow(10, diff / 400));
    }
    calculateNewRating(currentRating, actualScore, expectedScore) {
        const newRating = currentRating + this.K_FACTOR * (actualScore - expectedScore);
        return Math.round(newRating);
    }
    updateRanking(players) {
        this.ranking = [...players].sort((a, b) => b.elo - a.elo);
        this.eventEmitter.emit('ranking.update', {
            type: 'RankingUpdate',
            players: this.ranking,
        });
    }
    getRanking() {
        return this.ranking;
    }
    emitUpdate(player) {
        this.eventEmitter.emit('player.update', player);
    }
};
exports.EloService = EloService;
exports.EloService = EloService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [event_emitter_1.EventEmitter2])
], EloService);
//# sourceMappingURL=elo.service.js.map