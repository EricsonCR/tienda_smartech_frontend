import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../../services/auth.service';
import { ActivatedRoute, RouterLink } from '@angular/router';

@Component({
  selector: 'app-signup-success',
  standalone: true,
  imports: [],
  templateUrl: './signup-success.component.html',
  styleUrl: './signup-success.component.css'
})
export class SignupSuccessComponent implements OnInit {

  respuestaEmail: number = 0;

  constructor(
    private activatedRoute: ActivatedRoute,
    private authService: AuthService
  ) { }

  ngOnInit(): void {
    let email: string = "";
    this.activatedRoute.queryParams.subscribe((params) => { email = params["email"]; });
    if (email != "" && email != undefined) {
      console.log(email);
      this.authService.enviarEmailRegistro(email).subscribe({
        next: (result) => {
          if (result.status == "OK") {
            this.respuestaEmail = 1;
          } else { this.respuestaEmail = 2; }
        },
        error: (error) => { console.log(error); }
      });
    }
  }

}
