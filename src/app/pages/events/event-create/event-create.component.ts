import { NgClass, NgIf } from '@angular/common';
import { Component } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { FooterComponent } from '../../../components/footer/footer.component';
import { HeaderComponent } from '../../../components/header/header.component';
import { InputLocationComponent } from '../../../components/input-location/input-location.component';
import { User } from '../../../models/User';
import { EventDTO } from '../../../models/dto/EventDTO';
import { EventService } from '../../../services/event.service';
import { MapboxService } from '../../../services/mapbox.service';
import { UserService } from '../../../services/user.service';

interface AdressInfo {
  place_name: string;
  center: number[];
}

@Component({
  selector: 'app-event-create',
  standalone: true,
  providers: [ EventService, UserService, MapboxService ],
  imports: [ HeaderComponent, FooterComponent, ReactiveFormsModule, InputLocationComponent, NgIf, NgClass ],
  templateUrl: './event-create.component.html',
  styleUrl: './event-create.component.scss'
})
export class EventCreateComponent {

  // Parámetros inicializados
  userId: number = -1;
  evento: EventDTO = {} as EventDTO;
  user: User = {} as User;
  eventForm: FormGroup;
  private inputFecha: HTMLInputElement | null;
  selectedImage: any;
  addresses: AdressInfo[] = [];
  selectedAddress: string | null = null;

  // Constructor del formulario
  constructor(private fb: FormBuilder, private eventService: EventService, private userService: UserService, private mapboxService: MapboxService) {

    // Prevenir que se pueda escribir en el calendario
    this.inputFecha = document.getElementById('finicio') as HTMLInputElement;

        if (this.inputFecha) {
            this.inputFecha.addEventListener('keydown', (e: KeyboardEvent) => {
                e.preventDefault();
            });

            this.inputFecha.addEventListener('mousedown', (e: MouseEvent) => {
                e.preventDefault();
            });
        }

    this.eventForm = this.fb.group({
      titulo: ['', Validators.required],
      descripcion: ['', Validators.required],
      finicio: ['', Validators.required],
      ffin: ['', Validators.required],
      maxVoluntarios: ['', Validators.required],
      estado: ['En Revisión'],
      creadoPorUsuarios: [this.user],
      ubicacion: ['', Validators.required],
      imagen: [null, Validators.required]
    });
  }

  ngOnInit(): void {
    this.userId = this.userService.getUserIdFromToken();

    this.userService.getUserByIdforAddEvent(this.userId).subscribe(
      (data) => {
        this.user = data;
      },
      (error) => {
        console.error('Error fetching events:', error);
      }
    );
  }

  obtenerFechaActual(): string {
    const hoy = new Date();
    const mes = hoy.getMonth() + 1;
    const dia = hoy.getDate();
    const formatoMes = mes < 10 ? `0${mes}` : mes;
    const formatoDia = dia < 10 ? `0${dia}` : dia;
    return `${hoy.getFullYear()}-${formatoMes}-${formatoDia}`;
  }

  // Mostrar la imagen en por pantalla
  onFileSelected(event: any) {
    const file: File = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e: any) => {
        this.selectedImage = e.target.result;
      };
      reader.readAsDataURL(file);
    }
  }

  // Búsqueda de la dirección
  search(event: any) {
    const searchTerm = event.target.value.toLowerCase();
    if (searchTerm && searchTerm.length > 0) {
      this.mapboxService.searchWord(searchTerm).subscribe((features: any[]) => {
        this.addresses = features.map(feat => ({ place_name: feat.place_name, center: feat.center }));
        console.log(features);
      });
    } else {
      this.addresses = [];
    }
  }

  // Dirección seleccionada
  onSelect(address: string) {
    this.selectedAddress = address;
    console.log(this.selectedAddress);
    this.addresses = [];
  }

  // Subir el evento a la base de datos para revisarlo
  submitEvent() {
    if (this.eventForm.valid) {
      console.log(this.eventForm.value);
      alert('El siguiente evento pasará por un proceso de validación antes de ser públicado, se le notificara de este en caso de haber pasado la revisión.');
      //this.eventService.createEvent(this.eventForm.value).subscribe();
      this.eventForm.reset();
    }
  }
  

}