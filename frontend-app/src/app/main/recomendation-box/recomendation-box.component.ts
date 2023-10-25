import { Component, Input } from '@angular/core';
import { faSpinner, faMoneyBillTrendUp} from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'app-recomendation-box',
  template: `
  <div class="container">
  <div *ngIf="best === undefined" style="color: aliceblue; text-align: center;"><fa-icon [icon]="faSpinner" size="lg"  animation="spin"></fa-icon><span style="size: 24px;">&nbsp;cargando...</span></div>
  <div *ngIf="best" class="recomendation-font">
  <fa-icon [icon]="faMoneyBillTrendUp"></fa-icon>
    La mejor opcion es {{best}} !
  </div>
  </div>
`,
  styleUrls: ['./recomendation-box.component.sass']
})
export class RecomendationBoxComponent {
  @Input() best?: string;
  faSpinner = faSpinner;
  faMoneyBillTrendUp = faMoneyBillTrendUp;
  constructor(){}

}
