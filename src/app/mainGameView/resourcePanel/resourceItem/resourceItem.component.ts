import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Resource, ResourceName } from 'src/app/interfaces';

@Component({
  selector: 'app-resource-item',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './resourceItem.component.html',
  styleUrl: './resourceItem.component.scss',
})
export class ResourceItemComponent {
  @Input() public resource!: Resource;
  @Input() public resourceName!: ResourceName;
  @Output() public increment = new EventEmitter<ResourceName>();

  protected handleClick() {
    this.increment.emit(this.resourceName);
  }
}
