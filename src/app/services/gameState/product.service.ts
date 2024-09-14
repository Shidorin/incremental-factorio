import { Injectable, WritableSignal } from '@angular/core';
import { GameState } from 'src/app/interfaces';
import { GameStateService } from './game-state.service';
import { ProductName } from 'src/app/constants/types';

@Injectable({
  providedIn: 'root',
})
export class ProductService {
  gameStateSignal: WritableSignal<GameState>;

  constructor(private gameStateService: GameStateService) {
    this.gameStateSignal = this.gameStateService.getSignal();
  }

  /**
   *  updates products inside game loop
   *  checks for overcap in production rate
   */
  public updateProductsLoop(): void {
    const products = this.gameStateSignal().player.products;

    Object.keys(products).forEach((productName) => {
      const product = products[productName as ProductName];
      product.quantity += product.productionRate;
    });

    this.gameStateService.updateProducts(products);
  }

  public isProduct(name: string): name is ProductName {
    return Object.keys(this.gameStateSignal().player.products).includes(name);
  }
}
