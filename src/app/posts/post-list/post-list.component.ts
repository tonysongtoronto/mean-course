import { Component, OnInit, OnDestroy } from "@angular/core";
import { Observable, Subscription } from 'rxjs';

import { Post } from "../post.model";
import { PostsService } from "../posts.service";
import { MatExpansionModule } from "@angular/material/expansion";
import { CommonModule } from "@angular/common";

@Component({
  selector: "app-post-list",
  templateUrl: "./post-list.component.html",
  styleUrls: ["./post-list.component.css"],
    imports: [ MatExpansionModule,CommonModule],
})
export class PostListComponent implements OnInit, OnDestroy {
  // posts = [
  //   { title: "First Post", content: "This is the first post's content" },
  //   { title: "Second Post", content: "This is the second post's content" },
  //   { title: "Third Post", content: "This is the third post's content" }
  // ];

// posts: Post[] = [];
  posts$!: Observable<Post[]>;
  private postsSub!: Subscription;

  constructor(public postsService: PostsService) {



  }

  ngOnInit() {

     this.postsService.getPosts();

    this.posts$ = this.postsService.getPostUpdateListener();

  }

    onDelete(postId: string) {
    this.postsService.deletePost(postId);
  }


  ngOnDestroy() {
    this.postsSub.unsubscribe();
  }
}
