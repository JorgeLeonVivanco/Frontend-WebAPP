import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PrefectoDashboardComponent } from './prefecto-dashboard.component';

describe('PrefectoDashboardComponent', () => {
  let component: PrefectoDashboardComponent;
  let fixture: ComponentFixture<PrefectoDashboardComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [PrefectoDashboardComponent]
    });
    fixture = TestBed.createComponent(PrefectoDashboardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
