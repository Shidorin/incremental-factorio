import { Injectable } from '@angular/core';
import { interval, Subscription } from 'rxjs';
import { BuildingService, ResourceService } from './gameState/index';
import { GameProgressService } from './gameProgress';

@Injectable({
  providedIn: 'root',
})
export class GameLoopService {
  private gameLoopSubscription: Subscription | null = null;
  private readonly loopInterval = 1000;

  constructor(
    private buildingService: BuildingService,
    private resourceService: ResourceService,
    private gameProgressService: GameProgressService,
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
    this.resourceService.updateResourcesLoop();
    this.resourceService.updateMetalsLoop();
    this.gameProgressService.updateProgress();
  }
}
