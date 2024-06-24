import { Component, EventEmitter, HostListener, OnDestroy, Output, Input } from '@angular/core';
import { OnInit } from '@angular/core';
import { ScrollService } from '../../services/scrollService/scroll.service'; 
import { Subscription } from 'rxjs';
import { MediaService } from '../../services/mediaService/media-service.service';


@Component({
  selector: 'app-footer',
  standalone: true,
  imports: [],
  templateUrl: './footer.component.html',
  styleUrl: './footer.component.css'
})
export class FooterComponent  implements OnInit, OnDestroy {
  isMobile: boolean = false;
  private mediaSubscription: Subscription | undefined;

  constructor(private mediaService: MediaService) { }

  ngOnInit(): void {
    // Suscribimos al Observable match$ de MediaService
    this.mediaSubscription = this.mediaService.match$.subscribe(matches => {
      this.isMobile = matches;
    });
  }

  ngOnDestroy(): void {
    // Unsubscribe from the mediaSubscription to prevent memory leaks
    if (this.mediaSubscription) {
      this.mediaSubscription.unsubscribe();
    }
  }

}