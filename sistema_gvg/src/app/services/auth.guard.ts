import { Injectable } from '@angular/core';
import { CanActivate, Router, UrlTree } from '@angular/router';

@Injectable({
  providedIn: 'root',
})
export class AuthGuard implements CanActivate {
  constructor(private router: Router) {}

  canActivate(): boolean | UrlTree {
    const token = localStorage.getItem('token'); // Verificar si existe el token
    if (token) {
      return true; // Permite el acceso si el usuario está autenticado
    }
    // Redirigir al login si no hay token
    return this.router.parseUrl('/auth/login');
  }
}
