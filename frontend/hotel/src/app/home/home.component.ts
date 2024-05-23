import { Component, OnInit } from '@angular/core';
import { ApiService } from '../servicio/api.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent implements OnInit  {

data: any[] = [];

constructor(private apiService: ApiService){}

ngOnInit(): void {
    this.llenarData();
}

llenarData(){

  this.apiService.getData().subscribe(data => {
    this.data = data;
    console.log(this.data);
  });
}

}
