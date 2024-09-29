import { ComponentFixture, TestBed } from '@angular/core/testing';
import { OreItemComponent } from './oreItem.component';

describe('ResourceItemComponent', () => {
  let component: OreItemComponent;
  let fixture: ComponentFixture<OreItemComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [OreItemComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(OreItemComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
