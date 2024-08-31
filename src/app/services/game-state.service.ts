import { effect, Injectable, signal } from '@angular/core';
import { BuildingName, GameState, ResourceName } from '../interfaces';

@Injectable({
  providedIn: 'root',
})
export class GameStateService {
  private initialGameState: GameState = {
    player: {
      resources: {
        stone: { name: 'stone', quantity: 0, productionRate: 0 },
        coal: { name: 'coal', quantity: 0, productionRate: 0 },
        copper: { name: 'copper', quantity: 0, productionRate: 0 },
        iron: { name: 'iron', quantity: 0, productionRate: 0 },
        oil: { name: 'oil', quantity: 0, productionRate: 0 },
        uran: { name: 'uran', quantity: 0, productionRate: 0 },
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
        drills: { name: 'drills', quantity: 0, cost: 10 },
        furnaces: { name: 'furnaces', quantity: 0, cost: 0 },
        assemblers: { name: 'assemblers', quantity: 0, cost: 0 },
        labs: { name: 'labs', quantity: 0, cost: 0 },
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
          // Add more perks
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
      currentScreen: 'main', // Tracks which screen the player is on (main, settings, science tree, etc.)
      popupsSeen: [], // Array of seen tutorial popups
      resourcePanelExpanded: true, // UI state for toggling resource panel
    },
  };

  private gameStateSignal = signal(this.initialGameState);

  public getSignal() {
    return this.gameStateSignal;
  }

  public incrementResource(name: ResourceName) {
    this.gameStateSignal.update((current: GameState) => ({
      ...current,
      player: {
        ...current.player,
        resources: {
          ...current.player.resources,
          [name]: {
            ...current.player.resources[name],
            quantity: current.player.resources[name].quantity + 1,
          },
        },
      },
    }));
  }

  private calculateDrillCost(currentDrillCount: number): number {
    return Math.ceil(10 * Math.pow(1.2, currentDrillCount));
  }

  private canBuildDrill() {
    const requiredStone = this.gameStateSignal().player.buildings.drills.cost;
    return (
      this.gameStateSignal().player.resources.stone.quantity >= requiredStone
    );
  }

  private updateBuildingAndResources(
    buildingName: BuildingName,
    requiredStone: number,
    incrementBuildingFn: (current: GameState) => number
  ) {
    let newCost = this.calculateDrillCost(
      this.gameStateSignal().player.buildings.drills.quantity + 1
    );
    this.gameStateSignal.update((current: GameState) => ({
      ...current,
      player: {
        ...current.player,
        resources: {
          ...current.player.resources,
          stone: {
            ...current.player.resources.stone,
            quantity: current.player.resources.stone.quantity - requiredStone,
          },
        },
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

  public incrementBuilding(name: BuildingName) {
    let canBuild = false;

    switch (name) {
      case 'drills':
        canBuild = this.canBuildDrill();
        if (canBuild) {
          this.updateBuildingAndResources(
            name,
            this.calculateDrillCost(
              this.gameStateSignal().player.buildings.drills.quantity
            ),
            (current) => current.player.buildings.drills.quantity + 1
          );
        }
        break;

      default:
        break;
    }
  }
}
