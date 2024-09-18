import { Component, effect, inject, WritableSignal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProductName } from 'src/app/constants/types';
import { GameState, handleAssemblerChange, Product } from 'src/app/interfaces';
import { BUILDINGS, CATEGORIES } from 'src/app/constants/enums';
import { GameProgressService } from 'src/app/services/gameProgress';
import { GameStateService, BuildingService } from 'src/app/services/gameState';
import { ProductionItemComponent } from './productionItem/productionItem.component';

@Component({
  selector: 'app-production-panel',
  standalone: true,
  imports: [CommonModule, ProductionItemComponent],
  templateUrl: './productionPanel.component.html',
  styleUrl: './productionPanel.component.scss',
})
export class ProductionPanelComponent {
  public gameStateService: GameStateService;
  public buildingService: BuildingService;
  public gameStateSignal: WritableSignal<GameState>;
  public products: { key: ProductName; value: Product }[] = [];
  public categories = CATEGORIES;

  public constructor(protected gameProgressService: GameProgressService) {
    this.gameStateService = inject(GameStateService);
    this.buildingService = inject(BuildingService);
    this.gameStateSignal = this.gameStateService.getSignal();

    effect(() => {
      this.updateProducts();
    });
  }

  assemblerAssigned(productName: ProductName) {
    return this.gameStateSignal().player.buildings[
      BUILDINGS.ASSEMBLERS
    ].assignments.reduce((count, { job }) => {
      return job === productName ? count + 1 : count;
    }, 0);
  }

  private updateProducts(): void {
    this.products = Object.entries(this.gameStateSignal().player.products).map(
      ([key, value]) => {
        return { key: key as ProductName, value };
      },
    );
  }

  public handleAssemblerAssignment(payload: handleAssemblerChange) {
    this.buildingService.handleAssemblerAssignment(
      payload.isIncrement,
      payload.name,
    );
  }
}
