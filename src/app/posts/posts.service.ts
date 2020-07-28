import { Injectable } from '@angular/core';
import { IPost } from '../interfaces';
import { Subject } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class PostsService {
  posts: IPost[] = [];
  postsUpdateSubject = new Subject<IPost[]>();

  // getPosts() {
  //   return [...this.posts];
  // }

  updatePosts() {
    return this.postsUpdateSubject.asObservable();
  }

  addPost(post: IPost) {
    this.posts.push(post);
    this.postsUpdateSubject.next([...this.posts]);
  }
}
