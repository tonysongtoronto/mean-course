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
            id: post._id,
             imagePath: post.imagePath
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
        this.postsUpdated.next([...this.posts]);
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

    // You can also show user-friendly error messages
    // this.showErrorMessage('Failed to create post. Please try again.');
  },
  complete: () => {
    console.log('Post creation request completed');
    // Optional: Handle completion (called after success or error)
  }
});
      // .subscribe(responseData => {
      //   const post: Post = {
      //     id: responseData.post.id,
      //     title: title,
      //     content: content,
      //     imagePath: responseData.post.imagePath ? responseData.post.imagePath :''
      //   };
      //   this.posts.push(post);
      //   this.postsUpdated.next([...this.posts]);
      //   this.router.navigate(["/"]);
      // });
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
        this.postsUpdated.next([...this.posts]);
        this.router.navigate(["/"]);
      });
  }

}
