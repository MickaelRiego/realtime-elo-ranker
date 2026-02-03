import { MessageEvent } from '@nestjs/common';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { Observable } from 'rxjs';
import { EloService } from '../elo/elo.service';
export declare class RankingController {
    private readonly eloService;
    private readonly eventEmitter;
    constructor(eloService: EloService, eventEmitter: EventEmitter2);
    getRanking(): {
        id: string;
        rank: number;
    }[];
    sse(): Observable<MessageEvent>;
}
