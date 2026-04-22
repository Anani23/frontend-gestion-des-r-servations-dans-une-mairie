import { Routes as NgRoutes } from '@angular/router';
import { DefaultLayoutComponent } from './layout/default-layout/default-layout.component';

export const routes: NgRoutes = [
  {
    path: '',
    component: DefaultLayoutComponent,
    children: [
      { path: '', redirectTo: 'accueil', pathMatch: 'full' },

      // ========================
      // 🌍 PUBLIC
      // ========================
      {
        path: 'accueil',
        loadComponent: () =>
          import('./views/accueil/page-accueil/page-accueil.component')
            .then(m => m.PageAccueilComponent),
        data: { title: 'Accueil - Plateforme municipale' }
      },
      {
        path: 'actualites',
        loadComponent: () =>
          import('./views/actualites/liste-actualites/liste-actualites.component')
            .then(m => m.ListeActualitesComponent),
        data: { title: 'Actualités' }
      },
      {
        path: 'contact',
        loadComponent: () =>
          import('./views/contact/contact-mairie/contact-mairie.component')
            .then(m => m.ContactMairieComponent),
        data: { title: 'Contact' }
      },
      {
        path: 'maire',
        loadComponent: () =>
          import('./views/mairie/maire/maire.component')
            .then(m => m.MaireComponent),
        data: { title: 'Maire' }
      },
      {
        path: 'organisation',
        loadComponent: () =>
          import('./views/mairie/organisation/organisation.component')
            .then(m => m.OrganisationComponent),
        data: { title: 'Organisation' }
      },

      // ========================
      // 🏛️ BIENS (ANCIEN SYSTEME)
      // ========================
      {
        path: 'biens',
        loadComponent: () =>
          import('./bien-mairie/bien-mairie.component')
            .then(m => m.BienMairieComponent),
        data: { title: 'Biens de la mairie' }
      },

      // ========================
      // 🗂️ CATEGORIES DE BIENS (NOUVEAU SYSTEME)
      // ========================
      {
        path: 'categories-biens',
        loadComponent: () =>
          import('./pages/categories/categories.component')
            .then(m => m.CategoriesComponent),
        data: { title: 'Catégories de biens' }
      },
      {
        path: 'categories-biens/:id',
        loadComponent: () =>
          import('./pages/sous-categories/sous-categories.component')
            .then(m => m.SousCategoriesComponent),
        data: { title: 'Sous-catégories' }
      },
      {
        path: 'biens/categorie/:id',
        loadComponent: () =>
          import('./pages/bien-par-categorie/bien-par-categorie.component')
            .then(m => m.BienParCategorieComponent),
        data: { title: 'Biens par catégorie' }
      },

      // ========================
      // 🔐 AUTHENTIFICATION
      // ========================
      {
        path: 'login',
        loadComponent: () =>
          import('./auth/login/login.component')
            .then(m => m.LoginComponent),
        data: { title: 'Connexion' }
      },
      {
        path: 'register',
        loadComponent: () =>
          import('./auth/register/register.component')
            .then(m => m.RegisterComponent),
        data: { title: 'Inscription' }
      },

      // ========================
      // 👤 CITOYEN
      // ========================
      {
        path: 'citizen',
        children: [
          {
            path: '',
            loadComponent: () =>
              import('./citizen/dashboard/dashboard.component')
                .then(m => m.CitizenDashboardComponent),
            data: { title: 'Espace citoyen' }
          },
          {
            path: 'prendre-rdv',
            loadComponent: () =>
              import('./citizen/prendre-rdv/prendre-rdv.component')
                .then(m => m.PrendreRdvComponent)
          },
          {
            path: 'mes-rdv',
            loadComponent: () =>
              import('./citizen/mes-rdv/mes-rdv.component')
                .then(m => m.MesRdvComponent)
          },
          {
            path: 'dossiers',
            loadComponent: () =>
              import('./citizen/dossiers/liste-dossiers/liste-dossiers.component')
                .then(m => m.ListeDossiersComponent)
          },
          {
            path: 'dossier/create',
            loadComponent: () =>
              import('./citizen/dossiers/create-dossier/create-dossier.component')
                .then(m => m.CreateDossierComponent)
          },
          {
            path: 'mes-reservations',
            loadComponent: () =>
              import('./citizen/reservations/reservations.component')
                .then(m => m.ReservationsComponent)
          },
          {
            path: 'create-reservation',
            loadComponent: () =>
              import('./citizen/create-reservation/create-reservation.component')
                .then(m => m.CreateReservationComponent)
          }
        ]
      },

      // ========================
      // 🏢 AGENT
      // ========================
      {
        path: 'agent',
        children: [
          {
            path: '',
            loadComponent: () =>
              import('./agent/dashboard/dashboard.component')
                .then(m => m.DashboardComponent)
          },
          {
            path: 'rdv',
            loadComponent: () =>
              import('./agent/gestion-rdv/gestion-rdv.component')
                .then(m => m.GestionRdvComponent)
          },
          {
            path: 'dossiers',
            loadComponent: () =>
              import('./agent/dossiers/dossiers.component')
                .then(m => m.DossiersComponent)
          }
        ]
      },

      // ========================
      // ⚙️ ADMIN
      // ========================
      {
        path: 'admin',
        children: [
          {
            path: '',
            loadComponent: () =>
              import('./admin/dashboard/dashboard.component')
                .then(m => m.DashboardComponent),
            data: { title: 'Dashboard Admin' }
          },
          {
            path: 'liste-biens',
            loadComponent: () =>
              import('./admin/list-bien/list-bien.component')
                .then(m => m.ListBienComponent),
            data: { title: 'Inventaire des Biens' }
          },
          {
            path: 'create-bien',
            loadComponent: () =>
              import('./admin/create-bien/create-bien.component')
                .then(m => m.CreateBienComponent),
            data: { title: 'Ajouter un Bien' }
          },
          {
            path: 'categories',
            loadComponent: () =>
              import('./admin/create-categorie/create-categorie.component')
                .then(m => m.CreateCategorieComponent),
            data: { title: 'Gestion des Catégories' }
          },
          {
            path: 'services',
            loadComponent: () =>
              import('./admin/services/services.component')
                .then(m => m.ServicesComponent),
            data: { title: 'Gestion des Services' }
          },
          {
            path: 'create-service',
            loadComponent: () =>
              import('./admin/create-service/create-service.component')
                .then(m => m.CreateServiceComponent),
            data: { title: 'Ajouter un Service' }
          },
          {
            path: 'create-service/:id',
            loadComponent: () =>
              import('./admin/create-service/create-service.component')
                .then(m => m.CreateServiceComponent)
          },
          {
            path: 'utilisateurs',
            loadComponent: () =>
              import('./admin/utilisateurs/utilisateurs.component')
                .then(m => m.UtilisateursComponent)
          },
          {
            path: 'statistiques',
            loadComponent: () =>
              import('./admin/statistiques/statistiques.component')
                .then(m => m.StatistiquesComponent)
          }
        ]
      }
    ]
  },

  // ========================
  // ❌ 404
  // ========================
  {
    path: '**',
    redirectTo: 'accueil'
  }
];