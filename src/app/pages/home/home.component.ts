import { Component } from '@angular/core';
import { BannerComponent } from "../banner/banner.component";
import { ArticulosComponent } from "../articulos/articulos.component";

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [BannerComponent, ArticulosComponent],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent {

}
