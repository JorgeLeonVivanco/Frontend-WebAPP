import { Component, OnInit } from '@angular/core';
import { PropiedadService } from 'src/services/propiedad.service';
import { Router } from '@angular/router';

import * as L from 'leaflet'; // Importamos Leaflet

@Component({
  selector: 'app-estudiante-screen',
  templateUrl: './estudiante-screen.component.html',
  styleUrls: ['./estudiante-screen.component.scss'],
})
export class EstudianteScreenComponent implements OnInit {
  public rol: string = ''; // Rol del usuario
  public lista_propiedades: any[] = []; // Lista de propiedades
  public showFilterModal: boolean = false; // Estado del modal de filtros

  public lat: number = 18.993819; // Coordenadas de inicio (centro del mapa)
  public lng: number = -98.202277;
  private map!: L.Map; // Variable para el mapa


  constructor(
    private propiedadService: PropiedadService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.obtenerPropiedades(); // Cargar propiedades al iniciar
  }

  // Inicializar el mapa
  initMap(): void {
    this.map = L.map('map').setView([this.lat, this.lng], 15); // Coordenadas iniciales y zoom

    // Añadir la capa base de OpenStreetMap
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
    }).addTo(this.map);
  }


  // Agregar marcadores al mapa
  agregarMarcadores(lat: number, lng: number, propiedad: any): void {
    if (!this.map) return;

  // Crear un icono personalizado usando un ícono de Bootstrap
  const icono = L.divIcon({
    className: 'custom-icon', // Clase personalizada para el icono
    html: `<i class="bi bi-geo-alt-fill" style="font-size: 30px; color: #007bff;"></i>`, // Ícono de Bootstrap
    iconSize: [30, 30], // Tamaño del icono
    iconAnchor: [15, 30], // Anclaje del icono
    popupAnchor: [0, -30], // Ajuste del popup
  });

    // Crear un marcador con el icono personalizado y añadirlo al mapa
    const marcador = L.marker([lat, lng], { icon: icono }).addTo(this.map);

    // Crear un popup con la información de la propiedad
    const popupContent = `
      <strong>Dirección:</strong> ${propiedad.direccion}<br>
      <strong>Precio: $</strong> ${propiedad.precio}<br>
      <strong>Servicios:</strong> ${this.formatServicios(propiedad.servicios_json)}<br>
    `;
    marcador.bindPopup(popupContent);
  }


  // Obtención de propiedades desde el servicio
  obtenerPropiedades(): void {
    this.propiedadService.obtenerListaPropiedades().subscribe(
      (response) => {
        // Filtrar las propiedades disponibles
        this.lista_propiedades = response.filter(
          (propiedad: any) => propiedad.estados === 'Disponible'
        );
        this.initMap(); // Inicializar el mapa
        this.lista_propiedades.forEach((propiedad) =>
          this.agregarMarcadores(
            propiedad.latitud, // Ajusta este nombre si tus datos usan un campo diferente
            propiedad.longitud,
            propiedad
          )
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

    public formatServicios(servicios: any): string {
    if (Array.isArray(servicios)) {
      return servicios.join(', ');
    }
    return servicios;
  }

}
