import { Component, OnInit, OnDestroy } from '@angular/core';
import { PostsService } from '../posts.service';
import { IPost } from '../../interfaces';
import { Subscription } from 'rxjs';
import { PageEvent } from '@angular/material/paginator';
import { AuthService } from 'src/app/auth/auth.service';

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
  totalPosts = 10;
  pageSize = 2;
  currentPage = 1;
  pageSizeOptions = [1, 2, 5, 10];
  isAuth = false;
  authSub: Subscription;
  userId: string;

  constructor(
    public postsService: PostsService,
    public authService: AuthService
  ) {}

  ngOnInit() {
    this.userId = this.authService.getUserId();
    this.postsService.getPosts(this.pageSize, this.currentPage);
    this.postsSub = this.postsService.updatePosts().subscribe((postsData) => {
      this.posts = postsData.posts;
      this.totalPosts = postsData.totalPosts;
    });
    this.isAuth = this.authService.isAuth;
    this.authSub = this.authService
      .getAuthStatusListener()
      .subscribe((isLoggedIn) => {
        this.isAuth = isLoggedIn;
        this.userId = this.authService.getUserId();
      });
  }

  ngOnDestroy() {
    this.postsSub.unsubscribe();
    this.authSub.unsubscribe();
  }

  setIndex(i: number) {
    this.currentIndex = i;
  }

  togglePanelOpened() {
    this.panelOpened = !this.panelOpened;
  }

  onDeletePost(id: string) {
    this.postsService.deletePost(id).subscribe(() => {
      this.postsService.getPosts(this.pageSize, this.currentPage);
    });
  }

  onPageEvent({ pageIndex, pageSize }: PageEvent) {
    this.currentPage = pageIndex + 1;
    this.pageSize = pageSize;
    this.postsService.getPosts(this.pageSize, this.currentPage);
  }
}
