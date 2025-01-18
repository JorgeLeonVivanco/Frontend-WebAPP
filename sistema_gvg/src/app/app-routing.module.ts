import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuard } from './services/auth.guard'; // Importa el guard

const routes: Routes = [
  { path: 'auth', loadChildren: () => import('./auth/auth.module').then(m => m.AuthModule) },
  { path: 'admin/dashboard', loadChildren: () => import('./admin/admin.module').then(m => m.AdminModule) , canActivate: [AuthGuard]},
  { path: 'profesor/dashboard', loadChildren: () => import('./profesor/profesor.module').then(m => m.ProfesorModule), canActivate: [AuthGuard]},
  { path: 'alumno/dashboard', loadChildren: () => import('./alumno/alumno.module').then(m => m.AlumnoModule) , canActivate: [AuthGuard]},
  { path: 'prefecto/dashboard', loadChildren: () => import('./prefecto/prefecto.module').then(m => m.PrefectoModule) , canActivate: [AuthGuard]},
  { path: '**', redirectTo: 'auth' },// Ruta por defecto
  { path: '', redirectTo: 'auth/login', pathMatch: 'full' }, // Redirección principal a login
];


@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
