import { Injectable, WritableSignal } from '@angular/core';
import { BuildingCost, BuildingName, ResourceName, STATUS } from 'src/app/enums';
import { Resource, GameState, Building } from 'src/app/interfaces';
import { GameStateService } from '../game-state.service';
import { BuildingCostCalculatorService } from './index';

@Injectable({
  providedIn: 'root',
})
export class BuildingManagerService {
  gameStateSignal: WritableSignal<GameState>;

  constructor(
    private gameStateService: GameStateService,
    private costCalculator: BuildingCostCalculatorService
  ) {
    this.gameStateSignal = this.gameStateService.getSignal();
  }
  /**
   * Checks if building can be afforded.
   * @param costs - Cost of the building.
   * @returns true if can be afforded.
   */
  public canAfford(costs: BuildingCost): boolean {
    const resources = this.gameStateSignal().player.resources;
    return Object.entries(costs).every(
      ([resource, amount]) =>
        resources[resource as ResourceName]?.quantity >= amount.count
    );
  }

  /**
   * Deducts resources based on cost.
   * @param costs - Cost of the building.
   */
  private deductResource(costs: BuildingCost): void {
    const resourceUpdates: Partial<Record<ResourceName, Partial<Resource>>> =
      {};

    Object.entries(costs).forEach(([resource, amount]) => {
      const resourceName = resource as ResourceName;

      resourceUpdates[resourceName] = {
        quantity:
          (this.gameStateSignal().player.resources[resourceName]?.quantity ||
            0) - amount.count,
      };
    });

    this.gameStateService.updateResources(resourceUpdates);
  }

  /**
   * Purchase logic.
   * @param buildingName - The name of the building.
   * @param requiredCost - Cost of the building.
   * @param incrementBuildingFn - increments building quantity.
   */
  public purchaseBuilding(
    buildingName: BuildingName,
    requiredCost: BuildingCost,
    incrementBuildingFn: (current: GameState) => number
  ): void {
    this.deductResource(requiredCost);

    const newCost = this.costCalculator.calculateBuildingCost(
      buildingName,
      true
    );
    const currentBuilding =
      this.gameStateSignal().player.buildings[buildingName];

    const buildingsUpdate: Partial<Building> = {
      quantity: incrementBuildingFn(this.gameStateSignal()),
      cost: newCost,
      assignments: [
        ...currentBuilding.assignments,
        { status: STATUS.inactive },
      ],
    };

    this.gameStateService.updateSingleBuilding(buildingName, buildingsUpdate);
  }
}
