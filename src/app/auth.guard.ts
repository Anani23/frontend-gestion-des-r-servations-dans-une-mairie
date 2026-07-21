import { inject } from '@angular/core';
import { CanActivateFn, Router, UrlTree } from '@angular/router';
import { AuthService } from './services/auth.service';

export const authGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);
  const user = authService.getCurrentUser();

  // 1. Vérification de connexion de base
  if (!user || !user.token) {
    return router.parseUrl('/login');
  }

  // 2. Vérification des rôles (si définis dans app.routes.ts)
  const expectedRoles: string[] | undefined = route.data?.['roles'];
  if (expectedRoles && !expectedRoles.includes(user.role)) {
    return router.parseUrl('/accueil');
  }

  return true;
};