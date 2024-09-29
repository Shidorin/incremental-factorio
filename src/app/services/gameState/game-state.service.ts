import { Injectable, signal, WritableSignal } from '@angular/core';
import { GameState, Metal, Product, Ore } from '../../interfaces';
import {
  BuildingName,
  MetalName,
  ProductName,
  OreName,
} from 'src/app/constants/types';
import { Building } from 'src/app/interfaces/game-state/building.interface';
import {
  BUILDINGS,
  METALS,
  PANELS,
  PRODUCTS,
  ORES,
} from 'src/app/constants/enums';

@Injectable({
  providedIn: 'root',
})
export class GameStateService {
  private initialGameState: GameState = {
    player: {
      ores: {
        stone: {
          name: ORES.STONE,
          quantity: 15,
          productionRate: 0,
          capacity: 20,
        },
        coal: {
          name: ORES.COAL,
          quantity: 15,
          productionRate: 0,
          capacity: 20,
        },
        copper: {
          name: ORES.COPPER,
          quantity: 10,
          productionRate: 0,
          capacity: 10,
        },
        iron: {
          name: ORES.IRON,
          quantity: 10,
          productionRate: 0,
          capacity: 10,
        },
      },
      metals: {
        copperPlate: {
          quantity: 5,
          productionRate: 0,
          producedAmount: 1,
          recipe: [{ name: ORES.COPPER, count: 1 }],
        },
        ironPlate: {
          quantity: 5,
          productionRate: 0,
          producedAmount: 1,
          recipe: [{ name: ORES.IRON, count: 1 }],
        },
        steel: {
          quantity: 0,
          productionRate: 0,
          producedAmount: 1,
          recipe: [{ name: ORES.IRON, count: 2 }],
        },
      },
      products: {
        copperCable: {
          quantity: 0,
          productionRate: 0,
          producedAmount: 2,
          recipe: [{ name: METALS.COPPER_PLATE, count: 1 }],
        },
        ironGearWheel: {
          quantity: 0,
          productionRate: 0,
          producedAmount: 1,
          recipe: [{ name: METALS.IRON_PLATE, count: 2 }],
        },
        greenCircuit: {
          quantity: 0,
          productionRate: 0,
          producedAmount: 1,
          recipe: [
            { name: PRODUCTS.COPPER_CABLE, count: 3 },
            { name: METALS.IRON_PLATE, count: 1 },
          ],
        },
        redScience: {
          quantity: 0,
          productionRate: 0,
          producedAmount: 1,
          recipe: [
            { name: METALS.COPPER_PLATE, count: 1 },
            { name: PRODUCTS.IRON_GEAR_WHEEL, count: 1 },
          ],
        },
      },
      buildings: {
        drills: {
          name: BUILDINGS.DRILLS,
          quantity: 0,
          fuelUsage: 0,
          cost: {
            [ORES.STONE]: { count: 5, baseCost: 5, scalingFactor: 1.6 },
            [ORES.COAL]: { count: 5, baseCost: 5, scalingFactor: 1.6 },
          },
          assignments: [],
        },
        furnaces: {
          name: BUILDINGS.FURNACES,
          quantity: 0,
          fuelUsage: 0,
          cost: {
            [ORES.STONE]: { count: 5, baseCost: 5, scalingFactor: 1.6 },
          },
          assignments: [],
        },
        assemblers: {
          name: BUILDINGS.ASSEMBLERS,
          quantity: 0,
          fuelUsage: 0,
          cost: {
            [METALS.COPPER_PLATE]: {
              count: 5,
              baseCost: 5,
              scalingFactor: 1.6,
            },
            [METALS.IRON_PLATE]: {
              count: 5,
              baseCost: 5,
              scalingFactor: 1.6,
            },
          },
          assignments: [],
        },
        labs: {
          name: BUILDINGS.LABS,
          quantity: 0,
          fuelUsage: 0,
          cost: {
            [PRODUCTS.GREEN_CIRCUIT]: {
              count: 5,
              baseCost: 5,
              scalingFactor: 1.6,
            },
            [PRODUCTS.IRON_GEAR_WHEEL]: {
              count: 5,
              baseCost: 5,
              scalingFactor: 1.6,
            },
          },
          assignments: [],
        },
      },
      upgrades: {
        storageCapacity: {
          stoneCapacity: 10,
          ironCapacity: 10,
          copperCapacity: 10,
        },
      },
      progression: {
        redSciencePoints: 0,
        currentTier: 'red',
        restartCount: 0,
        perks: {},
      },
    },
    gameSettings: {
      autoSaveInterval: 300,
      tutorialCompleted: false,
      soundOn: true,
      notificationsOn: true,
    },
    uiState: {
      currentPanel: PANELS.MAIN,
      popupsSeen: [],
      resourcePanelExpanded: true,
    },
    progressState: {
      unlockedItems: {
        ores: [ORES.COAL, ORES.STONE],
        buildings: [BUILDINGS.DRILLS],
        metals: [],
        products: [],
        features: [],
      },
    },
  };

