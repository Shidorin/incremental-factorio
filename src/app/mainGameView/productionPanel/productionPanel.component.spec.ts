import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ProductionPanelComponent } from './productionPanel.component';

describe('ProductionPanelComponent', () => {
  let component: ProductionPanelComponent;
  let fixture: ComponentFixture<ProductionPanelComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ProductionPanelComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(ProductionPanelComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
