import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent {
  loginForm: FormGroup;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router
  ) {
    this.loginForm = this.fb.group({
      matricula: ['', [Validators.required]],
      password: ['', [Validators.required]],
    });
  }

  // Getter para el control "matricula"
  get matricula() {
    return this.loginForm?.get('matricula');
  }

  // Getter para el control "password"
  get password() {
    return this.loginForm?.get('password');
  }

  login(): void {
    if (this.loginForm.valid) {
      const { matricula, password } = this.loginForm.value;
  
      this.authService.login({ matricula, password }).subscribe(
        (response) => {
          console.log('Inicio de sesión exitoso:', response);
  
          localStorage.setItem('token', response.token);
          localStorage.setItem('role', response.user.role);
  
          const role = response.user.role;
  
          // Redirigir al dashboard correspondiente
          switch (role) {
            case 'Administrador':
              this.router.navigate(['/admin/dashboard']);
              break;
            case 'profesor':
              this.router.navigate(['/profesor/dashboard']);
              break;
            case 'alumno':
              this.router.navigate(['/alumno/dashboard']);
              break;
            case 'prefecto':
              this.router.navigate(['/prefecto/dashboard']);
              break;
            default:
              alert('Rol desconocido.');
          }
        },
        (error) => {
          console.error('Error al iniciar sesión:', error);
          alert('Credenciales inválidas.');
        }
      );
    } else {
      alert('Por favor, completa todos los campos correctamente.');
    }
  }  
}
