import { Component } from "@angular/core";
import { MatToolbarModule } from '@angular/material/toolbar';
import { RouterModule } from "@angular/router";

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  imports: [MatToolbarModule,RouterModule],
})
export class HeaderComponent {



}
