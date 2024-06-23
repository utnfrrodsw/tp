import { Component, EventEmitter, HostListener, OnDestroy, Output, Input } from '@angular/core';
import { OnInit } from '@angular/core';
import { ScrollService } from '../../services/scroll.service'; 
import { Subscription } from 'rxjs';


@Component({
  selector: 'app-footer',
  standalone: true,
  imports: [],
  templateUrl: './footer.component.html',
  styleUrl: './footer.component.css'
})
export class FooterComponent  /* implements OnInit, OnDestroy */ {
  // @Input() isFooterVisible: boolean = false;
  //private scrollSubscription!: Subscription;

  // scrollDirection: string = 'none'; // Optional: to store the current scroll direction

  // constructor(private scrollService: ScrollService) { }
  
  // lastScrollTop = 0;
  
  //@Output() scrollDirection = new EventEmitter<string>();
  // @HostListener('window:scroll', [])  

  /* ngOnInit() {
    this.scrollSubscription = this.scrollService.scrollDirection$.subscribe(direction => {
      if (direction === 'down') {
        this.isFooterVisible = true;
      } else {
        this.isFooterVisible = false;
      }
    });
  }

  ngOnDestroy() {
    if (this.scrollSubscription) {
      this.scrollSubscription.unsubscribe();
    }
  }


  /* onWindowScroll() {
    let st = window.scrollY
    //let st = math.round(window.scrollY)
    if (st > this.lastScrollTop) {
      // Scroll down
      this.scrollDirection.emit('down');
    } else {
      // Scroll up
      this.scrollDirection.emit('up');
    }
    this.lastScrollTop = st <= 0 ? 0 : st; // For Mobile or negative scrolling
  }
  */

}