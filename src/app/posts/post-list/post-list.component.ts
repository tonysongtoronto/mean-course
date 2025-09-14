import { Component, OnInit, OnDestroy } from "@angular/core";
import { Observable, Subscription } from 'rxjs';

import { Post } from "../post.model";
import { PostsService } from "../posts.service";
import { MatExpansionModule } from "@angular/material/expansion";
import { CommonModule } from "@angular/common";

import { RouterModule } from "@angular/router";
import { MatPaginatorModule, PageEvent } from "@angular/material/paginator";
import { BrowserAnimationsModule } from "@angular/platform-browser/animations";
import { MatButtonModule } from "@angular/material/button";
import { AuthService } from "../../auth/auth.service";

@Component({
  selector: "app-post-list",
  templateUrl: "./post-list.component.html",
  styleUrls: ["./post-list.component.css"],
    imports: [ MatExpansionModule,
      CommonModule,
      RouterModule ,
      MatPaginatorModule,
      MatButtonModule

   ],
})
export class PostListComponent implements OnInit, OnDestroy {

  postsObservable$!: Observable<{ posts: Post[]; postCount: number }>;
  //totalPosts = 0;
  postsPerPage = 2;
  currentPage = 1;
  pageSizeOptions = [1, 2, 5, 10];
  private postsSub!: Subscription;

    userIsAuthenticated = false;
  private authListenerSubs!: Subscription;

  constructor(public postsService: PostsService,private authService: AuthService) {

        this.authService.autoAuthUser();
    this.userIsAuthenticated = this.authService.getIsAuth();
    this.authListenerSubs = this.authService
      .getAuthStatusListener()
      .subscribe(isAuthenticated => {
        this.userIsAuthenticated = isAuthenticated;
      });

  }

  ngOnInit() {
    this.postsService.getPosts(this.postsPerPage, this.currentPage);
    this. postsObservable$ = this.postsService.getPostUpdateListener()
  }

    onChangedPage(pageData: PageEvent) {

    this.currentPage = pageData.pageIndex + 1;
    this.postsPerPage = pageData.pageSize;
    this.postsService.getPosts(this.postsPerPage, this.currentPage);
  }


    onDelete(postId: string) {
    this.postsService.deletePost(postId).subscribe(() => {
      this.postsService.getPosts(this.postsPerPage, this.currentPage);
    });
  }


  ngOnDestroy() {

  }
}
