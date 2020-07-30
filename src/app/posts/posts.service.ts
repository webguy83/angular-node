import { Injectable } from '@angular/core';
import { IPost } from '../interfaces';
import { Subject } from 'rxjs';
import { map } from 'rxjs/operators';
import { HttpClient } from '@angular/common/http';

interface IPostLoadedData {
  _id: string;
  __v: number;
  title: string;
  content: string;
}

@Injectable({ providedIn: 'root' })
export class PostsService {
  posts: IPost[] = [];
  postsUpdateSubject = new Subject<IPost[]>();

  constructor(private http: HttpClient) {}

  getPosts() {
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
            };
          });
        })
      )
      .subscribe((posts) => {
        this.posts = posts;
        this.postsUpdateSubject.next([...this.posts]);
      });
  }

  updatePosts() {
    return this.postsUpdateSubject.asObservable();
  }

  addPost(post: IPost) {
    this.http
      .post<{ message: string; postId: string }>(
        'http://localhost:3000/posts',
        post
      )
      .subscribe((res) => {
        post.id = res.postId;
        this.posts.push(post);
        this.postsUpdateSubject.next([...this.posts]);
      });
  }

  deletePost(id: string) {
    this.http
      .delete<{ message: string }>(`http://localhost:3000/posts/${id}`)
      .subscribe(() => {
        const filteredPosts = this.posts.filter((post) => {
          return post.id !== id;
        });
        this.posts = filteredPosts;
        this.postsUpdateSubject.next([...this.posts]);
      });
  }
}
