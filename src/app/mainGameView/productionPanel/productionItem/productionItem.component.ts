import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProductName } from 'src/app/constants/types';
import { handleAssemblerChange, Product } from 'src/app/interfaces';

@Component({
  selector: 'app-production-item',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './productionItem.component.html',
  styleUrl: './productionItem.component.scss',
})
export class ProductionItemComponent {
  @Input() public product!: Product;
  @Input() public productName!: ProductName;
  @Input() public assigned!: number;
  @Output() public increment = new EventEmitter<ProductName>();
  @Output() public handleAssemblerAssignment =
    new EventEmitter<handleAssemblerChange>();

  protected handleClick() {
    this.increment.emit(this.productName);
  }

  protected handleAssemblerChangeButton(isIncrement: boolean) {
    this.handleAssemblerAssignment.emit({
      isIncrement: isIncrement,
      name: this.productName,
    });
  }
}
