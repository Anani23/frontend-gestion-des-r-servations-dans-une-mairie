import { HttpInterceptorFn } from '@angular/common/http';

export const jwtInterceptor: HttpInterceptorFn = (req, next) => {
  // On récupère le token stocké lors du login
  const token = localStorage.getItem('auth_token');

  // Si le token existe, on clone la requête pour ajouter le header Authorization
  if (token) {
    const authReq = req.clone({
      setHeaders: {
        Authorization: `Bearer ${token}`
      }
    });
    return next(authReq);
  }

  // Sinon, on laisse passer la requête telle quelle (ex: pour le catalogue public)
  return next(req);
};