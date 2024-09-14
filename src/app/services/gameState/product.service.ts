import { Injectable, WritableSignal } from '@angular/core';
import { GameState } from 'src/app/interfaces';
import { GameStateService } from './game-state.service';
import { MetalName, ProductName } from 'src/app/constants/types';

@Injectable({
  providedIn: 'root',
})
export class ProductService {
  gameStateSignal: WritableSignal<GameState>;

  constructor(private gameStateService: GameStateService) {
    this.gameStateSignal = this.gameStateService.getSignal();
  }

  /**
   *  updates metals inside game loop
   *  checks for overcap in production rate
   */
  public updateProductsLoop(): void {
    const metals = this.gameStateSignal().player.metals;

    Object.keys(metals).forEach((metalName) => {
      const metal = metals[metalName as MetalName];
      metal.quantity += metal.productionRate;
    });

    this.gameStateService.updateMetals(metals);
  }

  public isProduct(name: string): name is ProductName {
    return Object.keys(this.gameStateSignal().player.products).includes(name);
  }
}
