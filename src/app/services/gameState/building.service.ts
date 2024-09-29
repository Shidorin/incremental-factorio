import { Injectable, WritableSignal } from '@angular/core';
import {
  Building,
  GameState,
  Metal,
  Product,
  Ore,
} from 'src/app/interfaces';
import { BUILDINGS, CATEGORIES, ORES } from 'src/app/constants/enums';
import {
  BuildingName,
  MetalName,
  ProductName,
  OreName,
  STATUS,
} from 'src/app/constants/types';
import {
  BuildingCostCalculatorService,
  BuildingManagerService,
} from './building/';
import {
  GameStateService,
  MetalService,
  ProductService,
  OreService,
} from './';

@Injectable({
  providedIn: 'root',
})
export class BuildingService {
  gameStateSignal: WritableSignal<GameState>;

  constructor(
    private gameStateService: GameStateService,
    private costCalculator: BuildingCostCalculatorService,
    private buildingManager: BuildingManagerService,
    private oreService: OreService,
    private metalService: MetalService,
    private productService: ProductService,
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
        (current) => current.player.buildings[buildingName].quantity + 1,
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
   *  decreases production rate
   *  updates production rates
   * @param productionRates
   */
  private buildingJob(
    jobName: MetalName | ProductName,
    productionRates: {
      ores: { [ore in OreName]?: number };
      metals: { [metal in MetalName]?: number };
      products: { [product in ProductName]?: number };
    },
    jobType: CATEGORIES.METALS | CATEGORIES.PRODUCTS,
  ): void {
    const ores = this.gameStateSignal().player.ores;
    const metals = this.gameStateSignal().player.metals;
    const products = this.gameStateSignal().player.products;

    const job =
      jobType === CATEGORIES.METALS
        ? metals[jobName as MetalName]
        : products[jobName as ProductName];

    for (const recipeItem of job.recipe) {
      let availableQuantity = 0;

      if (this.oreService.isOre(recipeItem.name)) {
        availableQuantity = ores[recipeItem.name as OreName].quantity;
      } else if (this.metalService.isMetal(recipeItem.name)) {
        availableQuantity = metals[recipeItem.name as MetalName].quantity;
      } else if (this.productService.isProduct(recipeItem.name)) {
        availableQuantity = products[recipeItem.name as ProductName].quantity;
      }

      if (availableQuantity < recipeItem.count) {
        return;
      }
    }

    job.recipe.forEach((recipeItem) => {
      if (this.oreService.isOre(recipeItem.name)) {
        if (
          productionRates.ores[recipeItem.name as OreName] ===
          undefined
        ) {
          productionRates.ores[recipeItem.name as OreName] = 0;
        }
        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
        productionRates.ores[recipeItem.name as OreName]! -=
          recipeItem.count;
      } else if (this.metalService.isMetal(recipeItem.name)) {
        if (
          productionRates.metals[recipeItem.name as MetalName] === undefined
        ) {
          productionRates.metals[recipeItem.name as MetalName] = 0;
        }
        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
        productionRates.metals[recipeItem.name as MetalName]! -=
          recipeItem.count;
      } else if (this.productService.isProduct(recipeItem.name)) {
        if (
          productionRates.products[recipeItem.name as ProductName] === undefined
        ) {
          productionRates.products[recipeItem.name as ProductName] = 0;
        }
        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
        productionRates.products[recipeItem.name as ProductName]! -=
          recipeItem.count;
      }
    });

    if (jobType === CATEGORIES.METALS) {
      productionRates.metals[jobName as MetalName] =
        (productionRates.metals[jobName as MetalName] || 0) +
        job.producedAmount;
    } else if (jobType === CATEGORIES.PRODUCTS) {
      productionRates.products[jobName as ProductName] =
        (productionRates.products[jobName as ProductName] || 0) +
        job.producedAmount;
    }
  }

  /**
   * game loop update
   */
  public updateBuildingsLoop(): void {
    const buildings = this.gameStateSignal().player.buildings;

    const productionRates: {
      ores: { [ore in OreName]?: number };
      metals: { [metal in MetalName]?: number };
      products: { [product in ProductName]?: number };
    } = {
      ores: {},
      metals: {},
      products: {},
    };

    Object.keys(this.gameStateSignal().player.ores).forEach(
      (oreName) => {
        productionRates.ores[oreName as OreName] = 0;
      },
    );

    Object.keys(this.gameStateSignal().player.metals).forEach((metalName) => {
      productionRates.metals[metalName as MetalName] = 0;
    });

    Object.keys(this.gameStateSignal().player.products).forEach(
      (productName) => {
        productionRates.products[productName as ProductName] = 0;
      },
    );

    const totalCoalUsage = this.calculateBuildingsCoalUsage();

    if (totalCoalUsage > 0) {
      productionRates.ores.coal =
        (productionRates.ores.coal || 0) - totalCoalUsage;
      this.deactivateBuildingsIfNeeded(totalCoalUsage);
    }

    Object.keys(buildings).forEach((buildingName) => {
      const building = buildings[buildingName as BuildingName];

      building.assignments.forEach((assignment) => {
        if (assignment.status === STATUS.ACTIVE && assignment.job) {
          const job = assignment.job;

          if (this.oreService.isOre(job)) {
            const ore: OreName = job as OreName;
            productionRates.ores[ore] =
              (productionRates.ores[ore] || 0) + 1;
          } else if (this.metalService.isMetal(job)) {
            const metal: MetalName = job as MetalName;
            this.buildingJob(metal, productionRates, CATEGORIES.METALS);
          } else if (this.productService.isProduct(job)) {
            const product: ProductName = job as ProductName;
            this.buildingJob(product, productionRates, CATEGORIES.PRODUCTS);
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
    ores: { [resource in OreName]?: number };
    metals: { [metal in MetalName]?: number };
    products: { [product in ProductName]?: number };
  }) {
    const oreUpdates: Partial<Record<OreName, Partial<Ore>>> =
      {};
    const metalUpdates: Partial<Record<MetalName, Partial<Metal>>> = {};
    const productUpdates: Partial<Record<ProductName, Partial<Product>>> = {};

    Object.keys(productionRates.ores).forEach((oreName) => {
      oreUpdates[oreName as OreName] = {
        productionRate: productionRates.ores[oreName as OreName],
      };
    });

    Object.keys(productionRates.metals).forEach((metalName) => {
      metalUpdates[metalName as MetalName] = {
        productionRate: productionRates.metals[metalName as MetalName],
      };
    });

    Object.keys(productionRates.products).forEach((productName) => {
      productUpdates[productName as ProductName] = {
        productionRate: productionRates.products[productName as ProductName],
      };
    });

    this.gameStateService.updateOres(oreUpdates);
    this.gameStateService.updateMetals(metalUpdates);
    this.gameStateService.updateProducts(productUpdates);
  }

  /**
   * deactivates buildings when coal usage would shortage capacity
   * @param requiredCoalUsage count of negative coal usage
   */
  private deactivateBuildingsIfNeeded(requiredCoalUsage: number): void {
    const coalOre = this.gameStateSignal().player.ores.coal;

    if (coalOre.quantity < requiredCoalUsage) {
      const buildings = Object.values(this.gameStateSignal().player.buildings);

      const priorityOrder = [
        BUILDINGS.LABS,
        BUILDINGS.ASSEMBLERS,
        BUILDINGS.FURNACES,
        BUILDINGS.DRILLS,
      ] as BuildingName[];

      for (const priority of priorityOrder) {
        const buildingsOfPriority = buildings.filter(
          (building) => building.name === priority,
        );

        buildingsOfPriority.sort((a, b) => a.id - b.id);

        for (const building of buildingsOfPriority) {
          for (const assignment of building.assignments) {
            if (coalOre.quantity >= requiredCoalUsage) break;
            if (
              assignment.status === STATUS.ACTIVE &&
              assignment.job !== ORES.COAL
            ) {
              assignment.status = STATUS.INACTIVE;
              assignment.job = undefined;
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
   * @param oreName resource name
   */
  public handleDrillAssignment(
    isDrillIncrement: boolean,
    oreName: OreName,
  ) {
    const drills = this.gameStateSignal().player.buildings.drills;

    if (!drills || !drills.assignments) {
      return;
    }

    const activeAssignments = drills.assignments.filter(
      (assignment) =>
        assignment.job === oreName && assignment.status === STATUS.ACTIVE,
    );

    if (isDrillIncrement) {
      const inactiveAssignment = drills.assignments.find(
        (assignment) => assignment.status === STATUS.INACTIVE,
      );

      if (inactiveAssignment) {
        inactiveAssignment.status = STATUS.ACTIVE;
        inactiveAssignment.job = oreName;
      } else {
        console.warn('No inactive drills available to assign.');
      }
    } else {
      if (activeAssignments.length > 0) {
        activeAssignments[0].status = STATUS.INACTIVE;
        activeAssignments[0].job = undefined;
      } else {
        console.warn(
          `No active drills assigned to ${oreName} to deactivate.`,
        );
      }
    }

    const buildingUpdates: Partial<Building> = {
      assignments: [...drills.assignments],
    };

    this.gameStateService.updateSingleBuilding(
      BUILDINGS.DRILLS,
      buildingUpdates,
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
    metalName: MetalName,
  ) {
    const furnaces = this.gameStateSignal().player.buildings.furnaces;
    if (!furnaces || !furnaces.assignments) {
      return;
    }
    const activeAssignments = furnaces.assignments.filter(
      (assignment) =>
        assignment.job === metalName && assignment.status === STATUS.ACTIVE,
    );
    if (isFurnaceIncrement) {
      const inactiveAssignment = furnaces.assignments.find(
        (assignment) => assignment.status === STATUS.INACTIVE,
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
          `No active furnaces assigned to ${metalName} to deactivate.`,
        );
      }
    }
    const buildingUpdates: Partial<Building> = {
      assignments: [...furnaces.assignments],
    };
    this.gameStateService.updateSingleBuilding(
      BUILDINGS.FURNACES,
      buildingUpdates,
    );
  }

  /**
   * handles assigments of furnaces, player can increment or decrement drill assignment to resource
   * @todo could be generalized for every building
   * @param isIncrement if true increment, if false decrement
   * @param name resource name
   */
  public handleAssemblerAssignment(isIncrement: boolean, name: ProductName) {
    const assemblers =
      this.gameStateSignal().player.buildings[BUILDINGS.ASSEMBLERS];
    if (!assemblers || !assemblers.assignments) {
      return;
    }
    const activeAssignments = assemblers.assignments.filter(
      (assignment) =>
        assignment.job === name && assignment.status === STATUS.ACTIVE,
    );
    if (isIncrement) {
      const inactiveAssignment = assemblers.assignments.find(
        (assignment) => assignment.status === STATUS.INACTIVE,
      );
      if (inactiveAssignment) {
        inactiveAssignment.status = STATUS.ACTIVE;
        inactiveAssignment.job = name;
      } else {
        console.warn('No inactive assemblers available to assign.');
      }
    } else {
      if (activeAssignments.length > 0) {
        activeAssignments[0].status = STATUS.INACTIVE;
        activeAssignments[0].job = undefined;
      } else {
        console.warn(`No active assemblers assigned to ${name} to deactivate.`);
      }
    }
    const buildingUpdates: Partial<Building> = {
      assignments: [...assemblers.assignments],
    };
    this.gameStateService.updateSingleBuilding(
      BUILDINGS.ASSEMBLERS,
      buildingUpdates,
    );
  }
}
