import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { Location } from '@angular/common';
import { UsuariosService } from 'src/services/usuarios.service';
import { FacadeService } from 'src/services/facade.service';

@Component({
  selector: 'app-registro-screen',
  templateUrl: './registro-screen.component.html',
  styleUrls: ['./registro-screen.component.scss']
})
export class RegistroScreenComponent {
  // Para contraseñas
  public editar: boolean = false;
  public hide_1: boolean = false;
  public hide_2: boolean = false;
  public inputType_1: string = 'password';
  public inputType_2: string = 'password';
  public usuario: any = {};
  public errors: any = {};

  // Roles para el select
  public roles: any[] = [
    { value: 'Propietario', viewValue: 'Propietario' },
    { value: 'Estudiante', viewValue: 'Estudiante' }
  ];

  constructor(
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private location: Location,
    public dialog: MatDialog,
    private usuariosService: UsuariosService,
    private facadeService: FacadeService
  ) {}

  // Regresar a la página anterior
  public regresar(): void {
    this.location.back();
  }

  // Alternar visibilidad de la contraseña principal
  showPassword(): void {
    if (this.inputType_1 === 'password') {
      this.inputType_1 = 'text';
      this.hide_1 = true;
    } else {
      this.inputType_1 = 'password';
      this.hide_1 = false;
    }
  }

  // Alternar visibilidad de la contraseña de confirmación
  showPwdConfirmar(): void {
    if (this.inputType_2 === 'password') {
      this.inputType_2 = 'text';
      this.hide_2 = true;
    } else {
      this.inputType_2 = 'password';
      this.hide_2 = false;
    }
  }

  // Validar nombre o apellido
  validateTextInput(event: KeyboardEvent): void {
    const regex = /^[a-zA-ZáéíóúÁÉÍÓÚñÑ]$/;
    if (!regex.test(event.key)) {
      event.preventDefault();
    }
  }

  // Formatear número de teléfono
  formatPhoneNumber(event: Event): void {
    const input = event.target as HTMLInputElement;
    let phone = input.value.replace(/\D/g, ''); // Eliminar caracteres no numéricos

    if (phone.length > 10) {
      phone = phone.slice(0, 10); // Limitar a 10 dígitos
    }

    // Formatear como (123) 456-7890
    if (phone.length > 6) {
      input.value = `(${phone.slice(0, 3)}) ${phone.slice(3, 6)}-${phone.slice(6)}`;
    } else if (phone.length > 3) {
      input.value = `(${phone.slice(0, 3)}) ${phone.slice(3)}`;
    } else if (phone.length > 0) {
      input.value = `(${phone}`;
    }

    this.usuario.telefono = input.value;
  }

  // Validar entrada de solo números en teléfono
  validatePhoneInput(event: KeyboardEvent): void {
    const allowedKeys = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9'];
    if (!allowedKeys.includes(event.key)) {
      event.preventDefault();
    }
  }

  // Registrar usuario
  public registrar(): void {
    // Validar campos básicos
    this.errors = this.usuariosService.validarUsuario(this.usuario, false);
    if (Object.keys(this.errors).length > 0) {
      return; // Detener si hay errores
    }

    // Validar que las contraseñas coincidan
    if (this.usuario.password !== this.usuario.confirmar_password) {
      alert("Las contraseñas no coinciden.");
      this.usuario.password = '';
      this.usuario.confirmar_password = '';
      return;
    }

    // Consumir el servicio para registrar usuario
    this.usuariosService.registrarUsuario(this.usuario).subscribe(
      (response) => {
        alert("Usuario registrado correctamente.");
        console.log("Usuario registrado:", response);
        this.router.navigate(['/']);
      },
      (error) => {
        alert("No se pudo registrar el usuario.");
        console.error(error);
      }
    );
  }
}
