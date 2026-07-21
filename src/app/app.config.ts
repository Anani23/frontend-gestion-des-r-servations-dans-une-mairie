import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { ApplicationConfig } from '@angular/core';
import { provideRouter } from '@angular/router';

import { routes } from './app.routes';
// CORRECTION : On importe le bon intercepteur JWT
import { jwtInterceptor } from './interceptors/jwt.interceptor';

export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(routes),
    provideHttpClient(
      // CORRECTION : On utilise uniquement jwtInterceptor ici
      withInterceptors([jwtInterceptor])
    )
  ]
};