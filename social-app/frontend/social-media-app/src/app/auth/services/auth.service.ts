import { Injectable } from '@angular/core';
import {
  HttpClient,
  HttpErrorResponse,
  HttpHeaders,
} from '@angular/common/http';
import {
  Observable,
  BehaviorSubject,
  throwError,
  tap,
  catchError,
  retry,
} from 'rxjs';
import { TokenService } from './token.service';
import { Router } from '@angular/router';

export interface User {
  id: number;
  name: string;
  email: string;
}

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private userSubject = new BehaviorSubject<User | null>(null);
  public user$ = this.userSubject.asObservable();

  // Changed to relative URL to work with proxy configuration
  private apiUrl = '/api';

  constructor(
    private http: HttpClient,
    private tokenService: TokenService,
    private router: Router
  ) {
    this.loadUser();
    console.log('AuthService initialized with API URL:', this.apiUrl);
  }

  private handleError(error: HttpErrorResponse) {
    console.error('API Error:', error);

    if (error.status === 0) {
      console.error('Network error details:', {
        message: error.message,
        name: error.name,
        error: error.error,
      });
      return throwError(
        () => new Error('Network error - please check your connection')
      );
    }

    if (error.status === 404) {
      return throwError(() => new Error('API endpoint not found'));
    }

    const errorMessage = error.error?.message || 'Server error';
    return throwError(() => new Error(errorMessage));
  }

  loadUser(): void {
    const token = this.tokenService.getToken();
    if (token) {
      this.getCurrentUser().subscribe({
        next: (user) => this.userSubject.next(user),
        error: () => {
          this.tokenService.removeToken();
          this.userSubject.next(null);
        },
      });
    }
  }

  getCurrentUser(): Observable<User> {
    return this.http
      .get<User>(`${this.apiUrl}/auth/me`)
      .pipe(catchError(this.handleError.bind(this)));
  }

  login(
    email: string,
    password: string
  ): Observable<{ token: string; user: User }> {
    console.log('Login request to:', `${this.apiUrl}/auth/login`);
    return this.http
      .post<{ token: string; user: User }>(
        `${this.apiUrl}/auth/login`,
        {
          email,
          password,
        },
        {
          headers: new HttpHeaders({
            'Content-Type': 'application/json',
          }),
        }
      )
      .pipe(
        tap((response) => {
          this.tokenService.saveToken(response.token);
          this.userSubject.next(response.user);
        }),
        catchError(this.handleError.bind(this))
      );
  }

  register(
    name: string,
    email: string,
    password: string
  ): Observable<{ token: string; user: User }> {
    console.log('Register request to:', `${this.apiUrl}/auth/register`);
    console.log('Register payload:', { name, email, password: '***' });

    return this.http
      .post<{ token: string; user: User }>(
        `${this.apiUrl}/auth/register`,
        {
          name,
          email,
          password,
        },
        {
          headers: new HttpHeaders({
            'Content-Type': 'application/json',
          }),
        }
      )
      .pipe(
        retry(1), // Retry once before failing
        tap((response) => {
          console.log('Register success response:', response);
          this.tokenService.saveToken(response.token);
          this.userSubject.next(response.user);
        }),
        catchError(this.handleError.bind(this))
      );
  }

  logout(): void {
    this.tokenService.removeToken();
    this.userSubject.next(null);
    this.router.navigate(['/login']);
  }

  isAuthenticated(): boolean {
    return this.tokenService.getToken() !== null;
  }
}
