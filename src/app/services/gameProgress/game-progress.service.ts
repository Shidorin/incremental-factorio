import { Injectable, WritableSignal } from '@angular/core';
import { GameStateService } from '../gameState';
import { GameState, ProgressState } from 'src/app/interfaces';
import {
  BUILDINGS,
  CATEGORIES,
  METALS,
  PRODUCTS,
  RESOURCES,
} from 'src/app/constants/enums';

@Injectable({
  providedIn: 'root',
})
export class GameProgressService {
  private gameState: WritableSignal<GameState>;

  constructor(private gameStateService: GameStateService) {
    this.gameState = this.gameStateService.getSignal();
  }

  /**
   * Checks if an item is unlocked in a specific category.
   * @param category - The category of the item.
   * @param itemName - The name of the item.
   * @returns True if the item is unlocked, false otherwise.
   */
  public isItemUnlocked<T extends keyof ProgressState['unlockedItems']>(
    category: T,
    itemName: ProgressState['unlockedItems'][T][number]
  ): boolean {
    const items = this.gameState().progressState.unlockedItems[category];
    return (items as Array<typeof itemName>).includes(itemName);
  }

  /**
   * Unlocks item in a specific category.
   * @param category - The category of the item.
   * @param itemName - The name of the item.
   */
  public unlockItem<T extends keyof ProgressState['unlockedItems']>(
    category: T,
    itemName: ProgressState['unlockedItems'][T][number]
  ): void {
    const items = this.gameState().progressState.unlockedItems[category];
    if (Array.isArray(items)) {
      (items as Array<typeof itemName>).push(itemName);
    }
  }

  /**
   * Progress loop for unlocking new things.
   */
  public updateProgress(): void {
    //UNLOCK FURNACE
    if (
      !this.isItemUnlocked(CATEGORIES.BUILDINGS, BUILDINGS.FURNACES) &&
      this.gameState().player.buildings.drills.quantity > 0
    ) {
      this.unlockItem(CATEGORIES.BUILDINGS, BUILDINGS.FURNACES);
    }
    // UNLOCK COPPER AND IRON
    if (
      !this.isItemUnlocked(CATEGORIES.RESOURCES, RESOURCES.COPPER) &&
      this.gameState().player.buildings.furnaces.quantity > 0
    ) {
      this.unlockItem(CATEGORIES.RESOURCES, RESOURCES.COPPER);
      this.unlockItem(CATEGORIES.RESOURCES, RESOURCES.IRON);
    }

    // UNLOCK METALS
    if (
      !this.isItemUnlocked(CATEGORIES.METALS, METALS.COPPER_PLATE) &&
      this.gameState().player.resources.copper.quantity > 0 &&
      this.gameState().player.resources.iron.quantity > 0
    ) {
      this.unlockItem(CATEGORIES.METALS, METALS.COPPER_PLATE);
      this.unlockItem(CATEGORIES.METALS, METALS.IRON_PLATE);
    }

    // UNLOCK ASSEMBLERS
    if (
      !this.isItemUnlocked(CATEGORIES.BUILDINGS, BUILDINGS.ASSEMBLERS) &&
      this.gameState().player.metals.copperPlate.quantity > 4 &&
      this.gameState().player.metals.ironPlate.quantity > 4
    ) {
      this.unlockItem(CATEGORIES.BUILDINGS, BUILDINGS.ASSEMBLERS);
    }

    // UNLOCK PRODUCTS
    if (
      !this.isItemUnlocked(CATEGORIES.PRODUCTS, PRODUCTS.COPPER_CABLE) &&
      !this.isItemUnlocked(CATEGORIES.PRODUCTS, PRODUCTS.GREEN_CIRCUIT) &&
      this.gameState().player.buildings.assemblers.quantity > 1
    ) {
      this.unlockItem(CATEGORIES.PRODUCTS, PRODUCTS.COPPER_CABLE);
      this.unlockItem(CATEGORIES.PRODUCTS, PRODUCTS.GREEN_CIRCUIT);
    }

    // UNLOCK RED SCIENCE
    if (
      !this.isItemUnlocked(CATEGORIES.PRODUCTS, PRODUCTS.RED_SCIENCE) &&
      this.gameState().player.products.greenCircuit.quantity > 1
    ) {
      this.unlockItem(CATEGORIES.PRODUCTS, PRODUCTS.RED_SCIENCE);
    }

    // UNLOCK LABS
    if (
      !this.isItemUnlocked(CATEGORIES.BUILDINGS, BUILDINGS.LABS) &&
      this.gameState().player.products.redScience.quantity > 0
    ) {
      this.unlockItem(CATEGORIES.BUILDINGS, BUILDINGS.LABS);
    }
  }
}
