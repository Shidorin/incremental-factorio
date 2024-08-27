import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ScienceTreeComponent } from './scienceTree.component';

describe('ScienceTreeComponent', () => {
  let component: ScienceTreeComponent;
  let fixture: ComponentFixture<ScienceTreeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ScienceTreeComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(ScienceTreeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
