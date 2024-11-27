import { Component, OnInit } from '@angular/core';
import { PropiedadService } from 'src/services/propiedad.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-estudiante-screen',
  templateUrl: './estudiante-screen.component.html',
  styleUrls: ['./estudiante-screen.component.scss'],
})
export class EstudianteScreenComponent implements OnInit {
  public rol: string = ''; // Rol del usuario
  public lista_propiedades: any[] = []; // Lista de propiedades
  public showFilterModal: boolean = false; // Estado del modal de filtros

  constructor(
    private propiedadService: PropiedadService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.obtenerPropiedades(); // Cargar propiedades al iniciar
  }

  // Obtención de propiedades desde el servicio
  obtenerPropiedades(): void {
    this.propiedadService.obtenerListaPropiedades().subscribe(
      (response) => {
        // Filtrar las propiedades disponibles
        this.lista_propiedades = response.filter(
          (propiedad: any) => propiedad.estados === 'Disponible'
        );
        console.log('Propiedades disponibles cargadas:', this.lista_propiedades);
      },
      (error) => {
        alert('Error al cargar las propiedades.');
        console.error('Error al cargar propiedades:', error);
      }
    );
  }

  // Ver detalles de una propiedad
  verDetallePropiedad(idPropiedad: number): void {
    this.router.navigate([`/detalle-propiedad/${idPropiedad}`]); // Navegar a la vista de detalle
  }

}

