
import { Component, OnInit } from '@angular/core';
import { FooterComponent } from "../../../components/footer/footer.component";
import { HeaderComponent } from "../../../components/header/header.component";
import { EventCardComponent } from '../../../components/event-card/event-card.component';
import { EventDTO } from '../../../models/dto/EventDTO';
import { EventService } from '../../../services/event.service';
import { UserService } from '../../../services/user.service';

@Component({
  selector: 'app-event-management',
  standalone: true,
  providers: [EventService, UserService],
  templateUrl: './event-management.component.html',
  styleUrl: './event-management.component.scss',
  imports: [FooterComponent, HeaderComponent, EventCardComponent]
})
export class EventManagementComponent implements OnInit {

  constructor(private eventService: EventService, private userService: UserService) { }

  events: EventDTO[] = [];
  userId: number = -1;
  tipo: string = "";

  handleChange(e: any) {
    const searchType = e.target.value;
    switch (searchType) {
      case 'apuntados':
        if (this.tipo == "Usuario") {
          this.eventService.getEventsByUser(this.userId).subscribe(
            (data) => {
              this.events = data;
            },
            (error) => {
              console.error('Error fetching events:', error);
            }
          );
        } else if (this.tipo == "Institucion") {
          this.eventService.getEventsByInstitution(this.userId).subscribe(
            (data) => {
              this.events = data;
            },
            (error) => {
              console.error('Error fetching events:', error);
            }
          );
        }
        break;
      case 'creados':
        if (this.tipo == "Usuario") {
          this.eventService.getEventsCreatedByUser(this.userId).subscribe(
            (data) => {
              this.events = data;
            },
            (error) => {
              console.error('Error fetching events:', error);
            }
          );
        } else if (this.tipo == "Institucion") {
          this.eventService.getEventsCreatedByInstitution(this.userId).subscribe(
            (data) => {
              this.events = data;
            },
            (error) => {
              console.error('Error fetching events:', error);
            }
          );
        }

        break;
    }
  }

  ngOnInit() {

    this.userId = this.userService.getUserIdFromToken();
    this.tipo = this.userService.getUserTypeFromToken();

    if (this.tipo == "Usuario") {
      this.eventService.getEventsByUser(this.userId).subscribe(
        (data) => {
          this.events = data;
        },
        (error) => {
          console.error('Error fetching events:', error);
        }
      );
    } else if (this.tipo == "Institucion") {
      this.eventService.getEventsByInstitution(this.userId).subscribe(
        (data) => {
          this.events = data;
        },
        (error) => {
          console.error('Error fetching events:', error);
        }
      );
    }

  }
}
