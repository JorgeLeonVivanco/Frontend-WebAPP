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
    propietario: {
      nombre: '',
      correo: '',
      telefono: '',
    },
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
        // Asignar datos a la propiedad seleccionada
        this.propiedadSeleccionada = {
          ...response,
          propietario: response.propietario || {
            nombre: 'No especificado',
            correo: 'No especificado',
            telefono: 'No especificado',
          },
          servicios: response.servicios || [],
          comentarios: response.comentarios || [],
          imagenes: response.imagenes || [],
        };

        // Sanitizar URL del mapa para evitar errores de seguridad
        if (response.mapaUrl) {
          this.propiedadSeleccionada.mapaUrl = this.sanitizer.bypassSecurityTrustResourceUrl(
            response.mapaUrl
          ) as string;
        }

        console.log('Propiedad cargada:', this.propiedadSeleccionada);
      },
      (error) => {
        console.error('Error al cargar la propiedad seleccionada:', error);
        alert('No se pudo cargar la propiedad seleccionada.');
      }
    );
  }
}
