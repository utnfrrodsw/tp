import { Component, ElementRef, AfterViewInit, ViewChild, Inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';

@Component({
  selector: 'app-pagina-inicio',
  templateUrl: './pagina-inicio.component.html',
  styleUrl: './pagina-inicio.component.scss'
})
export class PaginaInicioComponent {
  @ViewChild('videoElement') videoElement!: ElementRef<HTMLVideoElement>;
  videoPaused = true;
  errorMessage: string | null = null; // Add error message property

  constructor(@Inject(PLATFORM_ID) private platformId: object) {}

  ngAfterViewInit(): void {
    // Run this only in the browser
    if (isPlatformBrowser(this.platformId)) {
      const video = this.videoElement?.nativeElement;
      if (video) {
        console.log("Video element found:", video); // Debugging line
        video.muted = true;

        video.play().then(() => {
          this.videoPaused = false; // Video is playing
        }).catch(error => {
          console.error('Autoplay blocked:', error);
          this.videoPaused = true;
          this.errorMessage = "Autoplay is blocked. Please click 'Play Video'."; // Set error message
        });
      } else {
        console.error("Video element not found"); // Debugging line
      }
    }
  }

  // Add the playVideo method to handle manual playback
  playVideo(): void {
    const video = this.videoElement?.nativeElement;
    if (video) {
      video.play().then(() => {
        this.videoPaused = false; // Video is now playing
        this.errorMessage = null; // Clear any error message
      }).catch(error => {
        console.error('Error playing video:', error);
        this.errorMessage = "Failed to play video."; // Set error message
      });
    }
  }

}

