import { Injectable, WritableSignal } from '@angular/core';
import { MetalName } from 'src/app/constants/types';
import { GameState } from 'src/app/interfaces';
import { GameStateService } from './';

@Injectable({
  providedIn: 'root',
})
export class MetalService {
  gameStateSignal: WritableSignal<GameState>;

  constructor(private gameStateService: GameStateService) {
    this.gameStateSignal = this.gameStateService.getSignal();
  }

  /**
   *  updates metals inside game loop
   *  checks for overcap in production rate
   */
  public updateMetalsLoop(): void {
    const metals = this.gameStateSignal().player.metals;

    Object.keys(metals).forEach((metalName) => {
      const metal = metals[metalName as MetalName];
      metal.quantity += metal.productionRate;
    });

    this.gameStateService.updateMetals(metals);
  }

  public isMetal(name: string): name is MetalName {
    return Object.keys(this.gameStateSignal().player.metals).includes(name);
  }
}
