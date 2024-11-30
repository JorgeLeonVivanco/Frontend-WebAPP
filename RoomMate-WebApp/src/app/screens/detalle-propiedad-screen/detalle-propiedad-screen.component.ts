import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { PropiedadService } from 'src/services/propiedad.service';
import { FacadeService } from 'src/services/facade.service';

@Component({
  selector: 'app-detalle-propiedad-screen',
  templateUrl: './detalle-propiedad-screen.component.html',
  styleUrls: ['./detalle-propiedad-screen.component.scss'],
})
export class DetallePropiedadScreenComponent implements OnInit {
  comentarioEditando: any = null;  // Comentario que está siendo editado
  nombreUsuario: string = 'UsuarioEjemplo';  // Nombre del usuario actual

  public propiedadSeleccionada: any = {
    direccion: '',
    estado: '',
    imagenes: [],
    servicios: [],
    calificacion: null,
    comentarios: [],
    mapaUrl: '',
  };

  public rol: string = '';
  public comentarioEditado: any = {
    idComentario: null,
    texto: '',



  };

  constructor(
    private route: ActivatedRoute,
    private propiedadService: PropiedadService,
    private sanitizer: DomSanitizer,
    private facadeService: FacadeService
  ) {}

  ngOnInit(): void {
    this.nombreUsuario = this.facadeService.getUserCompleteName(); // Obtener el nombre del usuario actual
    this.rol = this.facadeService.getUserGroup();
    console.log('Tipo: ', this.rol);
    const idPropiedad = this.route.snapshot.paramMap.get('id');
    this.obtenerDetallePropiedad(Number(idPropiedad));
  }

  obtenerDetallePropiedad(id: number): void {
    this.propiedadService.getPropiedadByID(id).subscribe(
      (response) => {
        const serviciosJson = response.servicios_json;

        this.propiedadSeleccionada = {
          ...response,
          servicios: serviciosJson
            ? JSON.parse(serviciosJson.replace(/\\"/g, '"'))
            : [],
          comentarios: response.comentarios || [],
          imagenes: response.imagenes || [],
          propietario: response.propietario || {
            nombre: 'Sin información',
            correo: 'No especificado',
            telefono: 'No especificado',
          },
        };

        console.log('Propiedad cargada:', this.propiedadSeleccionada);
      },
      (error) => {
        console.error('Error al cargar la propiedad seleccionada:', error);
        alert('No se pudo cargar la propiedad seleccionada.');
      }
    );
  }

  public nuevoComentario: any = {
    usuario: '',
    fecha: new Date().toISOString(),
    texto: '',
  };

  // Método para agregar un comentario
  agregarComentario(): void {
    if (this.nuevoComentario.texto.trim()) {
      this.propiedadService.agregarComentario(this.propiedadSeleccionada.id, this.nuevoComentario).subscribe(
        (response) => {
          this.propiedadSeleccionada.comentarios.push(response);
          this.nuevoComentario.texto = ''; // Limpiar el campo de comentario
          window.location.reload();
        },
        (error) => {
          console.error('Error al agregar el comentario:', error);
          alert('No se pudo agregar el comentario. Intenta nuevamente.');
        }
      );
    }
  }

  // Método para editar un comentario
  // Método para editar comentario
 // onEditarComentario(comentario: any): void {
  //   const idPropiedad = this.propiedadSeleccionada.id;  // Obtener ID de la propiedad
 //    this.propiedadService.editarComentario(idPropiedad, comentario).subscribe(
  //     (response) => {
  //       console.log('Comentario editado correctamente:', response);
   //      // Aquí puedes actualizar la lista de comentarios o hacer lo que necesites después de editar el comentario
   //    },
    //   (error) => {
    //     console.error('Error al editar el comentario:', error);
     //    alert('No se pudo editar el comentario. Intenta nuevamente.');
  //     }
  //   );
  // }

  // Método para activar la edición de un comentario
  onEditarComentario(comentario: any) {
    this.comentarioEditando = { ...comentario };  // Hacemos una copia del comentario para editar
  }

  // Método para guardar el comentario editado
  guardarComentario() {
    if (this.comentarioEditando) {
      // Aquí envías el comentario actualizado al backend usando tu API
      this.propiedadService.editarComentario(this.propiedadSeleccionada.id, this.comentarioEditando).subscribe(
        (response) => {
          // Actualiza el comentario en el frontend después de que la edición sea exitosa
          const index = this.propiedadSeleccionada.comentarios.findIndex(
            (comentario) => comentario.id === this.comentarioEditando.id
          );
          if (index !== -1) {
            this.propiedadSeleccionada.comentarios[index] = this.comentarioEditando;
          }
          this.comentarioEditando = null;  // Cierra el formulario de edición
          window.location.reload();
        },
        (error) => {
          console.error('Error al editar comentario:', error);
        }
      );
    }
  }

  // Método para cancelar la edición
  cancelarEdicion() {
    this.comentarioEditando = null;  // Cierra el formulario de edición
  }

  eliminarComentario(): void {
    this.propiedadService.eliminarComentario(this.propiedadSeleccionada.id, this.nombreUsuario).subscribe({
      next: (response) => {
        console.log('Comentario eliminado con éxito:', response);
        // Puedes actualizar la vista o hacer otras acciones después de eliminar el comentario
        window.location.reload();
      },
      error: (error) => {
        console.error('Error al eliminar el comentario:', error);
      }
    });
  }
}
