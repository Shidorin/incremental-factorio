import { Injectable, WritableSignal } from '@angular/core';
import { GameState } from 'src/app/interfaces';
import { GameStateService } from './game-state.service';
import { OreName } from 'src/app/constants/types';

@Injectable({
  providedIn: 'root',
})
export class OreService {
  gameStateSignal: WritableSignal<GameState>;

  constructor(private gameStateService: GameStateService) {
    this.gameStateSignal = this.gameStateService.getSignal();
  }

  /**
   *  mining resource by hand
   * @param oreName resource name
   */
  public incrementOre(oreName: OreName) {
    const ore = this.gameStateSignal().player.ores[oreName];

    const newQuantity = Math.min(ore.quantity + 1, ore.capacity);

    if (newQuantity !== ore.quantity) {
      this.gameStateService.updateOres({
        [oreName]: { quantity: newQuantity },
      });
    }
  }

  /**
   *  updates resources inside game loop
   *  checks for overcap in production rate
   */
  public updateOresLoop(): void {
    const ores = this.gameStateSignal().player.ores;

    Object.keys(ores).forEach((oreName) => {
      const ore = ores[oreName as OreName];
      const newQuantity = ore.quantity + ore.productionRate;

      if (newQuantity >= 0 && ore.quantity < ore.capacity) {
        ore.quantity = Math.min(newQuantity, ore.capacity);
      } else if (ore.productionRate < 0) {
        ore.quantity += ore.productionRate;
      } else if (newQuantity < 0) {
        ore.quantity = 0;
      }
    });

    this.gameStateService.updateOres(ores);
  }

  public isOre(name: string): name is OreName {
    return Object.keys(this.gameStateSignal().player.ores).includes(name);
  }
}
