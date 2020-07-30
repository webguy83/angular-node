import { Component, OnInit, OnDestroy } from '@angular/core';
import { PostsService } from '../posts.service';
import { IPost } from '../../interfaces';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-post-list',
  templateUrl: './post-list.component.html',
  styleUrls: ['./post-list.component.css'],
})
export class PostListComponent implements OnInit, OnDestroy {
  panelOpened = false;
  currentIndex: number | null = null;
  postsSub: Subscription;
  posts: IPost[] = [];

  constructor(public postsService: PostsService) {}

  ngOnInit() {
    this.postsService.getPosts();
    this.postsSub = this.postsService.updatePosts().subscribe((posts) => {
      this.posts = posts;
    });
  }

  ngOnDestroy() {
    this.postsSub.unsubscribe();
  }

  setIndex(i: number) {
    this.currentIndex = i;
  }

  togglePanelOpened() {
    this.panelOpened = !this.panelOpened;
  }

  onDeletePost(id: string) {
    this.postsService.deletePost(id);
  }
}
