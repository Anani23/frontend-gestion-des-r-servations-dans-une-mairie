import { HttpInterceptorFn } from '@angular/common/http';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const token = localStorage.getItem('auth_token');

  // Définition des endpoints publics (pas besoin de token)
  const publicEndpoints = [
    '/api/auth/login',
    '/api/auth/register',
    '/api/admin/services-municipaux',
    '/api/admin/patrimoine/biens'
  ];

  const getRequestPath = (url: string): string => {
    try {
      return new URL(url).pathname;
    } catch {
      return url;
    }
  };

  const requestPath = getRequestPath(req.url);
  const isPublic = publicEndpoints.some(endpoint =>
    requestPath === endpoint || requestPath.startsWith(`${endpoint}/`)
  );

  // On injecte le token uniquement s'il existe et que la route n'est pas publique
  if (token && !isPublic) {
    const authReq = req.clone({
      setHeaders: {
        Authorization: `Bearer ${token}`
      }
    });
    return next(authReq);
  }

  return next(req);
};
