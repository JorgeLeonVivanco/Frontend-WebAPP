import { Component, OnInit } from '@angular/core';
import { PropiedadService } from 'src/services/propiedad.service';
import { FacadeService } from 'src/services/facade.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-propietario-screen',
  templateUrl: './propietario-screen.component.html',
  styleUrls: ['./propietario-screen.component.scss'],
})
export class PropietarioScreenComponent implements OnInit {
  public lista_propiedades: any[] = [];
  public idCliente: number | null = null; // ID del cliente actual

  public lat: number = 19.0337; // Coordenadas de inicio (centro del mapa)
  public lng: number = -98.2227;

  constructor(
    private propiedadService: PropiedadService,
    private facadeService: FacadeService,
    private router: Router
  ) {}

  ngOnInit(): void {
    // Obtener el ID del cliente desde el servicio de sesión y convertirlo a número
    const id = this.facadeService.getUserId(); // Devuelve un string
    this.idCliente = id ? Number(id) : null; // Convertir a número
    console.log('ID del cliente actual:', this.idCliente);

    if (this.idCliente) {
      this.obtenerPropiedades(); // Cargar propiedades si el ID del cliente está definido
    } else {
      alert('No se encontró un cliente asociado.');
    }
  }

  obtenerPropiedades() {
    this.propiedadService.obtenerListaPropiedades().subscribe(
      (response) => {
        // Filtrar propiedades que coincidan con el cliente actual
        this.lista_propiedades = response.filter(
          (propiedad: any) => propiedad.cliente === this.idCliente
        ).map((propiedad: any) => ({
          ...propiedad,
          servicios_json: Array.isArray(propiedad.servicios_json)
            ? propiedad.servicios_json
            : [propiedad.servicios_json], // Asegurarse de que servicios_json sea un array
        }));
        console.log('Propiedades cargadas:', this.lista_propiedades);
      },
      (error) => {
        alert('Error al cargar las propiedades.');
      }
    );
  }

  goEditar(idPropiedad: number) {
    console.log('Editar propiedad:', idPropiedad);

    // Redirige a la página de edición de propiedad
    this.router.navigate([`/registro-propiedad/${idPropiedad}`]);
  }

  eliminarPropiedad(idPropiedad: number) {
    if (confirm('¿Estás seguro de que deseas eliminar esta propiedad?')) {
      this.propiedadService.eliminarPropiedad(idPropiedad).subscribe(
        (response) => {
          alert('Propiedad eliminada correctamente.');
          this.lista_propiedades = this.lista_propiedades.filter(
            (propiedad) => propiedad.id !== idPropiedad
          );
        },
        (error) => {
          alert('Error al eliminar la propiedad.');
        }
      );
    }
  }

  public formatServicios(servicios: any): string {
    if (Array.isArray(servicios)) {
      return servicios.join(', ');
    }
    return servicios; // Si no es un array, regresa el valor tal cual
  }
}
