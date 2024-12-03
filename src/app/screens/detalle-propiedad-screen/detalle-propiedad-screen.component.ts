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

  ngAfterViewInit(): void {
    this.initMap(); // Inicializa el mapa después de que la vista se haya cargado
  }

  initMap(): void {
    // Asegúrate de que las coordenadas sean las de la propiedad seleccionada
    const map = L.map('map').setView([this.lat, this.lng], 16); // Coordenadas y nivel de zoom

    // Cargar el mapa con OpenStreetMap
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
    }).addTo(map);

    // Verifica que existan las coordenadas antes de agregar el marcador
    if (this.propiedadSeleccionada.latitud && this.propiedadSeleccionada.longitud) {
      map.setView([this.propiedadSeleccionada.latitud, this.propiedadSeleccionada.longitud], 16); // Centra el mapa en la propiedad

      // Agregar un marcador en las coordenadas de la propiedad
      const icono = L.divIcon({
        className: 'custom-icon',
        html: `<i class="bi bi-geo-alt-fill" style="font-size: 30px; color: #007bff;"></i>`,
        iconSize: [30, 30],
        iconAnchor: [15, 30],
        popupAnchor: [0, -30],
      });

      // Crear el marcador y asignarle las coordenadas
      const marcador = L.marker([this.propiedadSeleccionada.latitud, this.propiedadSeleccionada.longitud], { icon: icono }).addTo(map);

      // Crear un popup con la información de la propiedad
      const popupContent = `
        <strong>Dirección:</strong> ${this.propiedadSeleccionada.direccion}<br>
      `;
      marcador.bindPopup(popupContent);
    }
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
          latitud: response.latitud, // Asegúrate de que las coordenadas estén disponibles
          longitud: response.longitud, // Asegúrate de que las coordenadas estén disponibles
        };

        console.log('Propiedad cargada:', this.propiedadSeleccionada);
        this.initMap(); // Vuelve a inicializar el mapa después de obtener los datos de la propiedad
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


}



