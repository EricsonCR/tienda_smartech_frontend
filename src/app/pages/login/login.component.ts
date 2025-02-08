import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';
import Swal from 'sweetalert2'
import { SharedService } from '../../services/shared.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent implements OnInit {
  public loginForm!: FormGroup;

  constructor(
    private authService: AuthService,
    private fb: FormBuilder,
    private router: Router,
    private sharedService: SharedService
  ) { }

  ngOnInit(): void {
    this.loginForm = this.fb.group({
      email: ["", [Validators.required, Validators.email]],
      password: ["", [Validators.required, Validators.minLength(4)]]
    });
  }

  login() {
    this.authService.login(this.loginForm.value).subscribe({
      next: (result) => {
        if (result.status == "200") {
          this.authService.setEmail(this.loginForm.value.email);
          this.sharedService.updateCuenta(this.loginForm.value.email);
          this.alertOK(result.message);
          this.router.navigate([""]);
        } else {
          this.alertError(result.message);
        }
      },
      error: (error) => { console.log(error); }
    });
  }

  alertOK(message: string) {
    Swal.fire({
      position: "center",
      icon: "success",
      title: message,
      showConfirmButton: false,
      timer: 2500
    });
  }

  alertError(message: string) {
    Swal.fire({
      title: message,
      icon: "error"
    });
  }

}
