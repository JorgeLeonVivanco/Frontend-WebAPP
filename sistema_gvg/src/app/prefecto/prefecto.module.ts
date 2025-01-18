import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { PrefectoRoutingModule } from './prefecto-routing.module';
import { PrefectoComponent } from './prefecto.component';
import { PrefectoDashboardComponent } from './prefecto-dashboard/prefecto-dashboard.component';


@NgModule({
  declarations: [
    PrefectoComponent,
    PrefectoDashboardComponent
  ],
  imports: [
    CommonModule,
    PrefectoRoutingModule
  ]
})
export class PrefectoModule { }
