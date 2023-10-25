import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AILogicService } from '../investment-main/ai-logic.service';

@Component({
  selector: 'app-money-main',
  template: `
  <mat-card>
    <form action="" [formGroup]="formLogin" (ngSubmit)="invest()">
      <mat-card-header>
        <div mat-card-avatar class="example-header-image"></div>
        <mat-card-title>Cuantos pesos Argentinos puede invertir ?</mat-card-title>
      </mat-card-header>
    <mat-form-field class="field-flex" floatLabel="always">
    <mat-label for="money" id="money">Dinero: </mat-label>
    <input 
    matInput 
    type="number" 
    name="money" 
    id="money" 
    formControlName="money" 
    class="money-field"
    step="0.01">
    <span matTextPrefix>$&nbsp;</span>
    <mat-icon matSuffix>sentiment_very_satisfied</mat-icon>
    <mat-error 
    *ngIf="formLogin.get('money')?.invalid">Ingrese el monto en pesos($) a invertir
    </mat-error>
    </mat-form-field>
    <div class="inflation-container">
    <mat-checkbox 
    class="checkbox-field"
    style="display: table-cell"
    formControlName="editInflation"
    (change)="canEditInflation = !canEditInflation"
    >editar</mat-checkbox>
    <mat-form-field class="field-flex inflation-field" style="display: table-cell">
    <mat-label for="inflation" id="inflation">Inflación: </mat-label>
    <input matInput type="number" name="inflation" id="inflation" formControlName="inflation" [readonly]="!canEditInflation">
    <span matTextSuffix>%&nbsp;</span>
    </mat-form-field>
    
    </div>
    <mat-divider></mat-divider>
    <div class="button-container">
    <button class="field-flex button-style" mat-raised-button type="submit">Invertir</button>
    <button class="return-button" mat-raised-button type="button" (click)="returnPage()">Volver</button>
    </div>
  </form>
</mat-card>`,
  styleUrls: ['./money-main.component.sass']
})
export class MoneyMainComponent implements OnInit  {
  formLogin: FormGroup;
  inflationInput!: number;
  canEditInflation: boolean = false;

  constructor(
    private formBuilder : FormBuilder,
    private router: Router,
    private service: AILogicService)
    {
      this.inflationInput = this.service.inflation;

      this.formLogin = this.formBuilder.group({
        money: [0, [Validators.min(1), Validators.required]],
        inflation: [ this.inflationInput,{value: this.inflationInput, disable: this.canEditInflation}],
        editInflation: [false]
      })
    }
  ngOnInit(): void {
  }

  invest () {
    if (this.formLogin.valid) 
    {
      this.service.inflation = this.formLogin.controls['inflation'].value;
      this.service.investment = this.formLogin.controls['money'].value;
      this.router.navigate(['investment'])
    }
  }

  returnPage() {
    this.router.navigate(["login"]);
    }
}
