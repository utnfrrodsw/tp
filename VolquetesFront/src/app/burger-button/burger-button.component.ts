import { Component, OnInit, Input, EventEmitter, Output } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-burger-button',
  standalone: true,
  templateUrl: './burger-button.component.html',
  styleUrl: './burger-button.component.scss',
})
export class BurgerMenuComponent implements OnInit {
  @Input() init!: boolean;
  @Output() opened = new EventEmitter<any>();

  active = false;

  ngOnInit() {
    this.active = this.init || false;
  }

  onBurgerClicked() {
    this.active = !this.active;
    this.opened.emit();
  }
}
