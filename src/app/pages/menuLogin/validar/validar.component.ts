import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { AuthService } from '../../../services/auth.service';

@Component({
  selector: 'app-validar',
  standalone: true,
  imports: [],
  templateUrl: './validar.component.html',
  styleUrl: './validar.component.css'
})
export class ValidarComponent implements OnInit {

  token: string = "";

  constructor(
    private activatedRoute: ActivatedRoute,
    private authService: AuthService
  ) { }

  ngOnInit(): void {
    const tk: string = this.activatedRoute.snapshot.paramMap.get("token") || "";
    if (tk !== null && tk != undefined) { this.token = tk; }
  }

}
