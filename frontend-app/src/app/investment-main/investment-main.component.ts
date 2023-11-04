import { Component, OnInit } from '@angular/core';
import { AILogicService } from './ai-logic.service';
import { Bank } from 'src/models/bank';
import { TextGeneratorService } from '../main/text-generator.service';
import { finalize, first, map,  } from 'rxjs';
import { Investment } from 'src/models/investment';
import { Dolar } from 'src/models/dolar';

@Component({
  selector: 'app-investment-main',
  templateUrl: './investment-main.component.html',
  styleUrls: ['./investment-main.component.sass']
})
export class InvestmentMainComponent implements OnInit{
  configBanks: Bank[] = [];
  BankLoading: boolean = false;
  configICC: Investment[] = [];
  ICCLoading: boolean = false;
  investment?: number;
  moneyICC: number[] = [];
  contentBanks: string[] = [];
  timeoutId?: any;
  finalTimeOutId?: any;
  configDolar: Dolar[] = [];
  filterDolar: string[] = ["contadoconliqui", "bolsa", "blue"];
  revenue: number[] = [];
  inflation: number;
  bestOption?: string;
  titles: string[] = [];

  constructor(
    private IA: AILogicService,
    private textGeneratorService: TextGeneratorService) {
      this.inflation = this.IA.inflation;
      this.investment = this.IA.investment!;
      this.IA.generateBanks().pipe(
        first()).subscribe((banks: Bank[]) => {
          this.configBanks = banks;
      });

      this.IA.getContructionData().pipe(
        first(),
        finalize(()=>
        this.ICCLoading = true))
        .subscribe(
          data => this.configICC= data
        );

        this.IA.getDolar().pipe(
          first(),
          map(dolars => dolars.filter(d => this.filterDolar.includes(d.casa)))
        ).subscribe( (dolars: Dolar[])=>{
          this.configDolar = dolars;
          this.configDolar.map(d => d.cost = +(this.investment! / d.venta).toFixed(2))
        }); 
    }

  ngOnInit(): void {
    console.log(this.inflation);
    this.timeoutId = setTimeout(()=> {
        this.configICC.map(y => {
          this.generateTextforICC(y.InvestmentId, this.investment!)
          .subscribe(value => {
            y.Content = +value.toFixed(2) ?? 0;
          })
        }),
        this.configBanks.map(x => {
          x.content = this.textGeneratorService.generateTextForBanks(x.Name, x.InterestRate);
        }),
        this.cancelTimeout();
      }, 200)

      this.finalTimeOutId = setTimeout( ()=> {
        this.calculateRevenue();
        clearTimeout(this.finalTimeOutId!);
      }, 1000)
  }

  cancelTimeout (): void {
    clearTimeout(this.timeoutId);
  }

  generateTextforBanks(name: string, rate: number){
    return this.textGeneratorService.generateTextForBanks(name, rate);
  }
  
  generateTextforICC(id: number, money: number){
    return this.IA.getProfit(id, money)
  }

  calculateRevenue() {
    this.revenue.push(...this.configBanks.map( x=> +((((x.InterestRate/100) - (this.inflation/100)) + 1) * this.investment!).toFixed(2)));
    this.revenue.push(...this.configICC.map(x => +((x.Content!) / (1 + (this.inflation/100))).toFixed(2)));
    this.revenue.push(...this.configDolar.map(x => +(x.cost! * x.compra).toFixed(2)));
    this.revenue.push(+(this.investment! / (1 + (this.inflation!/100))).toFixed(2))
    this.titles.push(...this.configBanks.map(x => x.Name.toLowerCase()));
    this.titles.push(...this.configICC.map(x => x.Label.toLowerCase()));
    this.titles.push(...this.configDolar.map(x => 'dolar ' + x.nombre.toLowerCase()));
    this.titles.push('no invertir en nada');
    
    const fakeLoadinBestOption = setTimeout( ()=> {
      const max = Math.max(...this.revenue)
      const index = this.revenue.findIndex(x => x == max)
      this.bestOption = this.titles[index];
      clearTimeout(fakeLoadinBestOption);
    }, 3000)
  }

}
