import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DetallePropiedadScreenComponent } from './detalle-propiedad-screen.component';

describe('DetallePropiedadScreenComponent', () => {
  let component: DetallePropiedadScreenComponent;
  let fixture: ComponentFixture<DetallePropiedadScreenComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [DetallePropiedadScreenComponent]
    });
    fixture = TestBed.createComponent(DetallePropiedadScreenComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
