import { Component, inject, WritableSignal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ResourceItemComponent } from './resourceItem/resourceItem.component';
import { GameStateService } from 'src/app/services/game-state.service';
import { GameState, ResourceName } from 'src/app/interfaces/';

@Component({
  selector: 'app-resource-panel',
  standalone: true,
  imports: [CommonModule, ResourceItemComponent],
  templateUrl: './resourcePanel.component.html',
  styleUrl: './resourcePanel.component.scss',
})
export class ResourcePanelComponent {
  public gameStateService: GameStateService;
  public signal: WritableSignal<GameState>;

  public constructor() {
    this.gameStateService = inject(GameStateService);
    this.signal = this.gameStateService.getSignal();
  }

  handleChange(resourceName: ResourceName) {
    this.gameStateService.updateResource(resourceName);
  }
}
