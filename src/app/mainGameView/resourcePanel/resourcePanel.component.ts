import { Component, inject, WritableSignal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ResourceItemComponent } from './resourceItem/resourceItem.component';
import { GameState, handleDrillChange } from 'src/app/interfaces/';
import {
  BuildingService,
  GameStateService,
  ResourceService,
} from 'src/app/services/gameState';
import { ResourceName } from 'src/app/enums';

@Component({
  selector: 'app-resource-panel',
  standalone: true,
  imports: [CommonModule, ResourceItemComponent],
  templateUrl: './resourcePanel.component.html',
  styleUrl: './resourcePanel.component.scss',
})
export class ResourcePanelComponent {
  public gameStateService: GameStateService;
  public resourceService: ResourceService;
  public buildingService: BuildingService;
  public signal: WritableSignal<GameState>;

  public constructor() {
    this.gameStateService = inject(GameStateService);
    this.resourceService = inject(ResourceService);
    this.buildingService = inject(BuildingService);
    this.signal = this.gameStateService.getSignal();
  }

  public handleChange(resourceName: ResourceName) {
    this.resourceService.incrementResource(resourceName);
  }

  public handleDrillAssignment(payload: handleDrillChange) {
    this.buildingService.handleDrillAssignment(
      payload.isDrillIncrement,
      payload.resourceName
    );
  }
}
