import { ChangeDetectorRef, Component, OnDestroy, OnInit } from "@angular/core";
import { FormsModule, NgForm } from "@angular/forms";

import { AuthService } from "../auth.service";
import { MatCardModule } from "@angular/material/card";
import { MatFormFieldModule } from "@angular/material/form-field";
import { CommonModule } from "@angular/common";
import { MatProgressSpinnerModule } from "@angular/material/progress-spinner";
import { MatInputModule } from "@angular/material/input";
import { MatButtonModule } from "@angular/material/button";
import { Subscription } from "rxjs";

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
export class SignupComponent implements OnInit, OnDestroy  {

  isLoading = false;
  private authStatusSub!: Subscription;

  constructor(public authService: AuthService,
     private cdr: ChangeDetectorRef) { }

  ngOnInit() {
  this.authStatusSub = this.authService.getAuthStatusListener().subscribe(
    authStatus => {
      if (authStatus === false) {
        this.isLoading = false;
       this.cdr.detectChanges();
      }
    }
  );
}

  onSignup(form: NgForm) {
    if (form.invalid) {
      return;
    }
    this.isLoading = true;
    this.authService.createUser(form.value.email, form.value.password);
  }

    ngOnDestroy() {
    this.authStatusSub?.unsubscribe();
  }

}
