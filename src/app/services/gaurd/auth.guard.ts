// auth.guard.ts
import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean {
    if (this.isAuthenticated()) {
      return true;
    } else {
      // Redirect to the login page or any other route
      this.router.navigate(['']);
      return false;
    }
  }

  private isAuthenticated(): boolean {
    // Check if the token exists in localStorage or implement your own logic
    const token = localStorage.getItem('token');
    return !!token;
  }

  constructor(private router: Router) { }
}
