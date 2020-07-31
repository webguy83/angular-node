import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { PostsService } from '../posts.service';
import { Router, ActivatedRoute } from '@angular/router';
import { IPost } from 'src/app/interfaces';

type Mode = 'create' | 'edit';

@Component({
  selector: 'app-post-create',
  templateUrl: './post-create.component.html',
  styleUrls: ['./post-create.component.css'],
})
export class PostCreateComponent implements OnInit {
  formName: '';
  formContent: '';
  mode: Mode = 'create';
  post: IPost;
  private postId: string;

  constructor(
    public postsService: PostsService,
    private router: Router,
    private route: ActivatedRoute
  ) {}

  ngOnInit() {
    this.postsService.isLoading = true;
    this.route.paramMap.subscribe((paramMap) => {
      if (paramMap.has('id')) {
        this.mode = 'edit';
        // get the specific post
        this.postId = paramMap.get('id');
        this.postsService.getPost(this.postId).subscribe((res) => {
          this.postsService.isLoading = false;
          this.post = {
            id: res.post._id,
            title: res.post.title,
            content: res.post.content,
          };
        });
      } else {
        this.postsService.isLoading = false;
        this.mode = 'create';
        this.postId = null;
      }
    });
  }

  onSavePost(form: NgForm) {
    if (form.invalid) {
      return;
    }
    if (this.mode === 'create') {
      this.postsService.addPost({
        title: form.value.title,
        content: form.value.content,
      });
    } else {
      this.postsService.updatePost({
        id: this.postId,
        title: form.value.title,
        content: form.value.content,
      });
    }
    form.resetForm();
    this.router.navigate(['/']);
  }
}
