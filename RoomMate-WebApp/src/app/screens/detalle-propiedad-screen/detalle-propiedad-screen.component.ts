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

        if (serviciosJson) {
          try {
            const serviciosArray = JSON.parse(serviciosJson.replace(/\\"/g, '"'));
            this.propiedadSeleccionada = {
              ...response,
              servicios: serviciosArray || [],
              comentarios: response.comentarios || [],
              imagenes: response.imagenes || [],
              propietario: response.propietario || {  // Mapear propietario
                nombre: 'Sin información',
                correo: 'No especificado',
                telefono: 'No especificado',
              },
            };

          }
          catch (e) {
            console.error('Error al parsear servicios_json:', e);
          }
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
