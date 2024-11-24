import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms'; // Importa FormsModule
import { CommonModule } from '@angular/common'; // Importa CommonModule

@Component({
  selector: 'app-modal',
  templateUrl: './modal-filter.component.html',
  styleUrls: ['./modal-filter.component.scss'],
})
export class ModalComponent {
  public isModalOpen: boolean = false;

  public filters = {
    price: 0,
    distance: 0,
    propertyType: '',
    mascotas: false,
    wifi: false,
    cocina: false,
    estacionamiento: false,
    lavadora: false,
    amueblado: false,
  };

  openModal(): void {
    this.isModalOpen = true;
  }

  closeModal(): void {
    this.isModalOpen = false;
  }

  resetFilters(): void {
    this.filters = {
      price: 0,
      distance: 0,
      propertyType: '',
      mascotas: false,
      wifi: false,
      cocina: false,
      estacionamiento: false,
      lavadora: false,
      amueblado: false,
    };
  }
}

