import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Location } from '@angular/common';
import { PropiedadService } from 'src/services/propiedad.service';
import { FacadeService } from 'src/services/facade.service';

@Component({
  selector: 'app-registro-propiedad',
  templateUrl: './registro-propiedad.component.html',
  styleUrls: ['./registro-propiedad.component.scss'],
})
export class RegistroPropiedadComponent implements OnInit {
  public propiedad: any = {};
  public errors: any = {};
  public editar: boolean = false;
  public idPropiedad: number | null = null;

  public selectedImages: File[] = []; // Nuevas imágenes seleccionadas
  public existingImages: string[] = []; // URLs de imágenes existentes

  public habitaciones: any[] = [
    { value: '2', viewValue: '1-2' },
    { value: '3', viewValue: '3-4' },
    { value: '4', viewValue: '4-5' },
    { value: '5', viewValue: '5 a más' },
  ];

   // Añadir el tipo de propiedad
   public tipoPropiedad: any[] = [
    { value: 'Casa', viewValue: 'Casa' },
    { value: 'Apartamento', viewValue: 'Apartamento' },
    { value: 'Estudio', viewValue: 'Estudio' },
  ];

  public capacidades: any[] = [
    { value: '2', viewValue: '1-2' },
    { value: '3', viewValue: '3-4' },
    { value: '4', viewValue: '4-5' },
    { value: '5', viewValue: '5 a más' },
  ];

  public sanitarioss: any[] = [
    { value: '1', viewValue: '1' },
    { value: '2', viewValue: '2' },
    { value: '3', viewValue: '3' },
    { value: '4', viewValue: 'Más de 4' },
  ];

  public estadoss: any[] = [
    { value: '1', viewValue: 'Disponible' },
    { value: '2', viewValue: 'Ocupado' },
  ];

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

  constructor(
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private location: Location,
    private propiedadService: PropiedadService,
    private facadeService: FacadeService
  ) {}

  ngOnInit(): void {
    this.idPropiedad = Number(this.activatedRoute.snapshot.paramMap.get('id'));

    if (this.idPropiedad) {
      this.editar = true;
      this.cargarPropiedad();
    } else {
      this.propiedad = { ...this.propiedadService.esquemaUsuario() }; // Inicializa una nueva propiedad
    }
  }

  cargarPropiedad(): void {
    if (!this.idPropiedad) return;

    this.propiedadService.getPropiedadByID(this.idPropiedad).subscribe(
      (data) => {
        this.propiedad = data;

        // Cargar imágenes existentes
        if (data.imagenes) {
          this.existingImages = data.imagenes;
        }

        // Convertir servicios JSON a array
        if (data.servicios_json) {
          this.propiedad.servicios_json = JSON.parse(data.servicios_json);
        }
      },
      (error) => {
        console.error('Error al cargar la propiedad:', error);
        alert('No se pudo cargar la propiedad.');
      }
    );
  }

  registrar(): void {
    // Validar que los campos requeridos no estén vacíos
    const requiredFields = ['direccion', 'habitaciones', 'capacidad', 'precio', 'sanitarios', 'telefono', 'estados', 'tipo_propiedad'];
    const emptyFields = requiredFields.filter((field) => !this.propiedad[field]);

    if (emptyFields.length > 0) {
      alert(`Los siguientes campos son obligatorios y están vacíos: ${emptyFields.join(', ')}`);
      return;
    }

    // Validación del precio
  if (this.propiedad.precio < 1000 || this.propiedad.precio > 10000) {
    this.errors.precio = 'El precio debe estar entre $1000 y $10000.';
    return; // Detener la ejecución si el precio no es válido
  } else {
    this.errors.precio = null; // Limpiar el mensaje de error
  }

  if (this.editar && this.idPropiedad !== null) {
    // Modo edición
    const images: File[] = this.selectedImages; // Asumimos que tienes las nuevas imágenes seleccionadas
    this.propiedadService.editarPropiedad(this.idPropiedad, this.propiedad, images).subscribe(
      (response) => {
        console.log('Propiedad actualizada correctamente:', response);
        alert('Propiedad actualizada correctamente.');
        this.router.navigate(['/home']); // Redirige al home
      },
      (error) => {
        console.error('Error al actualizar la propiedad:', error);
        alert('No se pudo actualizar la propiedad.');
      }
    );
  } else {
    console.error('Error: El ID de la propiedad es inválido o no se encuentra.');
  }
}  

  onFileSelected(event: any): void {
    if (event.target.files) {
      for (const file of event.target.files) {
        this.selectedImages.push(file);
      }
    }
  }

  validarPrecio(): void {
    // Validación básica del precio (rango entre 1000 y 10000)
    if (this.propiedad.precio < 1000 || this.propiedad.precio > 10000) {
      this.errors.precio = 'El precio debe estar entre $1000 y $10000.';
    } else {
      this.errors.precio = null; // Limpiar el error si el precio es válido
    }
  }
  
  removeExistingImage(index: number): void {
    this.existingImages.splice(index, 1);
  }

  getPreviewUrl(file: File): string {
    return URL.createObjectURL(file);
  }

  regresar(): void {
    this.location.back();
  }

  
  formatPrecio(event: any): void {
    const input = event.target.value.replace(/\D/g, ''); // Elimina caracteres no numéricos
    event.target.value = input; // Actualiza el valor mostrado
    this.propiedad.precio = input; // Actualiza el modelo
  }

  validateNumericInput(event: KeyboardEvent): void {
    const allowedKeys = ['Backspace', 'ArrowLeft', 'ArrowRight', 'Delete', 'Tab'];
    const key = event.key;

    if (!allowedKeys.includes(key) && !/^\d$/.test(key)) {
      event.preventDefault();
    }
  }

  formatTelefono(event: Event): void {
    const input = event.target as HTMLInputElement;
    let phone = input.value.replace(/\D/g, ''); // Elimina caracteres no numéricos

    if (phone.length > 10) {
      phone = phone.slice(0, 10);
    }

    if (phone.length > 6) {
      input.value = `(${phone.slice(0, 3)}) ${phone.slice(3, 6)}-${phone.slice(6)}`;
    } else if (phone.length > 3) {
      input.value = `(${phone.slice(0, 3)}) ${phone.slice(3)}`;
    } else if (phone.length > 0) {
      input.value = `(${phone}`;
    }

    this.propiedad.telefono = input.value;
  }
  
    // Método para eliminar una imagen seleccionada
    removeImage(index: number): void {
      this.selectedImages.splice(index, 1);
    }
  
    // Método para cancelar la edición y volver
    cancelar(): void {
      this.location.back();
    }

    // Método para seleccionar imágenes
  onImageSelected(event: any): void {
    const files: FileList = event.target.files;
    if (files) {
      for (let i = 0; i < files.length; i++) {
        this.selectedImages.push(files[i]);
      }
    }
  }

}