import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ProfesorRoutingModule } from './profesor-routing.module';
import { ProfesorComponent } from './profesor.component';
import { ProfesorDashboardComponent } from './profesor-dashboard/profesor-dashboard.component';


@NgModule({
  declarations: [
    ProfesorComponent,
    ProfesorDashboardComponent
  ],
  imports: [
    CommonModule,
    ProfesorRoutingModule
  ]
})
export class ProfesorModule { }
