// src/app/services/scroll.service.ts

import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ScrollService {
  private scrollDirectionSubject = new BehaviorSubject<string>('none');
  scrollDirection$ = this.scrollDirectionSubject.asObservable();

  private lastScrollTop = 0;

  constructor() {
    this.initScrollListener();
  }

  private initScrollListener() {
    window.addEventListener('scroll', () => {
      const st = window.scrollY;
      if (st > this.lastScrollTop) {
        this.scrollDirectionSubject.next('down');
      } else {
        this.scrollDirectionSubject.next('up');
      }
      this.lastScrollTop = st <= 0 ? 0 : st;
    });
  }
}
