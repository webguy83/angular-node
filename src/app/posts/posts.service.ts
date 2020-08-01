import { Injectable } from '@angular/core';
import { IPost } from '../interfaces';
import { Subject, Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { HttpClient } from '@angular/common/http';

interface IPostLoadedData {
  _id: string;
  __v: number;
  title: string;
  content: string;
  imagePath: string;
}

@Injectable({ providedIn: 'root' })
export class PostsService {
  posts: IPost[] = [];
  postsUpdateSubject = new Subject<IPost[]>();
  isLoading = false;

  constructor(private http: HttpClient) {}

  getPosts() {
    this.isLoading = true;
    this.http
      .get<{ message: string; posts: IPostLoadedData[] }>(
        'http://localhost:3000/posts'
      )
      .pipe(
        map((postData) => {
          return postData.posts.map<IPost>((post) => {
            return {
              id: post._id,
              title: post.title,
              content: post.content,
              imagePath: post.imagePath,
            };
          });
        })
      )
      .subscribe((posts) => {
        this.isLoading = false;
        this.posts = posts;
        this.postsUpdateSubject.next([...this.posts]);
      });
  }

  getPost(id: string): Observable<{ message: string; post: IPostLoadedData }> {
    return this.http.get<{ message: string; post: IPostLoadedData }>(
      `http://localhost:3000/posts/${id}`
    );
  }

  updatePosts() {
    return this.postsUpdateSubject.asObservable();
  }

  addPost(post: IPost, imageFile: File) {
    const postData = new FormData();
    postData.append('title', post.title);
    postData.append('content', post.content);
    postData.append('image', imageFile);
    this.http
      .post<{ message: string; post: IPost }>(
        'http://localhost:3000/posts',
        postData
      )
      .subscribe((res) => {
        post.id = res.post.id;
        this.posts.push(post);
        this.postsUpdateSubject.next([...this.posts]);
      });
  }

  updatePost(post: IPost) {
    this.http
      .put<{ message: string }>(`http://localhost:3000/posts/${post.id}`, post)
      .subscribe((res) => {
        console.log(res.message);
      });
  }

  deletePost(id: string) {
    this.isLoading = true;
    this.http
      .delete<{ message: string }>(`http://localhost:3000/posts/${id}`)
      .subscribe(() => {
        this.isLoading = false;
        const filteredPosts = this.posts.filter((post) => {
          return post.id !== id;
        });
        this.posts = filteredPosts;
        this.postsUpdateSubject.next([...this.posts]);
      });
  }
}