  private gameStateSignal = signal(this.initialGameState);

  /**
   * returns game state signal
   */
  public getSignal(): WritableSignal<GameState> {
    return this.gameStateSignal;
  }

  /**
   * Update specific resources in the game state.
   * @param oreUpdates - An object containing the resource names and their new values.
   */
  public updateOres(
    oreUpdates: Partial<Record<OreName, Partial<Ore>>>,
  ): void {
    this.gameStateSignal.update((current: GameState) => {
      const updatedOres = { ...current.player.ores };

      Object.entries(oreUpdates).forEach(([oreName, updates]) => {
        updatedOres[oreName as OreName] = {
          ...updatedOres[oreName as OreName],
          ...updates,
        };
      });

      return {
        ...current,
        player: {
          ...current.player,
          ores: updatedOres,
        },
      };
    });
  }

  /**
   * Update specific metals in the game state.
   * @param metalUpdates - An object containing the resource names and their new values.
   */
  public updateMetals(
    metalUpdates: Partial<Record<MetalName, Partial<Metal>>>,
  ): void {
    this.gameStateSignal.update((current: GameState) => {
      const updatedMetals = { ...current.player.metals };

      Object.entries(metalUpdates).forEach(([metalName, updates]) => {
        updatedMetals[metalName as MetalName] = {
          ...updatedMetals[metalName as MetalName],
          ...updates,
        };
      });

      return {
        ...current,
        player: {
          ...current.player,
          metals: updatedMetals,
        },
      };
    });
  }

  /**
   * Update specific metals in the game state.
   * @param productUpdates - An object containing the resource names and their new values.
   */
  public updateProducts(
    productUpdates: Partial<Record<ProductName, Partial<Product>>>,
  ): void {
    this.gameStateSignal.update((current: GameState) => {
      const updatedProducts = { ...current.player.products };

      Object.entries(productUpdates).forEach(([productName, updates]) => {
        updatedProducts[productName as ProductName] = {
          ...updatedProducts[productName as ProductName],
          ...updates,
        };
      });

      return {
        ...current,
        player: {
          ...current.player,
          products: updatedProducts,
        },
      };
    });
  }

  public updateSingleBuilding(
    buildingName: BuildingName,
    updates: Partial<Building>,
  ): void {
    this.gameStateSignal.update((current: GameState) => ({
      ...current,
      player: {
        ...current.player,
        buildings: {
          ...current.player.buildings,
          [buildingName]: {
            ...current.player.buildings[buildingName],
            ...updates,
          },
        },
      },
    }));
  }

  public updateBuildings(
    buildingUpdates: Partial<Record<BuildingName, Partial<Building>>>,
  ): void {
    this.gameStateSignal.update((current: GameState) => {
      const updatedBuildings = { ...current.player.buildings };

      Object.entries(buildingUpdates).forEach(([buildingName, updates]) => {
        updatedBuildings[buildingName as BuildingName] = {
          ...updatedBuildings[buildingName as BuildingName],
          ...updates,
        };
      });

      return {
        ...current,
        player: {
          ...current.player,
          buildings: updatedBuildings,
        },
      };
    });
  }
}
