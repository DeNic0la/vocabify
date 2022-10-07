import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StorifyExploreComponent } from './storify-explore.component';

describe('StorifyExploreComponent', () => {
  let component: StorifyExploreComponent;
  let fixture: ComponentFixture<StorifyExploreComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ StorifyExploreComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(StorifyExploreComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
