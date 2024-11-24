import { Component, OnInit,  } from '@angular/core';
import { Router } from '@angular/router';
import { FacadeService } from 'src/services/facade.service';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss']
})
export class NavbarComponent implements OnInit{
  public rol:string = "";
  public token: string="";

  showFilterModal: boolean = false;
  showUserMenu: boolean = false;
  searchTerm: string = '';
  userRole: string = 'Estudiante'; // Cambia el valor según el rol actual

  filters = {
    price: 0,
    distance: 0,
    propertyType: '',
    mascotas: false,
    wifi: false,
    cocina: false,
    estacionamiento: false,
    lavadora: false,
    amueblado: false
  };

  properties = [
    { name: 'Apartamento Central', price: 5000, type: 'Apartamento', distance: 5, mascotas: true, wifi: true, cocina: true, estacionamiento: true, lavadora: false, amueblado: true },
    { name: 'Casa en las afueras', price: 3000, type: 'Casa', distance: 20, mascotas: false, wifi: true, cocina: false, estacionamiento: true, lavadora: true, amueblado: false },
    { name: 'Estudio moderno', price: 2500, type: 'Estudio', distance: 2, mascotas: true, wifi: false, cocina: true, estacionamiento: false, lavadora: true, amueblado: true }
  ];

  filteredProperties = this.properties;

  constructor(
    private router: Router,
    private facadeService: FacadeService
  ) {}

  ngOnInit(): void {

    //Validar si se ha iniciado sesion
    //obtenemos el token del login
    this.token = this.facadeService.getSessionToken();
    console.log("Token: ", this.token);

    if(this.token == ""){
      this.router.navigate([""]);
    }

    this.rol = this.facadeService.getUserGroup();
    console.log("Tipo: ", this.rol);

  }

  goToSobreMi() {
    this.router.navigate(['/sobre-mi']);
  }

  goToRegistrar() {
    if (this.userRole === 'Propietario') {
      this.router.navigate(['/registro-propiedad']);
    }
  }

  cerrarSesion() {
    console.log('Token enviado para cerrar sesión:', this.facadeService.getSessionToken()); // Imprime el token
    this.facadeService.logout().subscribe(
      (response) => {
        console.log('Sesión cerrada correctamente:', response);
        this.facadeService.clearSession(); // Limpia el token del localStorage
        this.router.navigate(['/login']); // Redirige al login
      },
      (error) => {
        console.error('Error al cerrar sesión:', error);
        alert('No se pudo cerrar sesión correctamente.');
      }
    );
  }
  
  toggleFilterModal() {
    this.showFilterModal = !this.showFilterModal;
  }

  closeFilterModal() {
    this.showFilterModal = false;
  }

  applyFilters() {
    this.filteredProperties = this.properties.filter(property => {
      const matchesSearch = property.name.toLowerCase().includes(this.searchTerm.toLowerCase());
      const matchesPrice = this.filters.price ? property.price <= this.filters.price : true;
      const matchesDistance = this.filters.distance ? property.distance <= this.filters.distance : true;
      const matchesType = this.filters.propertyType ? property.type === this.filters.propertyType : true;
      const matchesMascotas = !this.filters.mascotas || property.mascotas === this.filters.mascotas;
      const matchesWifi = !this.filters.wifi || property.wifi === this.filters.wifi;
      const matchesCocina = !this.filters.cocina || property.cocina === this.filters.cocina;
      const matchesEstacionamiento = !this.filters.estacionamiento || property.estacionamiento === this.filters.estacionamiento;
      const matchesLavadora = !this.filters.lavadora || property.lavadora === this.filters.lavadora;
      const matchesAmueblado = !this.filters.amueblado || property.amueblado === this.filters.amueblado;

      return (
        matchesSearch &&
        matchesPrice &&
        matchesDistance &&
        matchesType &&
        matchesMascotas &&
        matchesWifi &&
        matchesCocina &&
        matchesEstacionamiento &&
        matchesLavadora &&
        matchesAmueblado
      );
    });
    this.closeFilterModal();
  }

  resetFilters() {
    this.filters = {
      price: 0,
      distance: 0,
      propertyType: '',
      mascotas: false,
      wifi: false,
      cocina: false,
      estacionamiento: false,
      lavadora: false,
      amueblado: false
    };
    this.searchTerm = '';
    this.filteredProperties = this.properties;
  }

  toggleUserMenu() {
    this.showUserMenu = !this.showUserMenu;
  }
}
