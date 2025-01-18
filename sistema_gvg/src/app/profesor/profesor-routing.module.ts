import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ProfesorComponent } from './profesor.component';
import { ProfesorDashboardComponent } from './profesor-dashboard/profesor-dashboard.component';

const routes: Routes = [
  { path: '', component: ProfesorDashboardComponent },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ProfesorRoutingModule { }
