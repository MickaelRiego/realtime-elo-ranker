import { Controller, Get, Sse } from '@nestjs/common';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { Observable } from 'rxjs';
import { EloService } from './elo/elo.service';

@Controller()
export class AppController {
  constructor(
    private readonly eloService: EloService,
    private readonly eventEmitter: EventEmitter2
  ) {}

  // Endpoint classique pour récupérer le classement actuel (snapshot)
  @Get('ranking')
  getRanking() {
    return this.eloService.getRanking();
  }

  // Endpoint SSE pour le temps réel
  @Sse('sse')
  sse(): Observable<MessageEvent> {
    return new Observable((observer) => {
      // Fonction appelée quand l'événement survient
      const listener = (data: any) => {
        observer.next({ data } as MessageEvent);
      };

      // On écoute
      this.eventEmitter.on('ranking.update', listener);

      // IMPORTANT : On envoie tout de suite l'état actuel pour ne pas attendre le prochain changement
      observer.next({ data: this.eloService.getRanking() } as MessageEvent);

      // Nettoyage à la déconnexion du client
      return () => {
        this.eventEmitter.removeListener('ranking.update', listener);
      };
    });
  }
}