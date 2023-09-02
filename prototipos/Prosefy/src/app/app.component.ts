import { Component, OnInit } from '@angular/core';
import { nombreSitio } from '../app/shared/constants';
import { SmoothScrollService } from './smooth-scroll.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent implements OnInit {
  nombreSitio = nombreSitio;
  constructor(private smoothScrollService: SmoothScrollService) {}

  ngOnInit() {
    this.smoothScrollService.initializeSmoothScrollbar();
  }
}
