import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ShomeComponent } from './shome.component';

describe('ShomeComponent', () => {
  let component: ShomeComponent;
  let fixture: ComponentFixture<ShomeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ShomeComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ShomeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
