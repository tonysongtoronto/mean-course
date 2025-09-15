import { Component, OnInit, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { HeaderComponent } from "./header/header.component";
import { AuthService } from './auth/auth.service';


@Component({
  selector: 'app-root',
  imports: [RouterOutlet,
    HeaderComponent,
   ],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App implements OnInit  {

    constructor(private authService: AuthService) {}
  protected readonly title = signal('mean-course');


   ngOnInit() {
    this.authService.autoAuthUser();
  }


}
