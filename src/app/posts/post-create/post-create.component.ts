import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { PostsService } from '../posts.service';
import { Router, ActivatedRoute } from '@angular/router';
import { IPost } from 'src/app/interfaces';
import { mimeType } from './mime-type.validator';

type Mode = 'create' | 'edit';

@Component({
  selector: 'app-post-create',
  templateUrl: './post-create.component.html',
  styleUrls: ['./post-create.component.css'],
})
export class PostCreateComponent implements OnInit {
  mode: Mode = 'create';
  post: IPost;
  imagePreview: string;
  form = new FormGroup({
    title: new FormControl('', [Validators.required, Validators.minLength(5)]),
    content: new FormControl('', [
      Validators.required,
      Validators.minLength(5),
    ]),
    image: new FormControl(null, {
      validators: [Validators.required],
      asyncValidators: [mimeType],
    }),
  });
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
            imagePath: '',
          };
          this.form.setValue({
            title: this.post.title,
            content: this.post.content,
          });
        });
      } else {
        this.postsService.isLoading = false;
        this.mode = 'create';
        this.postId = null;
      }
    });
  }

  onImageChanged(evt: Event) {
    const file = (evt.target as HTMLInputElement).files[0];
    this.form.patchValue({ image: file });
    this.form.get('image').updateValueAndValidity();

    const reader = new FileReader();

    reader.onload = () => {
      this.imagePreview = reader.result as string;
    };

    reader.readAsDataURL(file);
  }

  onSavePost() {
    if (this.form.invalid) {
      return;
    }
    if (this.mode === 'create') {
      this.postsService.addPost(
        {
          title: this.form.value.title,
          content: this.form.value.content,
        },
        this.form.value.image
      );
    } else {
      this.postsService.updatePost({
        id: this.postId,
        title: this.form.value.title,
        content: this.form.value.content,
      });
    }
    this.form.reset();
    this.router.navigate(['/']);
  }
}
