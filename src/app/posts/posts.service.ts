import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { map, Subject } from "rxjs";

import { Post } from "./post.model";
import { environment } from "../environments/environment";
import { Router } from "@angular/router";

@Injectable({ providedIn: "root" })
export class PostsService {
  private posts: Post[] = [];
  private postsUpdated = new Subject<Post[]>();

   constructor(private http: HttpClient, private router: Router) {}

    generateRandomString(length: number): string {
      const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
      let result = '';
      for (let i = 0; i < length; i++) {
        result += chars.charAt(Math.floor(Math.random() * chars.length));
      }
      return result;
    }

getPosts() {
    this.http
      .get<{ message: string; posts: any[] }>(
        environment.apiUrl+"/api/posts"
      )
      .pipe(map((postData) => {
        return postData.posts.map(post => {
          return {
            title: post.title,
            content: post.content,
            id: post._id
          };
        });
      }))
      .subscribe(transformedPosts => {
        this.posts = transformedPosts;
        this.postsUpdated.next([...this.posts]);
      });
  }

  getPostUpdateListener() {
    return this.postsUpdated.asObservable();
  }


addPost(title: string, content: string) {
    const post: Post = { id: null, title: title, content: content };
    this.http
      .post<{ message: string, postId:string }>(environment.apiUrl+"/api/posts/", post)
      .subscribe(responseData => {
    
        post.id=responseData.postId
        this.posts.push(post);
        this.postsUpdated.next([...this.posts]);
      });
  }

    deletePost(postId: string) {
    this.http.delete(environment.apiUrl+"/api/posts/" + postId)
      .subscribe(() => {
        const updatedPosts = this.posts.filter(post => post.id !== postId);
        this.posts = updatedPosts;
        this.postsUpdated.next([...this.posts]);
      });
  }

    getPost(id: string) {
    return this.http.get<{ _id: string; title: string; content: string }>(
      environment.apiUrl +"/api/posts/" + id
    );
  }

 updatePost(id: string, title: string, content: string) {
  const post: Post = { id: id, title: title, content: content };
  this.http
    .put(environment.apiUrl + "/api/posts/" + id, post)
    .subscribe({
      next: (response) => {
        console.log("✅ updatePost success response:", response);

        const updatedPosts = [...this.posts];
        const oldPostIndex = updatedPosts.findIndex(p => p.id === post.id);
        updatedPosts[oldPostIndex] = post;
        this.posts = updatedPosts;

        console.log("✅ posts after update:", this.posts);
        this.postsUpdated.next([...this.posts]);
        this.router.navigate(["/"]);
      },
      error: (err) => {
        console.error("❌ updatePost error:", err);
      },
      complete: () => {
        console.info("ℹ️ updatePost request completed");
      }
    });
}

}
