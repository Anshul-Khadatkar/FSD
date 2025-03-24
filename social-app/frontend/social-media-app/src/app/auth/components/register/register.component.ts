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
  selector: 'app-register',
  standalone: true,
  imports: [ReactiveFormsModule, RouterLink, CommonModule],
  templateUrl: './register.component.html',
  styleUrl: './register.component.scss',
})
export class RegisterComponent implements OnInit {
  registerForm!: FormGroup;
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
    this.registerForm = this.fb.group(
      {
        name: ['', [Validators.required, Validators.minLength(3)]],
        email: ['', [Validators.required, Validators.email]],
        password: ['', [Validators.required, Validators.minLength(6)]],
        confirmPassword: ['', [Validators.required]],
      },
      {
        validators: this.passwordMatchValidator,
      }
    );
  }

  passwordMatchValidator(form: FormGroup): null | { mismatch: boolean } {
    const passwordControl = form.get('password');
    const confirmPasswordControl = form.get('confirmPassword');

    if (!passwordControl || !confirmPasswordControl) {
      return null;
    }

    const password = passwordControl.value;
    const confirmPassword = confirmPasswordControl.value;

    return password === confirmPassword ? null : { mismatch: true };
  }

  onSubmit(): void {
    if (this.registerForm.invalid) {
      return;
    }

    this.isSubmitting = true;
    this.errorMessage = '';

    const { name, email, password } = this.registerForm.value;

    console.log('Submitting registration form:', {
      name,
      email,
      password: '****',
    });

    this.authService.register(name, email, password).subscribe({
      next: (response) => {
        console.log('Registration successful', response);
        this.isSubmitting = false;

        // Show success message before redirecting
        setTimeout(() => {
          this.router.navigate(['/dashboard']);
        }, 1000);
      },
      error: (error) => {
        console.error('Registration error:', error);
        this.isSubmitting = false;

        if (typeof error === 'string') {
          this.errorMessage = error;
        } else if (error instanceof Error) {
          this.errorMessage = error.message;
        } else if (error?.status === 400) {
          this.errorMessage = 'User with this email already exists';
        } else {
          this.errorMessage = 'Registration failed. Please try again later.';
        }
      },
    });
  }

  // Helper methods for template
  get name() {
    return this.registerForm.get('name');
  }
  get email() {
    return this.registerForm.get('email');
  }
  get password() {
    return this.registerForm.get('password');
  }
  get confirmPassword() {
    return this.registerForm.get('confirmPassword');
  }
}
