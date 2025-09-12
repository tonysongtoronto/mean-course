import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { map, Subject } from "rxjs";

import { Post } from "./post.model";
import { environment } from "../environments/environment";
import { Router } from "@angular/router";

@Injectable({ providedIn: "root" })
export class PostsService {
  private posts: Post[] = [];
  private postsUpdated = new Subject<{ posts: Post[]; postCount: number }>();

   constructor(private http: HttpClient, private router: Router) {}


 getPosts(postsPerPage: number, currentPage: number) {
  
     const queryParams = `?pagesize=${postsPerPage}&page=${currentPage}`;
    this.http
      .get<{ message: string; posts: any[]; maxPosts: number }>(
          "http://localhost:3000/api/posts" + queryParams
      )
       .pipe(
        map(postData => {
          return {
            posts: postData.posts.map(post => {
              return {
                title: post.title,
                content: post.content,
                id: post._id,
                imagePath: post.imagePath
              };
            }),
            maxPosts: postData.maxPosts
          };
        })
      )
      .subscribe(transformedPosts => {
        this.posts = transformedPosts.posts;
        this.postsUpdated.next({
            posts: [...this.posts],
          postCount: transformedPosts.maxPosts

        });
      });
  }

  getPostUpdateListener() {
    return this.postsUpdated.asObservable();
  }



  addPost(title: string, content: string, image: File) {
    const postData = new FormData();
    postData.append("title", title);
    postData.append("content", content);

    if(image){
    postData.append("image", image, title);
    }

    this.http
      .post<{ message: string; post: Post }>(
          environment.apiUrl+"/api/posts",
        postData
      ).subscribe({
  next: (responseData) => {
    const post: Post = {
      id: responseData.post.id,
      title: title,
      content: content,
      imagePath: responseData.post.imagePath ? responseData.post.imagePath : ''
    };
      this.posts.push(post);

       this.postsUpdated.next({
            posts: [...this.posts],
          postCount: this.posts.length

        });
        this.router.navigate(["/"]);
    // Handle successful response here
    console.log('Post created successfully:', post);
  },
  error: (error) => {
    console.error('Error creating post:', error);
    // Handle error scenarios
    if (error.status === 400) {
      console.error('Bad request - check your data');
    } else if (error.status === 401) {
      console.error('Unauthorized - check authentication');
    } else if (error.status === 500) {
      console.error('Server error - try again later');
    } else {
      console.error('Unexpected error occurred');
    }

  },
  complete: () => {
    console.log('Post creation request completed');

  }
});

  }


  deletePost(postId: string) {
    return this.http
      .delete("http://localhost:3000/api/posts/" + postId);
  }

    getPost(id: string) {
    return this.http.get<{ _id: string; title: string; content: string, imagePath: string }>(
      environment.apiUrl +"/api/posts/" + id
    );
  }

  updatePost(id: string, title: string, content: string, image: File | string) {
    let postData: Post | FormData;
    if (typeof image === "object") {
      postData = new FormData();
      postData.append("id", id);
      postData.append("title", title);
      postData.append("content", content);
      postData.append("image", image, title);
    } else {
      postData = {
        id: id,
        title: title,
        content: content,
        imagePath: image
      };
    }
    this.http
      .put(environment.apiUrl+"/api/posts/" + id, postData)
      .subscribe(response => {
        const updatedPosts = [...this.posts];
        const oldPostIndex = updatedPosts.findIndex(p => p.id === id);
        const post: Post = {
          id: id,
          title: title,
          content: content,
          imagePath: ""
        };
        updatedPosts[oldPostIndex] = post;
        this.posts = updatedPosts;
         this.postsUpdated.next({
            posts: [...this.posts],
          postCount: this.posts.length

        });
        this.router.navigate(["/"]);
      });
  }

}
