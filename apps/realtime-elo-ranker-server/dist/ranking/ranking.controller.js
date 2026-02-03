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
exports.RankingController = void 0;
const common_1 = require("@nestjs/common");
const event_emitter_1 = require("@nestjs/event-emitter");
const rxjs_1 = require("rxjs");
const elo_service_1 = require("../elo/elo.service");
let RankingController = class RankingController {
    eloService;
    eventEmitter;
    constructor(eloService, eventEmitter) {
        this.eloService = eloService;
        this.eventEmitter = eventEmitter;
    }
    getRanking() {
        return this.eloService.getRanking().map((p) => ({
            id: p.id,
            name: p.id,
            rank: p.elo,
        }));
    }
    sse() {
        return new rxjs_1.Observable((observer) => {
            console.log('✅ SSE: Connexion client établie');
            const listener = (player) => {
                console.log(`🔔 SSE: Envoi update pour ${player.id}`);
                const payload = {
                    type: 'RankingUpdate',
                    player: {
                        id: player.id,
                        name: player.id,
                        rank: player.elo,
                    },
                };
                observer.next({
                    data: payload,
                });
            };
            this.eventEmitter.on('player.update', listener);
            return () => {
                this.eventEmitter.removeListener('player.update', listener);
            };
        });
    }
};
exports.RankingController = RankingController;
__decorate([
    (0, common_1.Get)(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], RankingController.prototype, "getRanking", null);
__decorate([
    (0, common_1.Sse)('events'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", rxjs_1.Observable)
], RankingController.prototype, "sse", null);
exports.RankingController = RankingController = __decorate([
    (0, common_1.Controller)('ranking'),
    __metadata("design:paramtypes", [elo_service_1.EloService,
        event_emitter_1.EventEmitter2])
], RankingController);
//# sourceMappingURL=ranking.controller.js.map