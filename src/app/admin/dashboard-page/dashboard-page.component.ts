import { Component, OnInit, OnDestroy } from '@angular/core';
import { PostsService } from '../../shared/posts.service';
import { Post } from '../../shared/interfaces';
import { Subscription } from 'rxjs';
import {AlertService} from '../shared/services/alert.service';

@Component({
  selector: 'app-dashboard-page',
  templateUrl: './dashboard-page.component.html',
  styleUrls: ['./dashboard-page.component.scss']
})
export class DashboardPageComponent implements OnInit, OnDestroy {

  posts: Post[] = [];
  postsSubscription!: Subscription;
  removePostSubscription!: Subscription;
  postLoading = false;
  search = '';

  constructor(
    private postService: PostsService,
    private alertService: AlertService
  ) { }

  ngOnInit(): void {
    this.postLoading = true;
    this.postsSubscription = this.postService.getAll().subscribe(posts => {
      this.posts = posts;
      this.postLoading = false;
    }, () => {
      this.postLoading = false;
    });
  }

  ngOnDestroy(): void {
    if (this.postsSubscription) {
      this.postsSubscription.unsubscribe();
    }
    if (this.removePostSubscription) {
      this.removePostSubscription.unsubscribe();
    }
  }

  remove(id: string | undefined): void {
    if (id) {
      this.removePostSubscription = this.postService.delete(id).subscribe(() => {
        this.posts = this.posts.filter(post => post.id !== id);
        this.alertService.success('Post removed successfully');
      }, () => {
        this.alertService.danger('Post has not removed');
      });
    }
  }
}
