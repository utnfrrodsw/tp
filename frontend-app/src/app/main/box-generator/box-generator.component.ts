import { Component, Input, OnInit } from '@angular/core';
import { ImageGeneratorService } from '../image-generator.service';
import { Observable } from 'rxjs';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { faSpinner} from '@fortawesome/free-solid-svg-icons';
interface ImageData {
  artifacts: { base64: string }[]; 
}
@Component({
  selector: 'app-box-generator',
  templateUrl: './box-generator.component.html',
  styleUrls: ['./box-generator.component.sass'],
})
export class BoxGeneratorComponent implements OnInit{
  IMG: SafeResourceUrl;
  faSpinner= faSpinner;
  constructor(
    private imageGenerator: ImageGeneratorService,
    private _sanitizer: DomSanitizer) {
    this.title = '';
    this.hasImage = false;
    this.IMG = '';
    this.investment = 0;
  }
  ngOnInit(): void {
    this.loadImage();
    var timeoutCal = setTimeout( ()=> {
      this.revenueCalculator();
      clearTimeout(timeoutCal);
    }, 1200);
  }

  @Input() id?: number;
  @Input() title: string;
  @Input() content?: string;
  @Input() hasImage: boolean;
  @Input() investment: number;
  @Input() type: string = 'default';
  @Input() revenue = "";
  percentaje: number = 0;
  isBetter: boolean = true;

  loadImage(){
    if (this.hasImage) {
      const result = this.imageGenerator.generateImage();
      result.then((okey: Observable<any>) => okey.subscribe((imagen: ImageData) => {
        console.log(imagen);
        this.IMG= this._sanitizer.bypassSecurityTrustResourceUrl('data:image/jpg;base64,'+ imagen.artifacts[0].base64);
      }))
    }
  }

  revenueCalculator(){
    if (this.investment > +this.revenue){
      this.isBetter = false;
    }
    this.percentaje = +(((+this.revenue - this.investment) / this.investment) * 100).toFixed(2);
  }

  getType(type: string): string {
    if(type === 'bank')
      return 'bankStyle';
    if(type === 'icc')
      return 'iccStyle';
    if(type === 'dolar')
      return 'dolarStyle';
    else return 'default'
  }
}
