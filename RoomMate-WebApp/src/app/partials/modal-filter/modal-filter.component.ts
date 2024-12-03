import { Component, EventEmitter, Output } from '@angular/core';

@Component({
  selector: 'app-modal',
  templateUrl: './modal-filter.component.html',
  styleUrls: ['./modal-filter.component.scss'],
})
export class ModalComponent {
  @Output() filtersApplied: EventEmitter<any> = new EventEmitter();
  @Output() filtersReset: EventEmitter<void> = new EventEmitter();

  // Filtros del modal
  filters = {
    precio_min: 1000,   // El precio mínimo es fijo
    precio_max: 1000,  // El precio máximo es ajustable por el usuario
    tipo_propiedad: '',
    servicios: [] as string[] // Especifica que es un arreglo de strings
  };

  public servicios: any[] = [
    { value: '1', nombre: 'Agua potable' },
    { value: '2', nombre: 'Luz electrica' },
    { value: '3', nombre: 'Internet' },
    { value: '4', nombre: 'Mascotas' },
    { value: '5', nombre: 'Cocina' },
    { value: '6', nombre: 'Estacionamiento' },
    { value: '7', nombre: 'Lavadora' },
    { value: '8', nombre: 'Amueblado' },
    { value: '9', nombre: 'Seguridad' },
  ];

  isModalOpen = false;

  // Método para abrir el modal
  openModal() {
    this.isModalOpen = true;
  }

  // Método para cerrar el modal
  closeModal() {
    this.isModalOpen = false;
  }

  // Método para verificar si un servicio está seleccionado
  isSelected(serviceName: string): boolean {
    return this.filters.servicios.includes(serviceName);
  }

  // Método para manejar el cambio en los checkboxes
  onServiceChange(servicioNombre: string, event: Event) {
    const target = event.target as HTMLInputElement;
    const isChecked = target.checked;
  
    if (isChecked) {
      if (!this.filters.servicios.includes(servicioNombre)) {
        this.filters.servicios.push(servicioNombre);
      }
    } else {
      const index = this.filters.servicios.indexOf(servicioNombre);
      if (index > -1) {
        this.filters.servicios.splice(index, 1);
      }
    }
  }

  // Método para aplicar los filtros
  applyFilters() {
    // Emitir los filtros seleccionados al componente principal
    this.filtersApplied.emit(this.filters);
    this.closeModal();  // Cierra el modal después de aplicar filtros
  }

  // Método para limpiar los filtros
// Método para limpiar los filtros
resetFilters() {
  // Resetea los filtros a sus valores por defecto
  this.filters = {
    precio_min: 1000,  // El precio mínimo es fijo
    precio_max: 1000, // El precio máximo es ajustable por el usuario
    tipo_propiedad: '', // Se deja vacío, sin filtro
    servicios: [] // Se resetean los servicios seleccionados
  };
  // Emite el evento para restablecer los filtros en el componente principal
  this.filtersReset.emit();

    // Si tienes el formulario vinculado con ngModel, debes asegurarte de que la vista se actualice
    // También puedes resetear el formulario manualmente si es necesario
    this.closeModal();  // Cierra el modal después de limpiar
  }
  
}
