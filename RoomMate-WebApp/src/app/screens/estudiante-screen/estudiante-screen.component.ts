import { Component, OnInit } from '@angular/core';
import { PropiedadService } from 'src/services/propiedad.service';
import { Router } from '@angular/router';
import { FilterService } from 'src/services/filter.service';

@Component({
  selector: 'app-estudiante-screen',
  templateUrl: './estudiante-screen.component.html',
  styleUrls: ['./estudiante-screen.component.scss'],
})
export class EstudianteScreenComponent implements OnInit {
  public rol: string = ''; // Rol del usuario
  public lista_propiedades: any[] = []; // Lista de propiedades
  public showFilterModal: boolean = false; // Estado del modal de filtros
  propiedades: any[] = [];  // Aquí se guardarán las propiedades filtradas
  filters = {
    precio_min: 1000, // Valor predeterminado para el precio mínimo
    precio_max: 10000, // Valor predeterminado para el precio máximo
    tipo_propiedad: '',
    servicios: [] as string[] // Explicitamente definimos servicios como un arreglo de cadenas
  };
  isModalOpen = false;

  constructor(
    private propiedadService: PropiedadService,
    private filterService: FilterService, // Inyectamos el servicio de filtros
    private router: Router
  ) {}

  ngOnInit(): void {
    this.obtenerPropiedades(); // Cargar propiedades al iniciar
  }

  // Obtención de propiedades desde el servicio
  obtenerPropiedades(): void {
    this.propiedadService.obtenerListaPropiedades().subscribe(
      (response) => {
        this.lista_propiedades = response; // Guardar propiedades en la lista
        this.propiedades = this.lista_propiedades;  // Asignar todas las propiedades al array
        console.log('Propiedades cargadas:', this.lista_propiedades);
      },
      (error) => {
        alert('Error al cargar las propiedades.');
        console.error('Error al cargar propiedades:', error);
      }
    );
  }

  // Aseguramos que el tipo de servicios es siempre un arreglo de cadenas
  onFiltersApplied(filters: any): void {
    console.log('Filtros recibidos:', filters);

    // Verificar si 'servicios' es una cadena de texto y convertirlo en un arreglo de cadenas
    if (typeof filters.servicios === 'string') {
      // Si 'servicios' es una cadena, la dividimos en un arreglo de cadenas usando ',' como separador
      filters.servicios = filters.servicios.split(',').map(servicio => servicio.trim());
    }

    // Si 'servicios' no es una cadena ni un arreglo válido, lo inicializamos como un arreglo vacío
    else if (!Array.isArray(filters.servicios)) {
      filters.servicios = [];
    }

    this.filters = filters;  // Actualizamos los filtros con los valores seleccionados
    this.applyFilters();     // Aplicar los filtros a las propiedades
  }

  // Aplicar los filtros
  applyFilters() {
    // Verificamos si los filtros tienen valores válidos
    if (this.filters.precio_min > this.filters.precio_max) {
      alert('El precio mínimo no puede ser mayor que el precio máximo.');
      return;
    }

    // Aplicamos los filtros a las propiedades
    this.filterService.getFilteredProperties(this.filters).subscribe(
      (data) => {
        // Filtrar las propiedades que cumplan con los precios dentro del rango
        this.propiedades = data.filter(propiedad => {
          // Convertimos los precios de string a número para asegurarnos de que la comparación sea correcta
          const precio = Number(propiedad.precio);

          // Aseguramos que el precio esté dentro del rango: 
          // precio >= precio_min y precio <= precio_max
          return precio >= this.filters.precio_min && precio <= this.filters.precio_max;
        });

        // Asegurar que las URLs de las imágenes sean correctas
        this.propiedades.forEach((propiedad) => {
          // Si la imagen no tiene la URL completa, la agregamos
          if (propiedad.imagenes && propiedad.imagenes.length > 0) {
            propiedad.imagenes = propiedad.imagenes.map((img: string) => {
              if (!img.startsWith('http')) {
                return 'http://127.0.0.1:8000/media/' + img;
              }
              return img;
            });
          }
        });

        if (this.propiedades.length > 0) {
          console.log('Propiedades filtradas:', this.propiedades);
        } else {
          alert('No se encontraron propiedades con los filtros seleccionados.');
        }
      },
      (error) => {
        console.error('Error al obtener propiedades filtradas:', error);
      }
    );
  }

  // Llamar a esta función para limpiar los filtros y mostrar todas las propiedades
  onFiltersReset(): void {
    // Restablecer los filtros a sus valores predeterminados
    this.filters = {
      precio_min: 1000,  // Precio mínimo por defecto
      precio_max: 10000, // Precio máximo por defecto
      tipo_propiedad: '', // Tipo de propiedad vacío
      servicios: [] // No servicios seleccionados
    };
    this.obtenerPropiedades();  // Llamar para obtener todas las propiedades sin filtros
  }

  // Abrir el modal de filtros
  openFilterModal() {
    this.showFilterModal = true;  // Abrir el modal
  }

  // Cerrar el modal de filtros
  closeFilterModal() {
    this.showFilterModal = false; // Cerrar el modal
  }

  // Ver detalles de una propiedad
  verDetallePropiedad(idPropiedad: number): void {
    this.router.navigate([`/detalle-propiedad/${idPropiedad}`]); // Navegar a la vista de detalle
  }
}
