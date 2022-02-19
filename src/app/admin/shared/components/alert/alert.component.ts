import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { Alert, AlertService } from '../../services/alert.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-alert',
  templateUrl: './alert.component.html',
  styleUrls: ['./alert.component.scss']
})
export class AlertComponent implements OnInit, OnDestroy {

  @Input() delay = 5000;

  public alert!: Alert;

  alertSubscription!: Subscription;

  constructor(private alertService: AlertService) { }

  ngOnInit(): void {
    this.alertSubscription = this.alertService.alert$.subscribe(alert => {
      this.alert = alert;

      const timeout = setTimeout(() => {
        this.alert.text = '';
        clearTimeout(timeout);
      }, this.delay);
    });
  }

  ngOnDestroy(): void {
    if (this.alertSubscription) {
      this.alertSubscription.unsubscribe();
    }
  }
}
