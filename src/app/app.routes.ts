import { Routes } from '@angular/router';
import { DefaultLayoutComponent } from './layout/default-layout/default-layout.component';

export const routes: Routes = [
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
        loadComponent: () => import('./views/accueil/page-accueil/page-accueil.component')
          .then(m => m.PageAccueilComponent),
        data: { title: 'Accueil - Plateforme de gestion municipale' }
      },
      {
        path: 'actualites',
        loadComponent: () => import('./views/actualites/liste-actualites/liste-actualites.component')
          .then(m => m.ListeActualitesComponent),
        data: { title: 'Actualités - Plateforme de gestion municipale' }
      },
      {
        path: 'contact',
        loadComponent: () => import('./views/contact/contact-mairie/contact-mairie.component')
          .then(m => m.ContactMairieComponent),
        data: { title: 'Contact - Plateforme de gestion municipale' }
      },
      {
        path: 'maire',
        loadComponent: () => import('./views/mairie/maire/maire.component')
          .then(m => m.MaireComponent),
        data: { title: 'Maire - Plateforme de gestion municipale' }
      },
      {
        path: 'organisation',
        loadComponent: () => import('./views/mairie/organisation/organisation.component')
          .then(m => m.OrganisationComponent),
        data: { title: 'Organisation - Plateforme de gestion municipale' }
      },

      // ========================
      // 👤 CITOYEN
      // ========================
      {
        path: 'citizen',
        children: [
          {
            path: '',
            loadComponent: () => import('./citizen/dashboard/dashboard.component')
              .then(m => m.CitizenDashboardComponent),
            data: { title: 'Dashboard Citoyen - Plateforme de gestion municipale' }
          },
          {
            path: 'prendre-rdv',
            loadComponent: () => import('./citizen/prendre-rdv/prendre-rdv.component')
              .then(m => m.PrendreRdvComponent),
            data: { title: 'Prendre rendez-vous - Plateforme de gestion municipale' }
          },
          {
            path: 'mes-rdv',
            loadComponent: () => import('./citizen/mes-rdv/mes-rdv.component')
              .then(m => m.MesRdvComponent),
            data: { title: 'Mes rendez-vous - Plateforme de gestion municipale' }
          },
          {
            path: 'dossiers',
            loadComponent: () => import('./citizen/dossiers/liste-dossiers/liste-dossiers.component')
              .then(m => m.ListeDossiersComponent),
            data: { title: 'Mes dossiers - Plateforme de gestion municipale' }
          },
          {
            path: 'dossier/create',
            loadComponent: () => import('./citizen/dossiers/create-dossier/create-dossier.component')
              .then(m => m.CreateDossierComponent),
            data: { title: 'Créer dossier - Plateforme de gestion municipale' }
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
            loadComponent: () => import('./agent/dashboard/dashboard.component')
              .then(m => m.DashboardComponent),
            data: { title: 'Dashboard Agent - Plateforme de gestion municipale' }
          },
          {
            path: 'rdv',
            loadComponent: () => import('./agent/gestion-rdv/gestion-rdv.component')
              .then(m => m.GestionRdvComponent),
            data: { title: 'Gestion des rendez-vous - Plateforme de gestion municipale' }
          },
          {
            path: 'dossiers',
            loadComponent: () => import('./agent/dossiers/dossiers.component')
              .then(m => m.DossiersComponent),
            data: { title: 'Dossiers Agent - Plateforme de gestion municipale' }
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
            loadComponent: () => import('./admin/dashboard/dashboard.component')
              .then(m => m.DashboardComponent),
            data: { title: 'Dashboard Admin - Plateforme de gestion municipale' }
          },
          {
            path: 'utilisateurs',
            loadComponent: () => import('./admin/utilisateurs/utilisateurs.component')
              .then(m => m.UtilisateursComponent),
            data: { title: 'Utilisateurs - Plateforme de gestion municipale' }
          },
          {
            path: 'services',
            loadComponent: () => import('./admin/services/services.component')
              .then(m => m.ServicesComponent),
            data: { title: 'Services - Plateforme de gestion municipale' }
          },
          {
            path: 'statistiques',
            loadComponent: () => import('./admin/statistiques/statistiques.component')
              .then(m => m.StatistiquesComponent),
            data: { title: 'Statistiques - Plateforme de gestion municipale' }
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