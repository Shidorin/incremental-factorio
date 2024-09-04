import { Injectable, WritableSignal } from '@angular/core';
import { BuildingName, ResourceName } from 'src/app/enums';
import { BuildingCost, GameState } from 'src/app/interfaces';
import { GameStateService } from '../game-state.service';

@Injectable({
  providedIn: 'root',
})
export class BuildingCostCalculatorService {
  gameStateSignal: WritableSignal<GameState>;

  constructor(private gameStateService: GameStateService) {
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
      const resourceKey = key as ResourceName;
      result[resourceKey] = {
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
      const resourceKey = key as ResourceName;
      result[resourceKey] = {
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
  public calculateBuildingCost(
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
}
