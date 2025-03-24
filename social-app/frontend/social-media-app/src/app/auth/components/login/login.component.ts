import { Component, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [ReactiveFormsModule, RouterLink, CommonModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss',
})
export class LoginComponent implements OnInit {
  loginForm!: FormGroup;
  isSubmitting = false;
  errorMessage = '';

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.initForm();
  }

  initForm(): void {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
    });
  }

  onSubmit(): void {
    if (this.loginForm.invalid) {
      return;
    }

    this.isSubmitting = true;
    this.errorMessage = '';

    const { email, password } = this.loginForm.value;

    console.log('Attempting login with:', { email, password: '***' });

    this.authService.login(email, password).subscribe({
      next: (response) => {
        console.log('Login successful:', response);
        this.isSubmitting = false;
        // Navigate to dashboard on successful login
        this.router.navigate(['/dashboard']);
      },
      error: (error) => {
        console.error('Login error:', error);
        this.isSubmitting = false;

        if (error.status === 401) {
          this.errorMessage = 'Invalid email or password. Please try again.';
        } else if (error.status === 0) {
          this.errorMessage = 'Network error. Please check your connection.';
        } else {
          this.errorMessage =
            error?.message || 'Login failed. Please try again.';
        }
      },
    });
  }

  // Helper methods for template
  get email() {
    return this.loginForm.get('email');
  }
  get password() {
    return this.loginForm.get('password');
  }
}
