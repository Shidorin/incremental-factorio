import { Injectable, WritableSignal } from '@angular/core';
import { Building, GameState, Metal, Resource } from 'src/app/interfaces';
import { BUILDINGS, RESOURCES } from 'src/app/constants/enums';
import {
  BuildingName,
  MetalName,
  ProductName,
  ResourceName,
  STATUS,
} from 'src/app/constants/types';
import {
  BuildingCostCalculatorService,
  BuildingManagerService,
} from './building/';
import { GameStateService, ResourceService } from './';

@Injectable({
  providedIn: 'root',
})
export class BuildingService {
  gameStateSignal: WritableSignal<GameState>;

  constructor(
    private gameStateService: GameStateService,
    private costCalculator: BuildingCostCalculatorService,
    private buildingManager: BuildingManagerService,
    private resourceService: ResourceService
  ) {
    this.gameStateSignal = this.gameStateService.getSignal();
  }

  /**
   * communication with a component
   * @param buildingName - The name of the building.
   */
  public incrementBuilding(buildingName: BuildingName): void {
    const currentCost =
      this.gameStateSignal().player.buildings[buildingName].cost;

    if (this.buildingManager.canAfford(currentCost)) {
      this.buildingManager.purchaseBuilding(
        buildingName,
        this.costCalculator.calculateBuildingCost(buildingName),
        (current) => current.player.buildings[buildingName].quantity + 1
      );
    }
  }

  /**
   * calculates coal usage for active buildings
   * @returns total coal usage
   */
  public calculateBuildingsCoalUsage(): number {
    const buildings = this.gameStateSignal().player.buildings;
    let totalCoalUsage = 0;

    Object.keys(buildings).forEach((buildingName) => {
      const building = buildings[buildingName as BuildingName];

      building.assignments.forEach((assignment) => {
        if (assignment.status === STATUS.ACTIVE && assignment.job) {
          if (building.fuelUsage !== undefined) {
            totalCoalUsage += building.fuelUsage;
          }
        }
      });
    });

    return totalCoalUsage;
  }

  /**
   * checks recipe for active assemblers
   *  subtracts resources
   *  updates production rates
   * @param productionRates for specific metal
   */
  private furnaceJob(
    metalName: MetalName,
    productionRates: { [metal in MetalName]?: number }
  ): void {
    const resources = this.gameStateSignal().player.resources;
    const metal = this.gameStateSignal().player.metals[metalName];

    for (const recipeItem of metal.recipe) {
      const availableQuantity = resources[recipeItem.name].quantity;

      if (availableQuantity < recipeItem.count) {
        // console.warn(`Not enough ${recipeItem.resourceName}. Required: ${recipeItem.count}, available: ${availableQuantity}`);
        return;
      }
    }

    metal.recipe.forEach((recipeItem) => {
      resources[recipeItem.name].quantity -= recipeItem.count;
    });

    productionRates[metalName] = (productionRates[metalName] || 0) + 1;
  }

  /**
   * game loop update
   */
  public updateBuildingsLoop(): void {
    const buildings = this.gameStateSignal().player.buildings;

    const productionRates: {
      resources: { [resource in ResourceName]?: number };
      metals: { [metal in MetalName]?: number };
      products: { [product in ProductName]?: number };
    } = {
      resources: {},
      metals: {},
      products: {},
    };

    Object.keys(this.gameStateSignal().player.resources).forEach(
      (resourceName) => {
        productionRates.resources[resourceName as ResourceName] = 0;
      }
    );

    Object.keys(this.gameStateSignal().player.metals).forEach((metalName) => {
      productionRates.metals[metalName as MetalName] = 0;
    });

    Object.keys(this.gameStateSignal().player.products).forEach(
      (productName) => {
        productionRates.products[productName as ProductName] = 0;
      }
    );

    const totalCoalUsage = this.calculateBuildingsCoalUsage();

    if (totalCoalUsage > 0) {
      productionRates.resources.coal =
        (productionRates.resources.coal || 0) - totalCoalUsage;
      this.deactivateBuildingsIfNeeded(totalCoalUsage);
    }

    Object.keys(buildings).forEach((buildingName) => {
      const building = buildings[buildingName as BuildingName];

      building.assignments.forEach((assignment) => {
        if (assignment.status === STATUS.ACTIVE && assignment.job) {
          const job = assignment.job;

          if (this.resourceService.isResource(job)) {
            const resource: ResourceName = job as ResourceName;
            productionRates.resources[resource] =
              (productionRates.resources[resource] || 0) + 1;
          } else if (this.resourceService.isMetal(job)) {
            const metal: MetalName = job as MetalName;
            this.furnaceJob(metal, productionRates.metals);
          } else if (this.resourceService.isProduct(job)) {
            const product: ProductName = job as ProductName;
            productionRates.products[product] =
              (productionRates.products[product] || 0) + 1;
          }
        }
      });
    });

    this.updateProductionRates(productionRates);
  }

