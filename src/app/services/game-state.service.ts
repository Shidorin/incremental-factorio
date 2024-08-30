import { Injectable, signal } from '@angular/core';
import { GameState, ResourceName } from '../interfaces';

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
        drills: 0,
        furnaces: 0,
        assemblers: 0,
        labs: 0,
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

  public updateResource(name: ResourceName) {
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
}
