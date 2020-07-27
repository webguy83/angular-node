import { Component, EventEmitter, Output } from '@angular/core';
import { IPost } from '../../interfaces';

@Component({
  selector: 'app-post-create',
  templateUrl: './post-create.component.html',
  styleUrls: ['./post-create.component.css'],
})
export class PostCreateComponent {
  title = '';
  content = '';

  @Output() postCreated = new EventEmitter<IPost>();

  onAddPost() {
    this.postCreated.emit({
      title: this.title,
      content: this.content,
    });
  }
}
