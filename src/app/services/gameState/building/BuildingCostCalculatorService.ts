import { Injectable, WritableSignal } from '@angular/core';
import { BuildingName, OreName } from 'src/app/constants/types';
import { BuildingCost, GameState } from 'src/app/interfaces';
import { GameStateService } from '../game-state.service';
import { BUILDINGS } from 'src/app/constants/enums';

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
    forNextPurchase = false,
  ): BuildingCost {
    const result: BuildingCost = {};
    const building = this.gameStateSignal().player.buildings[buildingName];
    const quantity = building.quantity + (forNextPurchase ? 1 : 0);

    Object.entries(building.cost).forEach(([key, value]) => {
      const resourceKey = key as OreName;
      result[resourceKey] = {
        ...value,
        count: Math.ceil(
          value.baseCost * Math.pow(value.scalingFactor, quantity),
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
    forNextPurchase = false,
  ): BuildingCost {
    const result: BuildingCost = {};
    const building = this.gameStateSignal().player.buildings[buildingName];
    const quantity = building.quantity + (forNextPurchase ? 1 : 0);

    Object.entries(building.cost).forEach(([key, value]) => {
      const resourceKey = key as OreName;
      result[resourceKey] = {
        ...value,
        count: Math.ceil(
          value.baseCost * Math.pow(value.scalingFactor, quantity),
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
    forNextPurchase = false,
  ): BuildingCost {
    let result: BuildingCost = {};

    switch (buildingName) {
      case BUILDINGS.DRILLS:
        result = this.calculateDrillCost(buildingName, forNextPurchase);
        break;
      case BUILDINGS.FURNACES:
        result = this.calculateFurnaceCost(buildingName, forNextPurchase);
        break;
      case BUILDINGS.ASSEMBLERS:
        //general function before math
        result = this.calculateFurnaceCost(buildingName, forNextPurchase);
        break;
      case BUILDINGS.LABS:
        //general function before math
        result = this.calculateFurnaceCost(buildingName, forNextPurchase);
        break;
      default:
        break;
    }
    return result;
  }
}
