import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { FbAuthResponse, User } from '../../../shared/interfaces';
import { Observable, Subject, throwError } from 'rxjs';
import { environment } from '../../../../environments/environment';
import { catchError, tap } from 'rxjs/operators';

@Injectable()
export class AuthService {

  public error$: Subject<string> = new Subject<string>();
  constructor(private http: HttpClient) {
  }

  get token(): string | null {
    const expDateString = localStorage.getItem('fb-token-exp') ?? '';
    const expDate = new Date(expDateString);
    if (new Date() > expDate) {
      this.logout();
      return null;
    }
    return localStorage.getItem('fb-token');
  }

  login(user: User): Observable<any> {
    user.returnSecureToken = true;
    return this.http.post(`https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=${environment.apiKey}`, user)
      .pipe(
        tap(this.setToken),
        catchError(this.handleError.bind(this))
      );
  }

  logout(): void {
    this.setToken(null);
  }

  isAuthenticated(): boolean {
    return !!this.token;
  }

  private setToken(response: FbAuthResponse | any): void {
    if (response) {
      const expDate = new Date(new Date().getTime() + (Number(response.expiresIn) * 1000));
      localStorage.setItem('fb-token', response.idToken);
      localStorage.setItem('fb-token-exp', expDate.toString());
    } else {
      localStorage.clear();
    }
  }

  private handleError(error: HttpErrorResponse): Observable<HttpErrorResponse> {
    const { message } = error.error.error;
    if (message) {
      this.error$.next(message);
    }
    return throwError(error);
  }
}
