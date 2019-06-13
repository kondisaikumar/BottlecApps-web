import { Injectable } from '@angular/core';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor(private router: Router) { }

  // Set User Secure Token
  setSessionToken(secure_token: string) {
    sessionStorage.setItem('SessionId', secure_token);
  }

  // Set User Secure Token
  getSessionToken() {
    return sessionStorage.getItem('SessionId');
  }

  // Set User Secure Token
  setUserId(userId: number) {
    sessionStorage.setItem('UserId', userId.toString());
  }

  // Set User Secure Token
  getUserId() {
    return sessionStorage.getItem('UserId');
  }

  // Check User is LoggedIn or not!
  isLoggednIn() {
    return (this.getUserId() !== '0');
  }

  // Logout method
  logout() {
    sessionStorage.removeItem('SessionId');
    sessionStorage.removeItem('UserId');
    this.router.navigate(['/home']);
  }
}
