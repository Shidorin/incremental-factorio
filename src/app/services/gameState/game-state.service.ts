import { Injectable, signal, WritableSignal } from '@angular/core';
import { GameState, Resource } from '../../interfaces';
import { BuildingName, ResourceName, STATUS } from 'src/app/constants/types';
import { Building } from 'src/app/interfaces/game-state/building.interface';
import { BUILDINGS, RESOURCES } from 'src/app/constants/enums';

@Injectable({
  providedIn: 'root',
})
export class GameStateService {
  private initialGameState: GameState = {
    player: {
      resources: {
        stone: {
          name: RESOURCES.STONE,
          quantity: 5,
          productionRate: 0,
          capacity: 20,
        },
        coal: {
          name: RESOURCES.COAL,
          quantity: 5,
          productionRate: 0,
          capacity: 20,
        },
        // copper: { name: 'copper', quantity: 0, productionRate: 0 },
        // iron: { name: 'iron', quantity: 0, productionRate: 0 },
        // oil: { name: 'oil', quantity: 0, productionRate: 0 },
        // uran: { name: 'uran', quantity: 0, productionRate: 0 },
      },
      products: {
        copperPlate: 0,
        ironPlate: 0,
        steel: 0,
        copperCable: 0,
        ironGearWheel: 0,
        greenCircuit: 0,
        belt: 0,
        inserter: 0,
        redScience: 0,
        greenScience: 0,
      },
      buildings: {
        drills: {
          name: BUILDINGS.DRILLS,
          quantity: 0,
          fuelUsage: 0.5,
          cost: {
            stone: { count: 5, baseCost: 5, scalingFactor: 1.6 },
            coal: { count: 5, baseCost: 5, scalingFactor: 1.6 },
          },
          assignments: [],
        },
        furnaces: {
          name: BUILDINGS.FURNACES,
          quantity: 0,
          fuelUsage: 1,
          cost: { stone: { count: 5, baseCost: 5, scalingFactor: 1.6 } },
          assignments: [],
        },
        assemblers: {
          name: BUILDINGS.ASSEMBLERS,
          quantity: 0,
          fuelUsage: 2,
          cost: { coal: { count: 5, baseCost: 5, scalingFactor: 1.6 } },
          assignments: [],
        },
        labs: {
          name: BUILDINGS.LABS,
          quantity: 0,
          fuelUsage: 5,
          cost: { stone: { count: 5, baseCost: 5, scalingFactor: 1.6 } },
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
        perks: {
          // add more perks
        },
      },
    },
    gameSettings: {
      autoSaveInterval: 300,
      tutorialCompleted: false,
      soundOn: true,
      notificationsOn: true,
    },
    uiState: {
      currentScreen: 'main',
      popupsSeen: [],
      resourcePanelExpanded: true,
    },
    progressState: {
      unlockedItems: {
        resources: [RESOURCES.COAL, RESOURCES.STONE],
        buildings: [BUILDINGS.DRILLS],
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
   * @param resourceUpdates - An object containing the resource names and their new values.
   */
  public updateResources(
    resourceUpdates: Partial<Record<ResourceName, Partial<Resource>>>
  ): void {
    this.gameStateSignal.update((current: GameState) => {
      const updatedResources = { ...current.player.resources };

      Object.entries(resourceUpdates).forEach(([resourceName, updates]) => {
        updatedResources[resourceName as ResourceName] = {
          ...updatedResources[resourceName as ResourceName],
          ...updates,
        };
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

  public updateSingleBuilding(
    buildingName: BuildingName,
    updates: Partial<Building>
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
    buildingUpdates: Partial<Record<BuildingName, Partial<Building>>>
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
