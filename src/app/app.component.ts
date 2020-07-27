import { Component } from '@angular/core';
import { IPost } from './interfaces';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent {
  storePosts: IPost[] = [];

  addStorePosts(post: IPost) {
    if (post.title.length >= 5 && post.content.length >= 10) {
      this.storePosts.push(post);
    }
  }
}
