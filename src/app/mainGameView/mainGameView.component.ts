import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ResourcePanelComponent } from './resourcePanel/resourcePanel.component';
import { BuildingItemComponent } from './buildingsPanel/buildingItem/buildingItem.component';
import { BuildingsPanelComponent } from './buildingsPanel/buildingsPanel.component';

@Component({
  selector: 'app-main-game-view',
  standalone: true,
  imports: [
    CommonModule,
    ResourcePanelComponent,
    BuildingItemComponent,
    BuildingsPanelComponent,
  ],
  templateUrl: './mainGameView.component.html',
  styleUrl: './mainGameView.component.scss',
})
export class MainGameViewComponent {}
