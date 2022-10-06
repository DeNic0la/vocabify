import { ComponentFixture, TestBed } from '@angular/core/testing';
import { StorifyComponent } from './storify.component';

describe('StorifyComponent', () => {
  let component: StorifyComponent;
  let fixture: ComponentFixture<StorifyComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [StorifyComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(StorifyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
