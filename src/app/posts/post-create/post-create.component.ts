import { ChangeDetectorRef, Component } from "@angular/core";
import { FormsModule, NgForm } from "@angular/forms";

import { PostsService } from "../posts.service";
import { MatCardModule } from "@angular/material/card";
import { MatInputModule } from "@angular/material/input";
import { CommonModule } from "@angular/common";
import { ActivatedRoute, ParamMap, Router } from "@angular/router";
import { Post } from "../post.model";
import { MatProgressSpinnerModule } from "@angular/material/progress-spinner";

@Component({
  selector: "app-post-create",
  templateUrl: "./post-create.component.html",
  styleUrls: ["./post-create.component.css"],
  imports: [ MatCardModule,
       MatInputModule,
        FormsModule,
     MatProgressSpinnerModule,
        CommonModule,],
})
export class PostCreateComponent {

  enteredTitle = "";
  enteredContent = "";
  post: Post| null = null;;
  isLoading = false;
  private mode = "create";
  private postId: string | null = null;

  constructor(
    public postsService: PostsService,
     private cdr: ChangeDetectorRef,
    public route: ActivatedRoute,
    private router: Router
  ) {}

ngOnInit() {

  this.route.paramMap.subscribe((paramMap: ParamMap) => {

    if (paramMap.has("postId")) {

      this.mode = "edit";
      this.postId = paramMap.get("postId");
      this.isLoading = true;

      this.postsService.getPost(this.postId!).subscribe({
        next: (postData ) => {
          this.isLoading = false;
          this.post = {id: postData._id, title: postData.title, content: postData.content};
          this.cdr.detectChanges(); // 手动触发变更检测
         console.log("post loaded:", this.post);

        },
        error: (error) => {
          this.isLoading = false; // 重要：错误时也要停止loading
          console.error("Error loading post:", error);
        }
      });
    } else {
      this.mode = "create";
      this.postId = null;
      this.isLoading = false; // 创建模式时不需要loading
    }
  });
}


  onSavePost(form: NgForm) {
    if (form.invalid) {
      return;
    }
    this.isLoading = true;
    if (this.mode === "create") {
      this.postsService.addPost(form.value.title, form.value.content);
       this.router.navigate(["/"]);
    } else {
      this.postsService.updatePost(
        this.postId!,
        form.value.title,
        form.value.content
      );
    }
    form.resetForm();
  }



}
