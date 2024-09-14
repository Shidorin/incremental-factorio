import { Injectable, WritableSignal } from '@angular/core';
import { GameState } from 'src/app/interfaces';
import { GameStateService } from './game-state.service';
import { ResourceName } from 'src/app/constants/types';

@Injectable({
  providedIn: 'root',
})
export class ResourceService {
  gameStateSignal: WritableSignal<GameState>;

  constructor(private gameStateService: GameStateService) {
    this.gameStateSignal = this.gameStateService.getSignal();
  }

  /**
   *  mining resource by hand
   * @param resourceName resource name
   */
  public incrementResource(resourceName: ResourceName) {
    const resource = this.gameStateSignal().player.resources[resourceName];

    const newQuantity = Math.min(resource.quantity + 1, resource.capacity);

    if (newQuantity !== resource.quantity) {
      this.gameStateService.updateResources({
        [resourceName]: { quantity: newQuantity },
      });
    }
  }

  /**
   *  updates resources inside game loop
   *  checks for overcap in production rate
   */
  public updateResourcesLoop(): void {
    const resources = this.gameStateSignal().player.resources;

    Object.keys(resources).forEach((resourceName) => {
      const resource = resources[resourceName as ResourceName];
      const newQuantity = resource.quantity + resource.productionRate;

      if (newQuantity >= 0 && resource.quantity < resource.capacity) {
        resource.quantity = Math.min(newQuantity, resource.capacity);
      } else if (resource.productionRate < 0) {
        resource.quantity += resource.productionRate;
      } else if (newQuantity < 0) {
        resource.quantity = 0;
      }
    });

    this.gameStateService.updateResources(resources);
  }

  public isResource(name: string): name is ResourceName {
    return Object.keys(this.gameStateSignal().player.resources).includes(name);
  }
}
