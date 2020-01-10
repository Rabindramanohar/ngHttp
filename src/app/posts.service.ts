import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Post } from './model';

@Injectable({
  providedIn: 'root'
})
export class PostsService {

  constructor(private http: HttpClient) {}

  createAndStorePost(title: string, content: string) {
    const postData: Post = {title, content};
    this.http
      .post<{ [key: string]: Post }>(
        'https://ng-complete-guide-f56d8.firebaseio.com/posts.json',
        postData
      )
      .subscribe(responseData => {
        console.log(responseData);
      });
  }

  fetchPost() {
    // ...
  }

}
