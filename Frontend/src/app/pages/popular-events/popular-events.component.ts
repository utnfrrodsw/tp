import { Component } from '@angular/core';

@Component({
  selector: 'app-popular-events',
  standalone: true,
  imports: [],
  templateUrl: './popular-events.component.html',
  styleUrl: './popular-events.component.css'
})
export class PopularEventsComponent {
  event: any[] = [1, 2, 3]; // Aquí defines los eventos

  constructor() {}
}
