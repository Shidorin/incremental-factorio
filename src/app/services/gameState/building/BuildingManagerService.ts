import { Injectable, WritableSignal } from '@angular/core';
import {
  BuildingCost,
  BuildingName,
  MetalName,
  ProductName,
  ResourceName,
  STATUS,
} from 'src/app/constants/types';
import { Resource, GameState, Building, Metal } from 'src/app/interfaces';
import { GameStateService, ResourceService } from '../';
import { BuildingCostCalculatorService } from './';

@Injectable({
  providedIn: 'root',
})
export class BuildingManagerService {
  gameStateSignal: WritableSignal<GameState>;

  constructor(
    private gameStateService: GameStateService,
    private costCalculator: BuildingCostCalculatorService,
    private resourceService: ResourceService,
  ) {
    this.gameStateSignal = this.gameStateService.getSignal();
  }

  /**
   * Checks if building can be afforded.
   * @param cost - Cost of the building.
   * @returns true if can be afforded.
   */
  public canAfford(costs: BuildingCost): boolean {
    const resources = this.gameStateSignal().player.resources;
    const metals = this.gameStateSignal().player.metals;
    // const products = this.gameStateSignal().player.products;

    return Object.entries(costs).every(([itemName, cost]) => {
      if (itemName in resources) {
        return resources[itemName as ResourceName]?.quantity >= cost.count;
      }

      if (itemName in metals) {
        return metals[itemName as MetalName]?.quantity >= cost.count;
      }

      // if (itemName in products) {
      //   return products[itemName as ProductName]?.quantity >= cost.count;
      // }

      return false;
    });
  }

  /**
   * Deducts resources based on cost.
   * @param cost - Cost of the building.
   */
  private deductItem(cost: BuildingCost): void {
    const resourceUpdates: Partial<Record<ResourceName, Partial<Resource>>> =
      {};
    const metalUpdates: Partial<Record<MetalName, Partial<Metal>>> = {};
    // const productUpdates: Partial<Record<ProductName, Partial<Product>>> = {};

    Object.entries(cost).forEach(([itemName, amount]) => {
      if (this.resourceService.isResource(itemName)) {
        resourceUpdates[itemName] = {
          quantity:
            (this.gameStateSignal().player.resources[itemName]?.quantity || 0) -
            amount.count,
        };
      } else if (this.resourceService.isMetal(itemName)) {
        console.log('deduct item');
        metalUpdates[itemName] = {
          quantity:
            (this.gameStateSignal().player.metals[itemName]?.quantity || 0) -
            amount.count,
        };
      }
      // else if (this.resourceService.isProduct(itemName)) {
      //   productUpdates[itemName] = {
      //     quantity:
      //       (this.gameStateSignal().player.products[itemName]?.quantity || 0) -
      //       amount.count,
      //   };
      // }
    });

    this.gameStateService.updateResources(resourceUpdates);
    this.gameStateService.updateMetals(metalUpdates);
    // this.gameStateService.updateProducts(productUpdates);
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
    incrementBuildingFn: (current: GameState) => number,
  ): void {
    this.deductItem(requiredCost);

    const newCost = this.costCalculator.calculateBuildingCost(
      buildingName,
      true,
    );

    const currentBuilding =
      this.gameStateSignal().player.buildings[buildingName];

    const buildingsUpdate: Partial<Building> = {
      quantity: incrementBuildingFn(this.gameStateSignal()),
      cost: newCost,
      assignments: [
        ...currentBuilding.assignments,
        { status: STATUS.INACTIVE },
      ],
    };

    this.gameStateService.updateSingleBuilding(buildingName, buildingsUpdate);
  }
}
