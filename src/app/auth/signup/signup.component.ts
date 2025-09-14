import { Component } from "@angular/core";
import { FormsModule, NgForm } from "@angular/forms";

import { AuthService } from "../auth.service";
import { MatCardModule } from "@angular/material/card";
import { MatFormFieldModule } from "@angular/material/form-field";
import { CommonModule } from "@angular/common";
import { MatProgressSpinnerModule } from "@angular/material/progress-spinner";
import { MatInputModule } from "@angular/material/input";
import { BrowserAnimationsModule } from "@angular/platform-browser/animations";
import { MatButtonModule } from "@angular/material/button";

@Component({
  templateUrl: "./signup.component.html",
  styleUrls: ["./signup.component.css"],
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
export class SignupComponent {
  isLoading = false;

  constructor(public authService: AuthService) {}

  onSignup(form: NgForm) {
    if (form.invalid) {
      return;
    }
    this.isLoading = true;
    this.authService.createUser(form.value.email, form.value.password);
  }
}
