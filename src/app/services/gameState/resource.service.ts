import { inject, Injectable, WritableSignal } from '@angular/core';
import { ResourceName, GameState } from 'src/app/interfaces';
import { GameStateService } from './game-state.service';

@Injectable({
  providedIn: 'root',
})
export class ResourceService {
  gameStateSignal: WritableSignal<GameState>;

  constructor(private gameStateService: GameStateService) {
    this.gameStateSignal = this.gameStateService.getSignal();
  }

  public incrementResource(name: ResourceName) {
    this.gameStateSignal.update((current: GameState) => ({
      ...current,
      player: {
        ...current.player,
        resources: {
          ...current.player.resources,
          [name]: {
            ...current.player.resources[name],
            quantity: current.player.resources[name].quantity + 1,
          },
        },
      },
    }));
  }
}
