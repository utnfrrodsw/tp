import { Inject, Injectable } from '@angular/core';
import { ReplaySubject } from 'rxjs';
import { IMediaService } from './mediaservice.interface';

@Injectable({
  providedIn: 'root',
})
export class MediaService {
  private matches = new ReplaySubject<boolean>(1);
  public match$ = this.matches.asObservable();

  constructor(@Inject('IMediaService') private config: IMediaService) {
    // Check if we are in the browser environment
    if (typeof window !== 'undefined') {
      const mediaQueryList = window.matchMedia(this.config.query);

      // Define the event listener function
      const listener = (
        event: MediaQueryListEvent | MediaQueryListEventInit
      ) => {
        if (event.matches !== undefined) {
          this.matches.next(event.matches);
        }
      };

      // Initial check and then add event listener
      listener(mediaQueryList); // Initial check

      // Add event listener for changes
      mediaQueryList.addEventListener('change', listener);
    }
  }
}

