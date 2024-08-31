import { Component, inject, WritableSignal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ResourceItemComponent } from './resourceItem/resourceItem.component';
import { GameState, ResourceName } from 'src/app/interfaces/';
import { GameStateService, ResourceService } from 'src/app/services/gameState';

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
  public signal: WritableSignal<GameState>;

  public constructor() {
    this.gameStateService = inject(GameStateService);
    this.resourceService = inject(ResourceService);
    this.signal = this.gameStateService.getSignal();
  }

  handleChange(resourceName: ResourceName) {
    this.resourceService.incrementResource(resourceName);
  }
}
