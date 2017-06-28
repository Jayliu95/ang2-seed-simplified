import {Component} from '@angular/core';
import { DatePickerOptions } from 'ng2-datepicker';
import {Post} from "../../models/post";
import {PostService} from "../../services/post.service";

@Component({
  moduleId: module.id,
  selector: 'home',
  templateUrl: 'home.component.html',
  styleUrls: [
    'style.css']
})

export class HomeComponent{
  selectedPost: Post;
  options: DatePickerOptions;

  constructor(
    private _postService : PostService
  ) {
    this.selectedPost = new Post;
    this.options = new DatePickerOptions();
  }

  submitPost(){
    this._postService.createPost(this.selectedPost)
      .subscribe(
        data => {
          //this.alertService.success('Stock added successfully', true);
          console.log(data);
        },
        error => {
          //this.alertService .error(error._body);
          console.log(error);
        });
  }



}
