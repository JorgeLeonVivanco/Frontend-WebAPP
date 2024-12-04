import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { PropiedadService } from 'src/services/propiedad.service';
import { FacadeService } from 'src/services/facade.service';

import * as L from 'leaflet'; // Importamos Leaflet

@Component({
  selector: 'app-detalle-propiedad-screen',
  templateUrl: './detalle-propiedad-screen.component.html',
  styleUrls: ['./detalle-propiedad-screen.component.scss'],
})
export class DetallePropiedadScreenComponent implements OnInit {
  comentarioEditando: any = null;  // Comentario que está siendo editado
  nombreUsuario: string = 'UsuarioEjemplo';  // Nombre del usuario actual

  public lat: number = 19.0337; // Coordenadas de inicio (centro del mapa)
  public lng: number = -98.2227;
  public calificacionActual: number = 0; // Calificación seleccionada por el usuario
  public stars: number[] = [0, 1, 2, 3, 4]; // Representa 5 estrellas

  public propiedadSeleccionada: any = {
    direccion: '',
    estado: '',
    imagenes: [],
    servicios: [],
    calificacion: null,
    comentarios: [],
    mapaUrl: '',
    latitud: 0,
    longitud: 0,
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

  initMap(): void {
    // Centrar el mapa en las coordenadas de la propiedad seleccionada
    if (this.propiedadSeleccionada.latitud && this.propiedadSeleccionada.longitud) {
      this.lat = this.propiedadSeleccionada.latitud;
      this.lng = this.propiedadSeleccionada.longitud;
    }

    // Inicializar el mapa con las coordenadas de la propiedad
    const map = L.map('map').setView([this.lat, this.lng], 16);

    // Añadir capa base de OpenStreetMap
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
    }).addTo(map);

    // Añadir marcador para la propiedad seleccionada
    this.agregarMarcador(map, this.lat, this.lng);
  }

  agregarMarcador(map: L.Map, lat: number, lng: number): void {
    // Crear un icono personalizado
    const icono = L.divIcon({
      className: 'custom-icon',
      html: `<i class="bi bi-geo-alt-fill" style="font-size: 30px; color: #007bff;"></i>`,
      iconSize: [30, 30],
      iconAnchor: [15, 30],
      popupAnchor: [0, -30],
    });

    // Crear un marcador y añadirlo al mapa
    const marcador = L.marker([lat, lng], { icon: icono }).addTo(map);

    // Crear contenido del popup
    const popupContent = `
      <strong>Dirección:</strong> ${this.propiedadSeleccionada.direccion}<br>
      <strong>Precio: $</strong> ${this.propiedadSeleccionada.precio}<br>
    `;
    marcador.bindPopup(popupContent).openPopup();
  }

  ngAfterViewInit(): void {
    if (this.propiedadSeleccionada.latitud && this.propiedadSeleccionada.longitud) {
      this.initMap();
    }
  }



  obtenerDetallePropiedad(id: number): void {
    this.propiedadService.getPropiedadByID(id).subscribe(
      (response) => {
        this.propiedadSeleccionada = {
          ...response,
          servicios: response.servicios_json ? JSON.parse(response.servicios_json) : [],
          comentarios: response.comentarios || [],
          imagenes: response.imagenes || [],
          propietario: response.propietario || {},
        };

        // Actualizar coordenadas para el mapa
        this.lat = this.propiedadSeleccionada.latitud || this.lat;
        this.lng = this.propiedadSeleccionada.longitud || this.lng;

        // Inicializar el mapa
        this.initMap();
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

  // Método para eliminar un comentario
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

  calificarPropiedad(estrellas: number): void {
    // Actualizamos la propiedad seleccionada localmente
    this.propiedadSeleccionada.calificacion = estrellas;

    // Creamos el objeto a enviar al backend
    const data = {
      id: this.propiedadSeleccionada.id,
      direccion: this.propiedadSeleccionada.direccion, // Dirección actualizada
      habitaciones: this.propiedadSeleccionada.habitaciones,
      capacidad: this.propiedadSeleccionada.precio,
      precio: this.propiedadSeleccionada.precio,
      servicios_json: this.propiedadSeleccionada.servicios_json,
      sanitarios: this.propiedadSeleccionada.sanitarios,
      telefono: this.propiedadSeleccionada.telefono,
      estados: this.propiedadSeleccionada.estados,
      imagenes: this.propiedadSeleccionada.imagenes,
      calificacion: estrellas,
    };

    // Llamamos al servicio para editar la propiedad
    this.propiedadService.editarPropiedad(data).subscribe(
      (response) => {
        console.log('Calificación actualizada con éxito:', response);
        alert('¡Gracias por tu calificación!');
      },
      (error) => {
        console.error('Error al actualizar la calificación:', error);
        alert('No se pudo actualizar la calificación. Intenta nuevamente.');
      }
    );
  }

  // Método para resaltar las estrellas al pasar el mouse
  hoverEstrella(calificacion: number): void {
    this.calificacionActual = calificacion;
  }

  // Método para restablecer las estrellas si el usuario no hace clic
  resetEstrellas(): void {
    this.calificacionActual = 0;
  }




}



