import { Injectable } from '@angular/core';
import { IPost } from '../interfaces';
import { Subject, Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';

interface IPostLoadedData {
  _id: string;
  __v: number;
  title: string;
  content: string;
  imagePath: string;
  creator: string;
}

interface IPostDataTotalPosts {
  posts: IPost[];
  totalPosts: number;
}

@Injectable({ providedIn: 'root' })
export class PostsService {
  posts: IPost[] = [];
  postsUpdateSubject = new Subject<IPostDataTotalPosts>();
  isLoading = false;

  constructor(private http: HttpClient, private router: Router) {}

  getPosts(pageSize: number, currentPage: number) {
    this.isLoading = true;
    this.http
      .get<{
        message: string;
        posts: IPostLoadedData[];
        totalPosts: number;
        creator: string;
      }>(
        `http://localhost:3000/posts?pagesize=${pageSize}&currentpage=${currentPage}`
      )
      .pipe<IPostDataTotalPosts>(
        map((postData) => {
          return {
            posts: postData.posts.map<IPost>((post) => {
              return {
                id: post._id,
                title: post.title,
                content: post.content,
                imagePath: post.imagePath,
                creator: post.creator,
              };
            }),
            totalPosts: postData.totalPosts,
          };
        })
      )
      .subscribe((postsData) => {
        this.isLoading = false;
        this.posts = postsData.posts;
        this.postsUpdateSubject.next({
          posts: [...this.posts],
          totalPosts: postsData.totalPosts,
        });
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
    this.isLoading = true;
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
        this.isLoading = false;
        this.router.navigate(['/']);
      });
  }

  updatePost(post: IPost, imageFile: File) {
    const postData = new FormData();
    postData.append('id', post.id);
    postData.append('title', post.title);
    postData.append('content', post.content);
    postData.append('image', imageFile);
    this.http
      .put<{ message: string }>(
        `http://localhost:3000/posts/${post.id}`,
        postData
      )
      .subscribe(() => {
        this.router.navigate(['/']);
      });
  }

  deletePost(id: string) {
    return this.http.delete<{ message: string }>(
      `http://localhost:3000/posts/${id}`
    );
  }
}