  /**
   * Updates resource production rates
   */
  private updateProductionRates(productionRates: {
    resources: { [resource in ResourceName]?: number };
    metals: { [metal in MetalName]?: number };
    products: { [product in ProductName]?: number };
  }) {
    const resourceUpdates: Partial<Record<ResourceName, Partial<Resource>>> =
      {};
    const metalUpdates: Partial<Record<MetalName, Partial<Metal>>> = {};
    const productUpdates: Partial<Record<ProductName, number>> = {};

    Object.keys(productionRates.resources).forEach((resourceName) => {
      resourceUpdates[resourceName as ResourceName] = {
        productionRate: productionRates.resources[resourceName as ResourceName],
      };
    });

    Object.keys(productionRates.metals).forEach((metalName) => {
      metalUpdates[metalName as MetalName] = {
        productionRate: productionRates.metals[metalName as MetalName],
      };
    });

    Object.keys(productionRates.products).forEach((productName) => {
      productUpdates[productName as ProductName] =
        productionRates.products[productName as ProductName];
    });

    this.gameStateService.updateResources(resourceUpdates);
    this.gameStateService.updateMetals(metalUpdates);
    // this.gameStateService.updateProducts(productUpdates);
  }

  /**
   * deactivates buildings when coal usage would shortage capacity
   * @param requiredCoalUsage count of negative coal usage
   */
  private deactivateBuildingsIfNeeded(requiredCoalUsage: number): void {
    const coalResource = this.gameStateSignal().player.resources.coal;

    if (coalResource.quantity < requiredCoalUsage) {
      const buildings = Object.values(this.gameStateSignal().player.buildings);

      const priorityOrder = [
        BUILDINGS.LABS,
        BUILDINGS.ASSEMBLERS,
        BUILDINGS.FURNACES,
        BUILDINGS.DRILLS,
      ] as BuildingName[];

      for (const priority of priorityOrder) {
        const buildingsOfPriority = buildings.filter(
          (building) => building.name === priority
        );

        buildingsOfPriority.sort((a, b) => a.id - b.id);

        for (const building of buildingsOfPriority) {
          for (const assignment of building.assignments) {
            if (coalResource.quantity >= requiredCoalUsage) break;
            if (
              assignment.status === STATUS.ACTIVE &&
              assignment.job !== RESOURCES.COAL
            ) {
              assignment.status = STATUS.INACTIVE;
              requiredCoalUsage -= building.fuelUsage;
            }
          }
        }
      }
    }
  }

  /**
   * handles assigments of drills, player can increment or decrement drill assignment to resource
   * @todo could be generalized for every building
   * @param isDrillIncrement if true increment, if false decrement
   * @param resourceName resource name
   */
  public handleDrillAssignment(
    isDrillIncrement: boolean,
    resourceName: ResourceName
  ) {
    const drills = this.gameStateSignal().player.buildings.drills;

    if (!drills || !drills.assignments) {
      return;
    }

    const activeAssignments = drills.assignments.filter(
      (assignment) =>
        assignment.job === resourceName && assignment.status === STATUS.ACTIVE
    );

    if (isDrillIncrement) {
      const inactiveAssignment = drills.assignments.find(
        (assignment) => assignment.status === STATUS.INACTIVE
      );

      if (inactiveAssignment) {
        inactiveAssignment.status = STATUS.ACTIVE;
        inactiveAssignment.job = resourceName;
      } else {
        console.warn('No inactive drills available to assign.');
      }
    } else {
      if (activeAssignments.length > 0) {
        activeAssignments[0].status = STATUS.INACTIVE;
        activeAssignments[0].job = undefined;
      } else {
        console.warn(
          `No active drills assigned to ${resourceName} to deactivate.`
        );
      }
    }

    const buildingUpdates: Partial<Building> = {
      assignments: [...drills.assignments],
    };

    this.gameStateService.updateSingleBuilding(
      BUILDINGS.DRILLS,
      buildingUpdates
    );
  }

  /**
   * handles assigments of furnaces, player can increment or decrement drill assignment to resource
   * @todo could be generalized for every building
   * @param isFurnaceIncrement if true increment, if false decrement
   * @param metalName resource name
   */
  public handleFurnaceAssignment(
    isFurnaceIncrement: boolean,
    metalName: MetalName
  ) {
    const furnaces = this.gameStateSignal().player.buildings.furnaces;
    if (!furnaces || !furnaces.assignments) {
      return;
    }
    const activeAssignments = furnaces.assignments.filter(
      (assignment) =>
        assignment.job === metalName && assignment.status === STATUS.ACTIVE
    );
    if (isFurnaceIncrement) {
      const inactiveAssignment = furnaces.assignments.find(
        (assignment) => assignment.status === STATUS.INACTIVE
      );
      if (inactiveAssignment) {
        inactiveAssignment.status = STATUS.ACTIVE;
        inactiveAssignment.job = metalName;
      } else {
        console.warn('No inactive furnaces available to assign.');
      }
    } else {
      if (activeAssignments.length > 0) {
        activeAssignments[0].status = STATUS.INACTIVE;
        activeAssignments[0].job = undefined;
      } else {
        console.warn(
          `No active furnaces assigned to ${metalName} to deactivate.`
        );
      }
    }
    const buildingUpdates: Partial<Building> = {
      assignments: [...furnaces.assignments],
    };
    this.gameStateService.updateSingleBuilding(
      BUILDINGS.FURNACES,
      buildingUpdates
    );
  }
}
