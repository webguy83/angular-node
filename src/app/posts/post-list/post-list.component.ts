import { Component, Input } from '@angular/core';
import { IPost } from '../../interfaces';

@Component({
  selector: 'app-post-list',
  templateUrl: './post-list.component.html',
  styleUrls: ['./post-list.component.css'],
})
export class PostListComponent {
  panelOpened = false;
  currentIndex: number | null = null;

  setIndex(i: number) {
    this.currentIndex = i;
  }

  togglePanelOpened() {
    this.panelOpened = !this.panelOpened;
  }

  @Input() posts: IPost[] = [
    // {
    //   title: 'My first post',
    //   content: 'This is some funny post okay yayyya',
    // },
    // {
    //   title: 'My second post',
    //   content: 'hazzzah hahah okay I will be there',
    // },
    // {
    //   title: 'My second post',
    //   content: 'This is a bizarre kind of post!',
    // },
  ];
}
