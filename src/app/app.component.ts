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
    this.storePosts.push(post);
  }
}
