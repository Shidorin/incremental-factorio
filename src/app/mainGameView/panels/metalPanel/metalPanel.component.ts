import { Component, effect, inject, WritableSignal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CATEGORIES } from 'src/app/constants/enums';
import { GameState, handleFurnaceChange, Metal } from 'src/app/interfaces';
import { GameProgressService } from 'src/app/services/gameProgress';
import { GameStateService, BuildingService } from 'src/app/services/gameState';
import { MetalItemComponent } from './metalItem/metalItem.component';
import { MetalName } from 'src/app/constants/types';

@Component({
  selector: 'app-metal-panel',
  standalone: true,
  imports: [CommonModule, MetalItemComponent],
  templateUrl: './metalPanel.component.html',
  styleUrl: './metalPanel.component.scss',
})
export class MetalPanelComponent {
  public gameStateService: GameStateService;
  public buildingService: BuildingService;
  public gameStateSignal: WritableSignal<GameState>;
  public metals: { key: MetalName; value: Metal }[] = [];
  public categories = CATEGORIES;

  public constructor(protected gameProgressService: GameProgressService) {
    this.gameStateService = inject(GameStateService);
    this.buildingService = inject(BuildingService);
    this.gameStateSignal = this.gameStateService.getSignal();

    effect(() => {
      this.updateMetals();
    });
  }

  furnaceAssigned(metalName: MetalName) {
    return this.gameStateSignal().player.buildings.furnaces.assignments.reduce(
      (count, { job }) => {
        return job === metalName ? count + 1 : count;
      },
      0,
    );
  }

  private updateMetals(): void {
    this.metals = Object.entries(this.gameStateSignal().player.metals).map(
      ([key, value]) => {
        return { key: key as MetalName, value };
      },
    );
  }

  public handleFurnaceAssignment(payload: handleFurnaceChange) {
    this.buildingService.handleFurnaceAssignment(
      payload.isFurnaceIncrement,
      payload.metalName,
    );
  }
}
