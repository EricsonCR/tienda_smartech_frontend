import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { AuthService } from '../../../services/auth.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-forgotpassword',
  standalone: true,
  imports: [RouterModule, ReactiveFormsModule],
  templateUrl: './forgotpassword.component.html',
  styleUrl: './forgotpassword.component.css'
})
export class ForgotpasswordComponent implements OnInit {
  forgotForm!: FormGroup;

  constructor(
    private authService: AuthService,
    private fb: FormBuilder
  ) { }

  ngOnInit(): void {
    this.forgotForm = this.fb.group({
      email: ["", [Validators.required, Validators.email]]
    });
  }

  forgotpassword() {
    this.authService.recuperarPassword(this.forgotForm.value.email).subscribe({
      next: (result) => {
        if (result.status == "OK") { this.alertOK(result.message); }
        else { this.alertError(result.message); }
      },
      error: (error) => { this.alertError(error); }
    });
  }

  alertOK(message: string) {
    Swal.fire({
      position: "top",
      title: "Cambio de password exitoso",
      text: message,
      icon: "success"
    });
  }

  alertError(message: string) {
    Swal.fire({
      position: "top",
      title: message,
      icon: "error"
    });
  }
}
