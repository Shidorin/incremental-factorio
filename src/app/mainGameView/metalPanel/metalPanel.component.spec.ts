import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MetalPanelComponent } from './metalPanel.component';

describe('MetalPanelComponent', () => {
  let component: MetalPanelComponent;
  let fixture: ComponentFixture<MetalPanelComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MetalPanelComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(MetalPanelComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
