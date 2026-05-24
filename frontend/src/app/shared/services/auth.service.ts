import { Injectable, inject, signal } from '@angular/core';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { Observable, of, map, catchError } from 'rxjs';
import { environment } from '../../../environments/environment';

export interface User {
  id: number;
  name: string;
  email: string;
  role: 'CUSTOMER' | 'ADMIN' | 'SME';
  meterNumber?: string;
  consumerNumber?: string;
  token: string;
}

export interface LoginResponse {
  token: string;
  role: string;
  userId: number;
  username: string;
  consumerId?: number;
}

// Mocks removed

@Injectable({ providedIn: 'root' })
export class AuthService {
  private http = inject(HttpClient);
  private router = inject(Router);

  currentUser = signal<User | null>(this.loadUser());

  login(email: string, password: string, role: string): Observable<User | null> {
    return this.http.post<LoginResponse>(`${environment.apiUrl}/auth/login`, { username: email, password }).pipe(
      map(res => {
        const user: User = {
          id: res.userId,
          name: res.username,
          email: email, // Use email as fallback
          role: res.role as User['role'],
          token: res.token,
          consumerNumber: res.consumerId ? String(res.consumerId) : undefined, // Backend returns ID
        };
        this.storeUser(user);
        return user;
      }),
      catchError(() => of(null))
    );
  }

  register(data: { name: string; email: string; password: string }): Observable<any> {
    return this.http.post(`${environment.apiUrl}/auth/register`, {
      username: data.name,
      email: data.email,
      phone: '9999999999', // Placeholder since UI doesn't ask for it
      password: data.password
    });
  }

  logout(): void {
    localStorage.removeItem('vs_token');
    localStorage.removeItem('vs_user');
    this.currentUser.set(null);
    this.router.navigate(['/auth/login']);
  }

  isLoggedIn(): boolean {
    return !!localStorage.getItem('vs_token');
  }

  getToken(): string | null {
    return localStorage.getItem('vs_token');
  }

  getRole(): string | null {
    const user = this.getCurrentUser();
    return user ? user.role : null;
  }

  getCurrentUser(): User | null {
    if (this.currentUser()) return this.currentUser();
    return this.loadUser();
  }

  private storeUser(user: User): void {
    localStorage.setItem('vs_token', user.token);
    localStorage.setItem('vs_user', JSON.stringify(user));
    this.currentUser.set(user);
  }

  private loadUser(): User | null {
    const raw = localStorage.getItem('vs_user');
    return raw ? JSON.parse(raw) : null;
  }
}
