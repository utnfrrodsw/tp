import { Component } from '@angular/core';
import { faGithub, faLinkedin }from "@fortawesome/free-brands-svg-icons"

@Component({
  selector: 'app-footer',
  template: `
  
  <div class="shared-container">
  <div class="icon-margin">
    <a href="https://github.com/FedericoUTN/tp/tree/FedeEnzoDev" type="button" target="_blank"><fa-icon [icon]="faGithub" size="lg">git</fa-icon></a>
    &nbsp;
    <a href="https://www.linkedin.com/in/federico-rafael-vallejo-64655795" type="button" target="_blank"><fa-icon [icon]="faLinkedin" size="lg">linkedin</fa-icon></a>
  </div>
  © 2023 Copyright &nbsp;
    <a href="https://github.com/FedericoUTN/tp/tree/FedeEnzoDev">FedericoEnzo.com</a>
  </div>
  `,
  styleUrls: ['./footer.component.sass']
})
export class FooterComponent {
  faGithub = faGithub;
  faLinkedin = faLinkedin;
}
