import { Component } from '@angular/core';
import { HeaderComponent } from '../header/header.component';
import { PopularEventsComponent } from '../popular-events/popular-events.component';
import { CrearEventComponent } from '../crear-event/crear-event.component';
import { BuyTicketComponent } from '../buy-ticket/buy-ticket.component';
import { FooterComponent } from '../footer/footer.component';

@Component({
  selector: 'app-landing',
  standalone: true,
  imports: [HeaderComponent, PopularEventsComponent,CrearEventComponent,BuyTicketComponent, FooterComponent],
  templateUrl: './landing.component.html',
  styleUrl: './landing.component.css'
})
export class LandingComponent {

}
