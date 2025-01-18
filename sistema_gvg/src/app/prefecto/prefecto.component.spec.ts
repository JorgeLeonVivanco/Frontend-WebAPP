import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PrefectoComponent } from './prefecto.component';

describe('PrefectoComponent', () => {
  let component: PrefectoComponent;
  let fixture: ComponentFixture<PrefectoComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [PrefectoComponent]
    });
    fixture = TestBed.createComponent(PrefectoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
