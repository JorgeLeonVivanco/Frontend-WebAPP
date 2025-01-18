import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AlumnoComponent } from './alumno.component';
import { AlumnoDashboardComponent } from './alumno-dashboard/alumno-dashboard.component';

const routes: Routes = [
  { path: '', component: AlumnoDashboardComponent },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AlumnoRoutingModule { }
