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
        // Asegúrate de obtener el campo `servicios_json`
        const serviciosJson = response.servicios_json;

        console.log('Contenido de servicios_json:', serviciosJson); // Imprime el contenido

        // Verifica si el valor tiene barras invertidas extra antes de intentar parsearlo
        if (serviciosJson) {
          try {
            // Intenta parsear el JSON, si es válido
            const serviciosArray = JSON.parse(serviciosJson.replace(/\\"/g, '"'));
            this.propiedadSeleccionada = {
              ...response,
              servicios: serviciosArray || [],  // Conversión de servicios_json a arreglo
              comentarios: response.comentarios || [],
              imagenes: response.imagenes || [],
            };
          } catch (e) {
            console.error('Error al parsear servicios_json:', e);
          }
        }

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
