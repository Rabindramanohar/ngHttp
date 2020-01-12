import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams, HttpEventType } from '@angular/common/http';
import { Post } from './model';
import { map, catchError, tap } from 'rxjs/operators';
import { Subject, throwError } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class PostsService {
  error = new Subject<string>()

  constructor(private http: HttpClient) {}

  createAndStorePost(title: string, content: string) {
    const postData: Post = {title, content};
    
    this.http
      .post<{ [key: string]: Post }>(
        'https://ng-complete-guide-f56d8.firebaseio.com/posts.json',
        postData, 
        {
          observe: 'response'
        }
      )
      .subscribe(responseData => {
        console.log(responseData);
      }, error => {
        this.error.next(error.message);
      });
  }

  fetchPost() {
    // this.isFetching = true;
    let searchParams = new HttpParams();
    searchParams = searchParams.append('print', 'pretty');
    searchParams = searchParams.append('custom', 'key');
    return this.http.get<{ [key: string]: Post }>(
      'https://ng-complete-guide-f56d8.firebaseio.com/posts.json',
      {
        headers: new HttpHeaders({'Custom-header': 'Hello there!!'}),
        params: searchParams,
        responseType: 'json'
      })
    .pipe(
      map(responseData => {
        const postArray: Post[] = [];
        for (const key in responseData) {
          if (responseData.hasOwnProperty(key)) {
            postArray.push({ ...responseData[key], id: key});
          }
        }
        return postArray;
      }),
      catchError(errorRes => {
        // Send an analytical error to server
        return throwError(errorRes);
      })
    );
  }

  deletePosts() {
    return this.http.delete('https://ng-complete-guide-f56d8.firebaseio.com/posts.json', 
    {
      observe: 'events',
      responseType: 'text'
    }
    ).pipe(
      tap(event => {
        console.log(event);
        if (event.type === HttpEventType.Sent) {
          //..
        }
        if (event.type === HttpEventType.Response) {
          console.log(event.body);
        }
      }));
  }

}
