import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { User } from '../../shared/interfaces';
import { AuthService } from '../shared/services/auth.service';
import { ActivatedRoute, Params, Router } from '@angular/router';

@Component({
  selector: 'app-login-page',
  templateUrl: './login-page.component.html',
  styleUrls: ['./login-page.component.scss']
})
export class LoginPageComponent implements OnInit {

  form!: FormGroup;
  submitting = false;
  message = '';

  constructor(
    public auth: AuthService,
    private router: Router,
    private route: ActivatedRoute
  ) { }

  ngOnInit(): void {
    this.route.queryParams.subscribe((params: Params) => {
      if (params.loginAgain) {
        this.message = 'Please enter data';
      }
    });
    this.form = new FormGroup({
      email: new FormControl(null, [
        Validators.required,
        Validators.email
      ]),
      password: new FormControl(null, [
        Validators.required,
        Validators.minLength(6)
      ])
    });
  }

  submit(): void {
    if (this.form.invalid) {
      return;
    }
    this.submitting = true;
    const user: User = this.form.value;
    this.auth.login(user).subscribe(() => {
      this.form.reset();
      this.router.navigate(['/admin', 'dashboard']);
      this.submitting = false;
    }, () => {
      this.submitting = false;
    });
  }
}
