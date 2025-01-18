import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AlumnoRoutingModule } from './alumno-routing.module';
import { AlumnoComponent } from './alumno.component';
import { AlumnoDashboardComponent } from './alumno-dashboard/alumno-dashboard.component';


@NgModule({
  declarations: [
    AlumnoComponent,
    AlumnoDashboardComponent
  ],
  imports: [
    CommonModule,
    AlumnoRoutingModule
  ]
})
export class AlumnoModule { }
