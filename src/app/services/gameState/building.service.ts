import { Injectable, WritableSignal } from '@angular/core';
import { Building, GameState, Resource } from 'src/app/interfaces';
import { GameStateService } from './game-state.service';
import { BuildingName, ResourceName, STATUS } from 'src/app/constants/types';
import {
  BuildingCostCalculatorService,
  BuildingManagerService,
} from './building/index';
import { BUILDINGS, RESOURCES } from 'src/app/constants/enums';

@Injectable({
  providedIn: 'root',
})
export class BuildingService {
  gameStateSignal: WritableSignal<GameState>;

  constructor(
    private gameStateService: GameStateService,
    private costCalculator: BuildingCostCalculatorService,
    private buildingManager: BuildingManagerService
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
   * game loop update
   */
  public updateBuildingsLoop(): void {
    const buildings = this.gameStateSignal().player.buildings;

    const productionRates: { [resource in ResourceName]?: number } = {};

    let totalCoalUsage = 0;

    Object.keys(this.gameStateSignal().player.resources).forEach(
      (resourceName) => {
        productionRates[resourceName as ResourceName] = 0;
      }
    );

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

    if (totalCoalUsage > 0) {
      productionRates.coal = (productionRates.coal || 0) - totalCoalUsage;
      this.deactivateBuildingsIfNeeded(totalCoalUsage);
    }

    Object.keys(buildings).forEach((buildingName) => {
      const building = buildings[buildingName as BuildingName];

      building.assignments.forEach((assignment) => {
        if (assignment.status === STATUS.ACTIVE && assignment.job) {
          const resource: ResourceName = assignment.job as ResourceName;

          productionRates[resource] = (productionRates[resource] || 0) + 1;
        }
      });
    });

    this.updateResourceProductionRates(productionRates);
  }

  /**
   * Updates resource production rates
   */
  private updateResourceProductionRates(productionRates: {
    [resource in ResourceName]?: number;
  }) {
    const resourceUpdates: Partial<Record<ResourceName, Partial<Resource>>> =
      {};

    Object.keys(productionRates).forEach((resourceName) => {
      resourceUpdates[resourceName as ResourceName] = {
        productionRate: productionRates[resourceName as ResourceName],
      };
    });

    this.gameStateService.updateResources(resourceUpdates);
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

      for (let priority of priorityOrder) {
        const buildingsOfPriority = buildings.filter(
          (building) => building.name === priority
        );

        buildingsOfPriority.sort((a, b) => a.id - b.id);

        for (let building of buildingsOfPriority) {
          for (let assignment of building.assignments) {
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
}
