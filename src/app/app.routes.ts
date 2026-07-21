import { Routes } from '@angular/router';
import { authGuard } from './auth.guard'; // Import du guard que tu as créé
import { DefaultLayoutComponent } from './layout/default-layout/default-layout.component';

export const routes: Routes = [
  {
    path: '',
    component: DefaultLayoutComponent,
    children: [
      { path: '', redirectTo: 'accueil', pathMatch: 'full' },

      // ================= PUBLIC =================
      {
        path: 'accueil',
        loadComponent: () => import('./views/accueil/page-accueil/page-accueil.component').then(m => m.PageAccueilComponent)
      },
      {
        path: 'actualites',
        loadComponent: () => import('./views/actualites/liste-actualites/liste-actualites.component').then(m => m.ListeActualitesComponent)
      },
      {
        path: 'contact',
        loadComponent: () => import('./views/contact/contact-mairie/contact-mairie.component').then(m => m.ContactMairieComponent)
      },
      {
        path: 'mairie',
        children: [
          {
            path: 'maire',
            loadComponent: () => import('./views/mairie/maire/maire.component').then(m => m.MaireComponent)
          },
          {
            path: 'organisation',
            loadComponent: () => import('./views/mairie/organisation/organisation.component').then(m => m.OrganisationComponent)
          }
        ]
      },
      {
        path: 'biens',
        loadComponent: () => import('./bien-mairie/bien-mairie.component').then(m => m.BienMairieComponent)
      },
      {
        path: 'services',
        loadComponent: () => import('./services-mairie/services-mairie.component').then(m => m.ServicesMairieComponent)
      },

      // ================= AUTH =================
      {
        path: 'login',
        loadComponent: () => import('./auth/login/login.component').then(m => m.LoginComponent)
      },
      {
        path: 'register',
        loadComponent: () => import('./auth/register/register.component').then(m => m.RegisterComponent)
      },

      // ================= CITOYEN (SÉCURISÉ) =================
      {
        path: 'citizen',
        canActivate: [authGuard],
        data: { roles: ['ROLE_CITOYEN'] },
        children: [
          { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
          {
            path: 'dashboard',
            loadComponent: () => import('./citizen/dashboard/dashboard.component').then(m => m.CitizenDashboardComponent)
          },
          {
            path: 'profile',
            loadComponent: () => import('./citizen/profile/profile.component').then(m => m.ProfileComponent)
          },
          {
            path: 'rdv',
            children: [
              {
                path: 'nouveau',
                loadComponent: () => import('./citizen/prendre-rdv/prendre-rdv.component').then(m => m.PrendreRdvComponent)
              },
              {
                path: 'mes-rdv',
                loadComponent: () => import('./citizen/mes-rdv/mes-rdv.component').then(m => m.MesRdvComponent)
              }
            ]
          },
          {
            path: 'reservations',
            children: [
              { path: '', loadComponent: () => import('./citizen/reservations/reservations.component').then(m => m.ReservationsComponent) },
              { path: 'create', loadComponent: () => import('./citizen/create-reservation/create-reservation.component').then(m => m.CreateReservationComponent) }
            ]
          },
          {
            path: 'dossiers',
            children: [
              { path: '', loadComponent: () => import('./citizen/dossiers/liste-dossiers/liste-dossiers.component').then(m => m.ListeDossiersComponent) },
              { path: 'create', loadComponent: () => import('./citizen/dossiers/create-dossier/create-dossier.component').then(m => m.CreateDossierComponent) },
              { path: ':id', loadComponent: () => import('./citizen/dossiers/detail-dossier/detail-dossier.component').then(m => m.DetailDossierComponent) }
            ]
          },
          {
            path: 'payment',
            loadComponent: () => import('./citizen/payment/payment.component').then(m => m.PaymentComponent)
          }
        ]
      },

      // ================= AGENT (SÉCURISÉ) =================
      {
        path: 'agent',
        canActivate: [authGuard],
        data: { roles: ['ROLE_AGENT', 'ROLE_ADMIN', 'ROLE_SUPER_ADMIN'] },
        children: [
          { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
          {
            path: 'dashboard',
            // ✅ CORRIGÉ : Charge explicitement la classe renommée AgentDashboardComponent
            loadComponent: () => import('./agent/dashboard/dashboard.component').then(m => m.AgentDashboardComponent)
          },
          {
            path: 'rdv',
            loadComponent: () => import('./agent/gestion-rdv/gestion-rdv.component').then(m => m.GestionRdvComponent)
          },
          {
            path: 'dossiers',
            loadComponent: () => import('./agent/dossiers/dossiers.component').then(m => m.DossiersComponent)
          },
          {
            path: 'reservations',
            loadComponent: () => import('./agent/reservations/reservations.component').then(m => m.AgentReservationsComponent)
          }
        ]
      },

      // ================= ADMIN (SÉCURISÉ) =================
      {
        path: 'admin',
        canActivate: [authGuard],
        data: { roles: ['ROLE_ADMIN', 'ROLE_SUPER_ADMIN'] },
        children: [
          { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
          {
            path: 'dashboard',
            // 💡 SÉCURISÉ : Si vous avez renommé la classe de l'admin en AdminDashboardComponent, changez-la ici également :
            loadComponent: () => import('./admin/dashboard/dashboard.component').then(m => m.DashboardComponent)
          },
          {
            path: 'utilisateurs',
            loadComponent: () => import('./admin/utilisateurs/utilisateurs.component').then(m => m.UtilisateursComponent)
          },
          {
            path: 'statistiques',
            loadComponent: () => import('./admin/statistiques/statistiques.component').then(m => m.StatistiquesComponent)
          },
          {
            path: 'services',
            children: [
              { path: '', loadComponent: () => import('./admin/services/services.component').then(m => m.ServicesComponent) },
              { path: 'create', loadComponent: () => import('./admin/create-service/create-service.component').then(m => m.CreateServiceComponent) },
              { path: 'edit/:id', loadComponent: () => import('./admin/create-service/create-service.component').then(m => m.CreateServiceComponent) }
            ]
          },
          {
            path: 'biens',
            children: [
              { path: '', loadComponent: () => import('./admin/list-bien/list-bien.component').then(m => m.ListBienComponent) },
              { path: 'create', loadComponent: () => import('./admin/create-bien/create-bien.component').then(m => m.CreateBienComponent) },
              { path: 'edit/:id', loadComponent: () => import('./admin/create-bien/create-bien.component').then(m => m.CreateBienComponent) }
            ]
          },
          {
            path: 'categories',
            loadComponent: () => import('./admin/create-categorie/create-categorie.component').then(m => m.CreateCategorieComponent)
          }
        ]
      },

      { path: '**', redirectTo: 'accueil' }
    ]
  }
];