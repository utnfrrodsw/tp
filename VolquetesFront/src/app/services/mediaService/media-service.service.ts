import { Injectable } from '@angular/core';
import { ReplaySubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
 
export  class MediaService {
  private matches = new ReplaySubject<boolean>(1);
  public match$ = this.matches.asObservable();
  
  constructor(public readonly query: string) {
    // Check if we are in the browser environment
    if (typeof window !== 'undefined') {
      const mediaQueryList = window.matchMedia(this.query);
      
      // Define the event listener function
      const listener = (event: MediaQueryListEvent | MediaQueryListEventInit) => {
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