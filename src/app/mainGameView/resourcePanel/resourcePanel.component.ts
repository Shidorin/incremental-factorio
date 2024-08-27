import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ResourceItemComponent } from "./resourceItem/resourceItem.component";

@Component({
  selector: 'app-resource-panel',
  standalone: true,
  imports: [CommonModule, ResourceItemComponent],
  templateUrl: './resourcePanel.component.html',
  styleUrl: './resourcePanel.component.scss',
})
export class ResourcePanelComponent {
  

  public constructor() {}
}
