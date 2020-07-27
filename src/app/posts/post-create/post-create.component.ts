import { Component, EventEmitter, Output } from '@angular/core';
import { IPost } from '../../interfaces';
import { NgForm } from '@angular/forms';

@Component({
  selector: 'app-post-create',
  templateUrl: './post-create.component.html',
  styleUrls: ['./post-create.component.css'],
})
export class PostCreateComponent {
  @Output() postCreated = new EventEmitter<IPost>();
  formName: '';
  formContent: '';

  onAddPost(form: NgForm) {
    if (form.invalid) {
      return;
    }
    console.log(form);
    this.postCreated.emit({
      title: form.value.title,
      content: form.value.content,
    });
  }
}
