import { Component } from '@angular/core';
import { NgForm } from '@angular/forms';
import { PostsService } from '../posts.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-post-create',
  templateUrl: './post-create.component.html',
  styleUrls: ['./post-create.component.css'],
})
export class PostCreateComponent {
  formName: '';
  formContent: '';

  constructor(public postsService: PostsService, private router: Router) {}

  onAddPost(form: NgForm) {
    if (form.invalid) {
      return;
    }
    this.postsService.addPost({
      title: form.value.title,
      content: form.value.content,
    });
    form.resetForm();
    this.router.navigate(['/']);
  }
}
