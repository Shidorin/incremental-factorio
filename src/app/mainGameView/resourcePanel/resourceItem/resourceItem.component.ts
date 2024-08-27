import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-resource-item',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './resourceItem.component.html',
  styleUrl: './resourceItem.component.scss',
})
export class ResourceItemComponent {
  @Input() public name!: string;
  @Input() public quantity!: number;
  @Input() public productionRate!: number;
}
