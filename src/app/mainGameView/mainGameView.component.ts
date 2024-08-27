import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ResourcePanelComponent } from './resourcePanel/resourcePanel.component';

@Component({
  selector: 'app-main-game-view',
  standalone: true,
  imports: [CommonModule, ResourcePanelComponent],
  templateUrl: './mainGameView.component.html',
  styleUrl: './mainGameView.component.scss',
})
export class MainGameViewComponent {}
