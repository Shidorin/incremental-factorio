import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MetalItemComponent } from './metalItem.component';

describe('MetalItemComponent', () => {
  let component: MetalItemComponent;
  let fixture: ComponentFixture<MetalItemComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MetalItemComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(MetalItemComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
