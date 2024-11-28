import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { PropiedadService } from 'src/services/propiedad.service';

@Component({
  selector: 'app-detalle-propiedad-screen',
  templateUrl: './detalle-propiedad-screen.component.html',
  styleUrls: ['./detalle-propiedad-screen.component.scss'],
})
export class DetallePropiedadScreenComponent implements OnInit {
  public propiedadSeleccionada: any = {
    direccion: '',
    estado: '',
    imagenes: [],
    servicios: [],
    calificacion: null,
    comentarios: [],
    mapaUrl: '',
  };


  constructor(
    private route: ActivatedRoute,
    private propiedadService: PropiedadService,
    private sanitizer: DomSanitizer
  ) {}

  ngOnInit(): void {
    const idPropiedad = this.route.snapshot.paramMap.get('id');
    this.obtenerDetallePropiedad(Number(idPropiedad));
  }

  obtenerDetallePropiedad(id: number): void {
    this.propiedadService.getPropiedadByID(id).subscribe(
      (response) => {
        const serviciosJson = response.servicios_json;

        // Asignamos la propiedad seleccionada
        this.propiedadSeleccionada = {
          ...response,
          // Servicios: si 'servicios_json' es un string con formato JSON, lo convertimos a arreglo
          servicios: serviciosJson ? JSON.parse(serviciosJson.replace(/\\"/g, '"')) : [],  // Asegúrate de convertirlo si es necesario
          comentarios: response.comentarios || [],  // Ya debería ser un arreglo de objetos
          imagenes: response.imagenes || [],  // Si no hay imágenes, asignamos un arreglo vacío
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
    usuario: '',  // Deja el nombre vacío inicialmente
    fecha: new Date().toISOString(),
    texto: ''
  };

  // Método para agregar un comentario
  agregarComentario(): void {
    if (this.nuevoComentario.texto.trim()) {
      this.propiedadService.agregarComentario(this.propiedadSeleccionada.id, this.nuevoComentario).subscribe(
        (response) => {
          // Actualizar la lista de comentarios con la respuesta del backend
          this.propiedadSeleccionada.comentarios.push(response);
          this.nuevoComentario.texto = ''; // Limpiar el campo de comentario
        },
        (error) => {
          console.error('Error al agregar el comentario:', error);
          alert('No se pudo agregar el comentario. Intenta nuevamente.');
        }
      );
    }
  }


}
//sssssss
