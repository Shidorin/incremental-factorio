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

  private canMine(resourceName: ResourceName) {
    let quantity =
      this.gameStateSignal().player.resources[resourceName].quantity;
    let capacity =
      this.gameStateSignal().player.resources[resourceName].capacity;

    return quantity < capacity;
  }

  public incrementResource(resourceName: ResourceName) {
    if (this.canMine(resourceName))
      this.gameStateSignal.update((current: GameState) => ({
        ...current,
        player: {
          ...current.player,
          resources: {
            ...current.player.resources,
            [resourceName]: {
              ...current.player.resources[resourceName],
              quantity: current.player.resources[resourceName].quantity + 1,
            },
          },
        },
      }));
  }
}
