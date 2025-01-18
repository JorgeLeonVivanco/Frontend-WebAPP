import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AlumnoDashboardComponent } from './alumno-dashboard.component';

describe('AlumnoDashboardComponent', () => {
  let component: AlumnoDashboardComponent;
  let fixture: ComponentFixture<AlumnoDashboardComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [AlumnoDashboardComponent]
    });
    fixture = TestBed.createComponent(AlumnoDashboardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
