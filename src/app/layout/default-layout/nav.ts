import { INavData } from '@coreui/angular';

//
// ========================
// 🌍 PUBLIC NAVIGATION
// ========================
//
export const publicNav: INavData[] = [
  { title: true, name: 'PORTAIL COMMUNAL' },

  {
    name: 'Accueil',
    url: '/accueil',
    iconComponent: { name: 'cilHome' }
  },

  // 🏛️ PATRIMOINE
  {
    name: 'Patrimoine',
    iconComponent: { name: 'cilLibrary' },
    children: [
      {
        name: 'Biens municipaux',
        url: '/biens',
        iconComponent: { name: 'cilBuilding' }
      },
      {
        name: 'Catégories de biens',
        url: '/categories-biens',
        iconComponent: { name: 'cilList' }
      }
    ]
  },

  {
    name: 'Actualités',
    url: '/actualites',
    iconComponent: { name: 'cilNotes' }
  },

  // 🏛️ MAIRIE
  {
    name: 'La Mairie',
    iconComponent: { name: 'cilInstitution' },
    children: [
      { name: 'Le Maire', url: '/maire' },
      { name: 'Organisation', url: '/organisation' },
      { name: 'Contact', url: '/contact' }
    ]
  },

  { title: true, name: 'AUTHENTIFICATION' },

  {
    name: 'Connexion',
    url: '/login',
    iconComponent: { name: 'cilLockLocked' }
  },
  {
    name: 'Inscription',
    url: '/register',
    iconComponent: { name: 'cilUserFollow' }
  }
];

//
// ========================
// 👤 CITOYEN NAVIGATION
// ========================
//
export const citoyenNav: INavData[] = [
  { title: true, name: 'ESPACE CITOYEN' },

  {
    name: 'Mon espace',
    url: '/citizen',
    iconComponent: { name: 'cilSpeedometer' }
  },

  // 📅 RDV
  {
    name: 'Rendez-vous',
    iconComponent: { name: 'cilCalendar' },
    children: [
      {
        name: 'Prendre rendez-vous',
        url: '/citizen/prendre-rdv'
      },
      {
        name: 'Mes rendez-vous',
        url: '/citizen/mes-rdv'
      }
    ]
  },

  // 📁 DOSSIERS
  {
    name: 'Démarches',
    iconComponent: { name: 'cilFolder' },
    children: [
      {
        name: 'Créer un dossier',
        url: '/citizen/dossier/create'
      },
      {
        name: 'Mes dossiers',
        url: '/citizen/dossiers'
      }
    ]
  },

  // 🏠 BIENS
  {
    name: 'Biens & Réservations',
    iconComponent: { name: 'cilBuilding' },
    children: [
      {
        name: 'Biens municipaux',
        url: '/biens'
      },
      {
        name: 'Catégories de biens',
        url: '/categories-biens'
      },
      {
        name: 'Mes réservations',
        url: '/citizen/mes-reservations'
      },
      {
        name: 'Réserver un bien',
        url: '/citizen/create-reservation'
      }
    ]
  }
];

//
// ========================
// 🏢 AGENT NAVIGATION
// ========================
//
export const agentNav: INavData[] = [
  { title: true, name: 'ESPACE AGENT' },

  {
    name: 'Dashboard',
    url: '/agent',
    iconComponent: { name: 'cilSpeedometer' }
  },

  {
    name: 'Gestion RDV',
    iconComponent: { name: 'cilCalendar' },
    children: [
      {
        name: 'Liste des rendez-vous',
        url: '/agent/rdv'
      }
    ]
  },

  {
    name: 'Dossiers',
    iconComponent: { name: 'cilFolderOpen' },
    children: [
      {
        name: 'Dossiers à traiter',
        url: '/agent/dossiers'
      }
    ]
  }
];

//
// ========================
// ⚙️ ADMIN NAVIGATION
// ========================
//
export const adminNav: INavData[] = [
  { title: true, name: 'ADMINISTRATION' },

  {
    name: 'Dashboard',
    url: '/admin',
    iconComponent: { name: 'cilSpeedometer' }
  },

  // 👥 UTILISATEURS
  {
    name: 'Utilisateurs',
    iconComponent: { name: 'cilPeople' },
    children: [
      {
        name: 'Liste utilisateurs',
        url: '/admin/utilisateurs'
      }
    ]
  },

  // 🧾 SERVICES
  {
    name: 'Services',
    iconComponent: { name: 'cilTask' },
    children: [
      {
        name: 'Liste services',
        url: '/admin/services'
      },
      {
        name: 'Créer service',
        url: '/admin/create-service'
      }
    ]
  },

  // 🏠 PATRIMOINE
  {
    name: 'Patrimoine',
    iconComponent: { name: 'cilBuilding' },
    children: [
      {
        name: 'Liste des biens',
        url: '/admin/liste-biens'
      },
      {
        name: 'Créer un bien',
        url: '/admin/create-bien'
      },
      {
        name: 'Catégories de biens',
        url: '/admin/categories'
      }
    ]
  },

  // 📊 STATS
  {
    name: 'Statistiques',
    iconComponent: { name: 'cilChart' },
    children: [
      {
        name: 'Tableau de bord',
        url: '/admin/statistiques'
      }
    ]
  }
];

//
// ========================
// FINAL EXPORT
// ========================
//
export const navItems = {
  publicNav,
  citoyenNav,
  agentNav,
  adminNav
};