import { inject, Injectable, WritableSignal } from '@angular/core';
import { GameState, BuildingName } from 'src/app/interfaces';
import { GameStateService } from './game-state.service';

@Injectable({
  providedIn: 'root',
})
export class BuildingService {
  gameStateService: GameStateService;
  gameStateSignal: WritableSignal<GameState>;
  constructor() {
    this.gameStateService = inject(GameStateService);
    this.gameStateSignal = this.gameStateService.getSignal();
  }
  private calculateDrillCost(currentDrillCount: number): number {
    return Math.ceil(10 * Math.pow(1.2, currentDrillCount));
  }
  private canBuildDrill() {
    const requiredStone = this.gameStateSignal().player.buildings.drills.cost;
    return (
      this.gameStateSignal().player.resources.stone.quantity >= requiredStone
    );
  }
  private updateBuildingAndResources(
    buildingName: BuildingName,
    requiredStone: number,
    incrementBuildingFn: (current: GameState) => number
  ) {
    let newCost = this.calculateDrillCost(
      this.gameStateSignal().player.buildings.drills.quantity + 1
    );
    this.gameStateSignal.update((current: GameState) => ({
      ...current,
      player: {
        ...current.player,
        resources: {
          ...current.player.resources,
          stone: {
            ...current.player.resources.stone,
            quantity: current.player.resources.stone.quantity - requiredStone,
          },
        },
        buildings: {
          ...current.player.buildings,
          [buildingName]: {
            ...current.player.buildings[buildingName],
            quantity: incrementBuildingFn(current),
            cost: newCost,
          },
        },
      },
    }));
  }
  public incrementBuilding(name: BuildingName) {
    let canBuild = false;
    switch (name) {
      case 'drills':
        canBuild = this.canBuildDrill();
        if (canBuild) {
          this.updateBuildingAndResources(
            name,
            this.calculateDrillCost(
              this.gameStateSignal().player.buildings.drills.quantity
            ),
            (current) => current.player.buildings.drills.quantity + 1
          );
        }
        break;
      default:
        break;
    }
  }
}
