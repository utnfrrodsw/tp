import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AILogicService } from '../investment-main/ai-logic.service';

@Component({
  selector: 'app-money-main',
  templateUrl: './money-main.component.html',
  styleUrls: ['./money-main.component.sass'],
})
export class MoneyMainComponent {
  formLogin: FormGroup;
  inflationInput!: number;
  canEditInflation: boolean = false;

  constructor(
    private formBuilder: FormBuilder,
    private router: Router,
    private service: AILogicService
  ) {
    this.inflationInput = this.service.inflation;

    this.formLogin = this.formBuilder.group({
      money: [0, [Validators.min(1), Validators.required]],
      inflation: [
        this.inflationInput,
        { value: this.inflationInput, disable: this.canEditInflation },
      ],
      editInflation: [false],
    });
  }

  invest() {
    if (this.formLogin.valid) {
      this.service.inflation = this.formLogin.controls['inflation'].value;
      this.service.investment = this.formLogin.controls['money'].value;
      this.router.navigate(['investment']);
    }
  }

  returnPage() {
    this.router.navigate(['login']);
  }
}
