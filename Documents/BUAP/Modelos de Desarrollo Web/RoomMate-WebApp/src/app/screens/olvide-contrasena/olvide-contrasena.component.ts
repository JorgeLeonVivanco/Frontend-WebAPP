import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-olvide-contrasena',
  templateUrl: './olvide-contrasena.component.html',
  styleUrls: ['./olvide-contrasena.component.scss'],
})
export class OlvideContrasenaComponent {
  email: string = '';
  errorEmail: string | null = null;

  constructor(private router: Router) {}

  regresar() {
    this.router.navigate(['/login']);
  }

  enviarCorreo() {
    if (!this.email) {
      this.errorEmail = 'El correo es obligatorio.';
      return;
    }

    console.log('Correo enviado a:', this.email);
    // Lógica para enviar el correo desde el backend
    alert('Se ha enviado un enlace para restablecer tu contraseña.');
    this.router.navigate(['/login']);
  }


}
