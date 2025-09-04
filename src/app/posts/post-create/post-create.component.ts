import { Component } from "@angular/core";
import { FormsModule, NgForm } from "@angular/forms";

import { PostsService } from "../posts.service";
import { MatCardModule } from "@angular/material/card";
import { MatInputModule } from "@angular/material/input";
import { CommonModule } from "@angular/common";

@Component({
  selector: "app-post-create",
  templateUrl: "./post-create.component.html",
  styleUrls: ["./post-create.component.css"],
  imports: [ MatCardModule,
       MatInputModule,
        FormsModule,
        CommonModule],
})
export class PostCreateComponent {
  enteredTitle = "";
  enteredContent = "";

  constructor(public postsService: PostsService) {}

  onAddPost(form: NgForm) {
    if (form.invalid) {
      return;
    }

 
    this.postsService.addPost(form.value.title, form.value.content);
    form.resetForm();
  }
}
