import { Component, OnInit } from '@angular/core';
import { SmoothScrollService } from './smooth-scroll.service';
import { nombreSitio } from '../app/shared/constants';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent implements OnInit {
  nombreSitio: string;

  constructor(private smoothScrollService: SmoothScrollService) {
    this.nombreSitio = nombreSitio;
  }

  ngOnInit() {
    this.smoothScrollService.initializeSmoothScrollbar();
  }
}
