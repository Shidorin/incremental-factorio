import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ProductionItemComponent } from './productionItem.component';

describe('ProductionItemComponent', () => {
  let component: ProductionItemComponent;
  let fixture: ComponentFixture<ProductionItemComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ProductionItemComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(ProductionItemComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
