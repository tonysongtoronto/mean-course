import { Component } from "@angular/core";
import { FormsModule, NgForm } from "@angular/forms";
import { AuthService } from "../auth.service";
import { MatCardModule } from "@angular/material/card";
import { MatProgressSpinnerModule } from "@angular/material/progress-spinner";
import { MatFormFieldModule } from "@angular/material/form-field";
import { CommonModule } from "@angular/common";
import { MatButtonModule } from "@angular/material/button";
import { MatInputModule } from "@angular/material/input";

@Component({
  templateUrl: "./login.component.html",
  styleUrls: ["./login.component.css"],
  imports: [
    MatCardModule,
    MatFormFieldModule,
    FormsModule,
    CommonModule,
    MatButtonModule,
    MatInputModule,
    MatProgressSpinnerModule,
  ]
})
export class LoginComponent {
  isLoading = false;
  constructor(public authService: AuthService) { }

  onLogin(form: NgForm) {
    if (form.invalid) {
      return;
    }
    this.isLoading = true;
    this.authService.login(form.value.email, form.value.password);
  }
}
