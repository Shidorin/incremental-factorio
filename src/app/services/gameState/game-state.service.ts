import { Injectable, signal, WritableSignal } from '@angular/core';
import { GameState } from '../../interfaces';

@Injectable({
  providedIn: 'root',
})
export class GameStateService {
  private initialGameState: GameState = {
    player: {
      resources: {
        stone: { name: 'stone', quantity: 0, productionRate: 0, capacity: 10 },
        coal: { name: 'coal', quantity: 0, productionRate: 0, capacity: 10 },
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
        drills: { name: 'drills', quantity: 0, cost: 5 },
        furnaces: { name: 'furnaces', quantity: 0, cost: 5 },
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

  public getSignal(): WritableSignal<GameState> {
    return this.gameStateSignal;
  }
}
