import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { UsuariosService } from 'src/services/usuarios.service';
import { FacadeService } from 'src/services/facade.service';

@Component({
  selector: 'app-sobre-mi',
  templateUrl: './sobre-mi.component.html',
  styleUrls: ['./sobre-mi.component.scss']
})
export class SobreMiComponent implements OnInit {
  usuario = {
    id: '',
    first_name: '',
    last_name: '',
    email: '',
    password: '',
    confirmar_password: '',
    telefono: '',
    rol: '',
  };

  editMode = {
    first_name: false,
    last_name: false,
    email: false,
    password: false,
    telefono: false,
  };

  showPassword = false;
  errores: any = {};

  constructor(
    private usuariosService: UsuariosService,
    private router: Router,
    private facadeService: FacadeService,
  ) {}

  ngOnInit() {
    const userId = this.facadeService.getUserId();
    if (!userId) {
      console.error('No se encontró un usuario autenticado.');
      this.router.navigate(['/login']); // Redirige al login si no hay usuario autenticado
      return;
    }

    this.usuariosService.getUsuarioByID(parseInt(userId, 10)).subscribe(
      (data) => {
        console.log('Datos del usuario:', data);
        this.usuario = {
          id: data.id || '',
          first_name: data.first_name || data.user?.first_name || '',
          last_name: data.last_name || data.user?.last_name || '',
          email: data.email || data.user?.email || '',
          password: '',
          confirmar_password: '',
          telefono: data.telefono || '',
          rol: data.rol || '',
        };
      },
      (error) => {
        console.error('Error al cargar los datos del usuario:', error);
      }
    );
  }

  toggleEdit(field: string) {
    this.editMode[field] = !this.editMode[field];
  }

  togglePasswordVisibility() {
    this.showPassword = !this.showPassword;
  }

  saveChanges() {
    if (!this.usuario.first_name || !this.usuario.last_name || !this.usuario.email || !this.usuario.telefono) {
      alert('Por favor, complete todos los campos requeridos');
      return;
    }
  
    const erroresValidacion = this.usuariosService.validarUsuario(this.usuario, true);
    if (Object.keys(erroresValidacion).length > 0) {
      this.errores = erroresValidacion;
      console.log('Errores de validación:', this.errores);
      return;
    }
  
    this.usuariosService.editarUsuario(this.usuario).subscribe(
      response => {
        console.log('Datos actualizados con éxito', response);
        alert('Cambios guardados correctamente');
        this.resetEditMode();
        window.location.reload(); // Recarga la página después de guardar los cambios
      },
      error => {
        console.error('Error al guardar los datos', error);
        alert('Ocurrió un error al guardar los cambios.');
      }
    );
  }  

  refreshUserData() {
    this.ngOnInit(); // Llama de nuevo al ciclo de vida para recargar los datos actualizados
  }

  eliminarCuenta() {
    const confirmacion = confirm('¿Estás seguro de que deseas eliminar tu cuenta? Esta acción no se puede deshacer.');
    if (confirmacion) {
      const idUsuario = this.usuario.id;
      if (idUsuario) {
        const idNumero = Number(idUsuario);
        if (!isNaN(idNumero)) {
          this.usuariosService.eliminarUsuario(idNumero).subscribe(
            (response) => {
              alert('Cuenta eliminada con éxito');
              this.facadeService.logout(); // Limpia el estado del usuario y la sesión
              this.router.navigate(['/login']); // Redirige al login después de eliminar la cuenta
            },
            (error) => {
              console.error('Error al eliminar la cuenta:', error);
              alert('Ocurrió un error al intentar eliminar la cuenta.');
            }
          );
        } else {
          alert('El ID del usuario no es válido.');
        }
      } else {
        alert('No se pudo obtener el ID del usuario.');
      }
    }
  }

  resetEditMode() {
    this.editMode = {
      first_name: false,
      last_name: false,
      email: false,
      password: false,
      telefono: false
    };
  }

  cancel() {
    this.router.navigate(['/home']);
  }
}
