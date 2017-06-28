import {Injectable} from "@angular/core";
import {Http, Headers, Response, RequestOptions} from "@angular/http";
import {Post} from "../models/post";

import {Observable} from 'rxjs/Rx';
import 'rxjs/Observable';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';

@Injectable()
export class PostService {
  constructor(private _http: Http) {

  }

  getposts(id: number){
    return this._http.get('/api/v1/'+id+'/posts').map((response: Response) => response.json());
  }

  getPost(id: number, postId: string){
    return this._http.get('/api/v1/'+id+'/posts/'+postId).map((response: Response) => response.json());
  }


  createPost(post: Post){
    let req = {
      'post': post
    };
    console.log(req);
    return this._http.post('/api/v1/posts', req);
  }

  editPost(id: number, oldpost: Object, newpost: Object){
    let req = {
      '_id': id,
      'oldpost':oldpost,
      'newpost': newpost
    };
    return this._http.put('/api/v1/'+id+'/posts/'+oldpost['postSymbol'], req)
      .map((response: Response) => {response.json(); });
  }

  deletePost(id: number, post: Object){
    return this._http.delete('/api/v1/'+id+'/posts/'+post['postSymbol'])
      .map((response: Response) => {console.log(response); response.json(); });
  }

}
