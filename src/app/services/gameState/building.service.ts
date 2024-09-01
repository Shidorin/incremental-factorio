import { inject, Injectable, WritableSignal } from '@angular/core';
import {
  GameState,
  BuildingName,
  ResourceName,
  BuildingCost,
} from 'src/app/interfaces';
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

  /**
   * Calculates the cost of a drill based on its current or next quantity.
   * @param buildingName - The name of the building.
   * @param forNextPurchase - If true, calculates the cost for the next building purchase.
   * @returns The BuildingCost object with updated costs.
   */
  private calculateDrillCost(
    buildingName: BuildingName,
    forNextPurchase: boolean = false
  ): BuildingCost {
    let result: BuildingCost = {};
    let building = this.gameStateSignal().player.buildings[buildingName];
    let quantity = building.quantity + (forNextPurchase ? 1 : 0);

    Object.entries(building.cost).forEach(([key, value]) => {
      result[key] = {
        ...value,
        count: Math.ceil(
          value.baseCost * Math.pow(value.scalingFactor, quantity)
        ),
      };
    });

    return result;
  }

  /**
   * Calculates the cost of a furnace based on its current or next quantity.
   * @param buildingName - The name of the building.
   * @param forNextPurchase - If true, calculates the cost for the next building purchase.
   * @returns The BuildingCost object with updated costs.
   */
  private calculateFurnaceCost(
    buildingName: BuildingName,
    forNextPurchase: boolean = false
  ): BuildingCost {
    let result: BuildingCost = {};
    let building = this.gameStateSignal().player.buildings[buildingName];
    let quantity = building.quantity + (forNextPurchase ? 1 : 0);

    Object.entries(building.cost).forEach(([key, value]) => {
      result[key] = {
        ...value,
        count: Math.ceil(
          value.baseCost * Math.pow(value.scalingFactor, quantity)
        ),
      };
    });

    return result;
  }

  /**
   * Calculates the cost of a building based on its current or next quantity.
   * @param buildingName - The name of the building.
   * @param forNextPurchase - If true, calculates the cost for the next building purchase.
   * @returns The BuildingCost object with updated costs.
   */
  private calculateBuildingCost(
    buildingName: BuildingName,
    forNextPurchase: boolean = false
  ): BuildingCost {
    let result: BuildingCost = {};

    switch (buildingName) {
      case 'drills':
        result = this.calculateDrillCost(buildingName, forNextPurchase);
        break;
      case 'furnaces':
        result = this.calculateFurnaceCost(buildingName, forNextPurchase);
        break;
      // Add more cases here for other buildings as needed
      default:
        break;
    }
    return result;
  }

  /**
   * Checks if building can be afforded.
   * @param costs - Cost of the building.
   * @returns true if can be afforded.
   */
  private canAfford(costs: BuildingCost): boolean {
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
    this.gameStateSignal.update((current: GameState) => {
      const updatedResources = { ...current.player.resources };

      Object.entries(costs).forEach(([resource, amount]) => {
        const resourceName = resource as ResourceName;

        if (updatedResources[resourceName]) {
          updatedResources[resourceName].quantity -= amount.count;
        }
      });

      return {
        ...current,
        player: {
          ...current.player,
          resources: updatedResources,
        },
      };
    });
  }
  /**
   * Purchase logic.
   * @param buildingName - The name of the building.
   * @param requiredCost - Cost of the building.
   * @param incrementBuildingFn - increments building quantity.
   */
  private purchaseBuilding(
    buildingName: BuildingName,
    requiredCost: BuildingCost,
    incrementBuildingFn: (current: GameState) => number
  ): void {
    this.deductResource(requiredCost);

    let newCost = this.calculateBuildingCost(buildingName, true);

    this.gameStateSignal.update((current: GameState) => ({
      ...current,
      player: {
        ...current.player,
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

  /**
   * communication with a component
   * @param buildingName - The name of the building.
   */
  public incrementBuilding(buildingName: BuildingName): void {
    const currentCost =
      this.gameStateSignal().player.buildings[buildingName].cost;

    if (this.canAfford(currentCost)) {
      this.purchaseBuilding(
        buildingName,
        this.calculateBuildingCost(buildingName),
        (current) => current.player.buildings[buildingName].quantity + 1
      );
    }
  }
}
