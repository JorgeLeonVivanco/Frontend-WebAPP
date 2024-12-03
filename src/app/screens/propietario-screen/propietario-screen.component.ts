import { Component, OnInit } from '@angular/core';
import { PropiedadService } from 'src/services/propiedad.service';
import { FacadeService } from 'src/services/facade.service';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';

import * as L from 'leaflet'; // Importamos Leaflet

@Component({
  selector: 'app-propietario-screen',
  templateUrl: './propietario-screen.component.html',
  styleUrls: ['./propietario-screen.component.scss'],
})
export class PropietarioScreenComponent implements OnInit {
  public lista_propiedades: any[] = [];
  public idCliente: number | null = null; // ID del cliente actual
  public lat: number = 18.993819; // Coordenadas de inicio (centro del mapa)
  public lng: number = -98.202277;
  private map!: L.Map; // Variable para el mapa

  constructor(
    private propiedadService: PropiedadService,
    private facadeService: FacadeService,
    private router: Router,
    private httpClient: HttpClient
  ) {}

  ngOnInit(): void {
    const id = this.facadeService.getUserId();
    this.idCliente = id ? Number(id) : null;

    if (this.idCliente) {
      this.obtenerPropiedades(); // Cargar propiedades si el ID del cliente está definido
    } else {
      alert('No se encontró un cliente asociado.');
    }
  }

  // Inicializar el mapa
  initMap(): void {
    this.map = L.map('map').setView([this.lat, this.lng], 15); // Coordenadas iniciales y zoom

    // Añadir la capa base de OpenStreetMap
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
    }).addTo(this.map);
  }

  // Obtener propiedades desde el servicio
  obtenerPropiedades() {
    this.propiedadService.obtenerListaPropiedades().subscribe(
      (response) => {
        this.lista_propiedades = response
          .filter((propiedad: any) => propiedad.cliente === this.idCliente)
          .map((propiedad: any) => ({
            ...propiedad,
            comentarios: propiedad.comentarios || [],
            comentariosLeidos: propiedad.comentariosLeidos || false,
            servicios_json: Array.isArray(propiedad.servicios_json)
              ? propiedad.servicios_json
              : [propiedad.servicios_json],
          }));

        this.initMap(); // Inicializar el mapa
        this.lista_propiedades.forEach((propiedad) =>
          this.agregarMarcadores(
            propiedad.latitud, // Ajusta este nombre si tus datos usan un campo diferente
            propiedad.longitud,
            propiedad
          )
        );
      },
      (error) => {
        alert('Error al cargar las propiedades.');
      }
    );
  }

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
      <strong>Precio:</strong> ${propiedad.precio}<br>
      <strong>Servicios:</strong> ${this.formatServicios(propiedad.servicios_json)}<br>
    `;
    marcador.bindPopup(popupContent);
  }

  goEditar(idPropiedad: number) {
    console.log('Editar propiedad:', idPropiedad);
    this.router.navigate([`/registro-propiedad/${idPropiedad}`]);
  }

  eliminarPropiedad(idPropiedad: number) {
    if (confirm('¿Estás seguro de que deseas eliminar esta propiedad?')) {
      this.propiedadService.eliminarPropiedad(idPropiedad).subscribe(
        () => {
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
    return servicios;
  }

  verDetallePropiedad(idPropiedad: number): void {
    this.router.navigate([`/detalle-propiedad/${idPropiedad}`]);
    const propiedad = this.lista_propiedades.find((prop) => prop.id === idPropiedad);
    if (propiedad) {
      propiedad.comentariosLeidos = true;
    }
  }
}
