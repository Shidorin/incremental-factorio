import { inject, Injectable, WritableSignal } from '@angular/core';
import { GameState, BuildingName, BuildingConfig } from 'src/app/interfaces';
import { GameStateService } from './game-state.service';

@Injectable({
  providedIn: 'root',
})
export class BuildingService {
  gameStateService: GameStateService;
  gameStateSignal: WritableSignal<GameState>;

  buildingConfig: Record<BuildingName, BuildingConfig> = {
    drills: { baseCost: 5, scalingFactor: 1.6 },
    furnaces: { baseCost: 5, scalingFactor: 1.5 },
    assemblers: { baseCost: 15, scalingFactor: 1.25 },
    labs: { baseCost: 25, scalingFactor: 1.4 },
  };

  constructor() {
    this.gameStateService = inject(GameStateService);
    this.gameStateSignal = this.gameStateService.getSignal();
  }

  private calculateDrillCost(
    buildingName: BuildingName,
    incrementedCount?: boolean
  ): number {
    let result;
    let building = this.gameStateSignal().player.buildings[buildingName];
    let config = this.buildingConfig[buildingName];

    result = Math.ceil(
      config.baseCost *
        Math.pow(
          config.scalingFactor,
          incrementedCount ? building.quantity + 1 : building.quantity
        )
    );
    return result;
  }

  private calculateFurnaceCost(
    buildingName: BuildingName,
    incrementedCount?: boolean
  ): number {
    let result;
    let building = this.gameStateSignal().player.buildings[buildingName];
    let config = this.buildingConfig[buildingName];

    result = Math.ceil(
      config.baseCost *
        Math.pow(
          config.scalingFactor,
          incrementedCount ? building.quantity + 1 : building.quantity
        )
    );
    return result;
  }

  private calculateBuildingCost(
    buildingName: BuildingName,
    incrementedCount?: boolean
  ): number {
    let result: number = -1;
    let currentCount =
      this.gameStateSignal().player.buildings[buildingName].quantity;
    if (incrementedCount) currentCount++;

    switch (buildingName) {
      case 'drills':
        result = this.calculateDrillCost(buildingName, incrementedCount);
        break;
      case 'furnaces':
        result = this.calculateFurnaceCost(buildingName, incrementedCount);
        break;
      default:
        break;
    }
    return result;
  }

  private canBuild(buildingName: BuildingName) {
    const requiredStone =
      this.gameStateSignal().player.buildings[buildingName].cost;
    return (
      this.gameStateSignal().player.resources.stone.quantity >= requiredStone
    );
  }

  private buyBuilding(
    buildingName: BuildingName,
    requiredCost: number,
    incrementBuildingFn: (current: GameState) => number
  ) {
    let newCost = this.calculateBuildingCost(buildingName, true);
    if (newCost === -1) return;

    this.gameStateSignal.update((current: GameState) => ({
      ...current,
      player: {
        ...current.player,
        resources: {
          ...current.player.resources,
          stone: {
            ...current.player.resources.stone,
            quantity: current.player.resources.stone.quantity - requiredCost,
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

  public incrementBuilding(buildingName: BuildingName) {
    let canBuild = this.canBuild(buildingName);
    if (canBuild) {
      this.buyBuilding(
        buildingName,
        this.calculateBuildingCost(buildingName),
        (current) => current.player.buildings[buildingName].quantity + 1
      );
    }
  }
}
