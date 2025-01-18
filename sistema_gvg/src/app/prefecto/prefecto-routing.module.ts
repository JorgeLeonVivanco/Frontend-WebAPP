import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { PrefectoComponent } from './prefecto.component';
import { PrefectoDashboardComponent } from './prefecto-dashboard/prefecto-dashboard.component';

const routes: Routes = [
  { path: '', component: PrefectoDashboardComponent },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PrefectoRoutingModule { }
