import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AuthHandlingComponent } from './auth-handling.component';

describe('AuthHandlingComponent', () => {
  let component: AuthHandlingComponent;
  let fixture: ComponentFixture<AuthHandlingComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [AuthHandlingComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(AuthHandlingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
