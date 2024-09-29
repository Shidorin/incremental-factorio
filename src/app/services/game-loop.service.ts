import { Injectable } from '@angular/core';
import { interval, Subscription } from 'rxjs';
import {
  BuildingService,
  MetalService,
  ProductService,
  OreService,
} from './gameState/index';
import { GameProgressService } from './gameProgress';

@Injectable({
  providedIn: 'root',
})
export class GameLoopService {
  private gameLoopSubscription: Subscription | null = null;
  private readonly loopInterval = 1000;

  constructor(
    private buildingService: BuildingService,
    private oreService: OreService,
    private gameProgressService: GameProgressService,
    private metalService: MetalService,
    private productService: ProductService,
  ) {}

  public startLoop(): void {
    if (!this.gameLoopSubscription) {
      this.gameLoopSubscription = interval(this.loopInterval).subscribe(() => {
        this.updateGameState();
      });
    }
  }

  public stopLoop(): void {
    if (this.gameLoopSubscription) {
      this.gameLoopSubscription.unsubscribe();
      this.gameLoopSubscription = null;
    }
  }

  private updateGameState(): void {
    this.buildingService.updateBuildingsLoop();
    this.oreService.updateOresLoop();
    this.metalService.updateMetalsLoop();
    this.productService.updateProductsLoop();
    this.gameProgressService.updateProgress();
  }
}
