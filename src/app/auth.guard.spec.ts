import { TestBed } from '@angular/core/testing';
import { CanActivateFn, Router, UrlTree } from '@angular/router';

import { authGuard } from './auth.guard';
import { AuthService, User } from './services/auth.service';

describe('authGuard', () => {
  let router: Router;
  let authService: Partial<AuthService>;

  const executeGuard: CanActivateFn = (...guardParameters) =>
    TestBed.runInInjectionContext(() => authGuard(...guardParameters));

  beforeEach(() => {
    authService = {
      getCurrentUser: () => null
    };

    router = {
      parseUrl: jasmine.createSpy('parseUrl').and.callFake((url: string) => ({ toString: () => url } as unknown as UrlTree))
    } as unknown as Router;

    TestBed.configureTestingModule({
      providers: [
        { provide: AuthService, useValue: authService },
        { provide: Router, useValue: router }
      ]
    });
  });

  it('should redirect anonymous users to login', () => {
    const result = executeGuard({ data: {} } as any, { url: '/citizen/dashboard' } as any);

    expect((result as UrlTree).toString()).toEqual('/login');
    expect(router.parseUrl).toHaveBeenCalledWith('/login');
  });

  it('should redirect unauthorized roles to accueil', () => {
    authService.getCurrentUser = () => ({ role: 'ROLE_CITOYEN', token: 'abc', nom: 'Test', email: 'test@example.com' } as User);

    const result = executeGuard({ data: { roles: ['ROLE_ADMIN'] } } as any, { url: '/admin/dashboard' } as any);

    expect((result as UrlTree).toString()).toEqual('/accueil');
    expect(router.parseUrl).toHaveBeenCalledWith('/accueil');
  });

  it('should allow authorized roles', () => {
    authService.getCurrentUser = () => ({ role: 'ROLE_ADMIN', token: 'abc', nom: 'Test', email: 'test@example.com' } as User);

    const result = executeGuard({ data: { roles: ['ROLE_ADMIN'] } } as any, { url: '/admin/dashboard' } as any);

    expect(result).toBe(true);
  });

  it('should allow authenticated users when no roles are required', () => {
    authService.getCurrentUser = () => ({ role: 'ROLE_CITOYEN', token: 'abc', nom: 'Test', email: 'test@example.com' } as User);

    const result = executeGuard({ data: {} } as any, { url: '/accueil' } as any);

    expect(result).toBe(true);
  });
});
