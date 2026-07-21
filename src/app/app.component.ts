import { Component, DestroyRef, inject, OnInit } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { Title } from '@angular/platform-browser';
import { ActivatedRoute, NavigationEnd, Router, RouterOutlet } from '@angular/router';
import { filter } from 'rxjs/operators';

import { ColorModeService } from '@coreui/angular';
import { IconSetService } from '@coreui/icons-angular';
import { iconSubset } from './icons/icon-subset';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet],
  template: '<router-outlet />'
})
export class AppComponent implements OnInit {
  // 🔥 Titre par défaut
  private readonly defaultTitle = 'Plateforme de gestion municipale - Mairie';
  readonly title = this.defaultTitle;

  readonly #destroyRef: DestroyRef = inject(DestroyRef);
  readonly #activatedRoute: ActivatedRoute = inject(ActivatedRoute);
  readonly #router: Router = inject(Router);
  readonly #titleService: Title = inject(Title);

  readonly #colorModeService: ColorModeService = inject(ColorModeService);
  readonly #iconSetService: IconSetService = inject(IconSetService);

  constructor() {
    // Définit le titre global par défaut
    this.#titleService.setTitle(this.defaultTitle);

    // 🔥 Setup CoreUI Icons
    this.#iconSetService.icons = { ...iconSubset };

    // 🔥 Setup Color Mode
    this.#colorModeService.localStorageItemName.set('coreui-free-angular-admin-template-theme-default');
    this.#colorModeService.eventName.set('ColorSchemeChange');
  }

  ngOnInit(): void {
    // 🔹 Gestion du titre dynamique selon la route
    this.#router.events.pipe(
      filter(evt => evt instanceof NavigationEnd),
      takeUntilDestroyed(this.#destroyRef)
    ).subscribe(() => {
      let route = this.#activatedRoute;
      while (route.firstChild) route = route.firstChild;
      const pageTitle = route.snapshot.data['title'] || this.defaultTitle;
      this.#titleService.setTitle(pageTitle);
    });

    // 🔹 Gestion du thème via query param ?theme=dark|light|auto
    this.#activatedRoute.queryParams.pipe(
      filter(params => !!params['theme']),
      takeUntilDestroyed(this.#destroyRef)
    ).subscribe(params => {
      const theme = String(params['theme']).toLowerCase();
      if (['dark', 'light', 'auto'].includes(theme)) {
        this.#colorModeService.colorMode.set(theme);
      }
    });
  }
}