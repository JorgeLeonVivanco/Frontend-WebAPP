import { Component, OnInit } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
})
export class HeaderComponent implements OnInit {
  isLoginPage: boolean = false; // Detecta si estamos en la página de login
  userLoginOn: boolean = false; // Detecta si el usuario está autenticado

  constructor(private router: Router) {}

  ngOnInit(): void {
    // Suscribirse a los cambios de ruta
    this.router.events.subscribe((event) => {
      if (event instanceof NavigationEnd) {
        const currentUrl = event.url;
        // Detecta si estamos en la página de login
        this.isLoginPage = currentUrl === '/auth/login';
        // Verifica si el usuario está autenticado y no está en la página de login
        this.userLoginOn = !!localStorage.getItem('token') && !this.isLoginPage;
      }
    });
  }

  goBack(): void {
    this.router.navigate(['../']);
  }

  goHome(): void {
    this.router.navigate(['/inicio']);
  }

  logout(): void {
    const token = localStorage.getItem('token');
  
    if (token) {
      console.log('Token eliminado:', token); // Log en la consola del navegador
      localStorage.removeItem('token'); // Eliminar el token del almacenamiento local
    } else {
      console.log('No había token en el almacenamiento local.');
    }
  
    this.router.navigate(['/auth/login']); // Redirigir al login
  }
  
  
}
