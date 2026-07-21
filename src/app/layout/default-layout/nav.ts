export interface NavItem {
  name: string;
  url: string;
  icon: string;
}

// ======================================================
// 🌍 MENU PUBLIC
// ======================================================

export const publicNav: NavItem[] = [

  {
    name: 'Accueil',
    url: '/accueil',
    icon: 'fa-solid fa-house'
  },
  {
    name: 'Biens Municipaux',
    url: '/biens',
    icon: 'fa-solid fa-city'
  },
  {
    name: 'Services',
    url: '/services',
    icon: 'fa-solid fa-file-signature'
  },

  {
    name: 'Contact',
    url: '/contact',
    icon: 'fa-solid fa-envelope'
  }
];

// ======================================================
// 👤 MENU CITOYEN
// ======================================================

export const citoyenNav: NavItem[] = [

  // ================= DASHBOARD =================

  {
    name: 'Dashboard',
    url: '/citizen/dashboard',
    icon: 'fa-solid fa-chart-line'
  },

  // ================= RESERVATIONS DE BIENS =================

  {
    name: 'Créer Réservation',
    url: '/citizen/reservations/create',
    icon: 'fa-solid fa-building-circle-check'
  },


  // ================= RENDEZ-VOUS SERVICES =================

  {
    name: 'Prendre RDV',
    url: '/citizen/rdv/nouveau',
    icon: 'fa-solid fa-calendar-plus'
  },
  // ================= DOSSIERS =================


  {
    name: 'Créer Dossier',
    url: '/citizen/dossiers/create',
    icon: 'fa-solid fa-file-circle-plus'
  },

  // ================= PROFIL =================

  {
    name: 'Mon Profil',
    url: '/citizen/profile',
    icon: 'fa-solid fa-user'
  }
];

// ======================================================
// 🏢 MENU AGENT
// ======================================================

export const agentNav: NavItem[] = [

  {
    name: 'Dashboard',
    url: '/agent/dashboard',
    icon: 'fa-solid fa-gauge-high'
  },

  {
    name: 'Gestion RDV',
    url: '/agent/rdv',
    icon: 'fa-solid fa-calendar-days'
  },

  {
    name: 'Gestion Dossiers',
    url: '/agent/dossiers',
    icon: 'fa-solid fa-folder-tree'
  },

  {
    name: 'Réservations',
    url: '/agent/reservations',
    icon: 'fa-solid fa-building-circle-check'
  }
];

// ======================================================
// ⚙️ MENU ADMIN
// ======================================================

export const adminNav: NavItem[] = [

  // ================= DASHBOARD =================

  {
    name: 'Dashboard',
    url: '/admin/dashboard',
    icon: 'fa-solid fa-chart-pie'
  },

  // ================= UTILISATEURS =================

  {
    name: 'Utilisateurs',
    url: '/admin/utilisateurs',
    icon: 'fa-solid fa-users'
  },

  // ================= SERVICES =================


  {
    name: 'Créer Service',
    url: '/admin/services/create',
    icon: 'fa-solid fa-square-plus'
  },

  // ================= BIENS =================

  {
    name: 'Créer Bien',
    url: '/admin/biens/create',
    icon: 'fa-solid fa-building-circle-add'
  },

  // ================= CATEGORIES =================

  {
    name: 'Catégories',
    url: '/admin/categories',
    icon: 'fa-solid fa-layer-group'
  },

  // ================= STATISTIQUES =================

  {
    name: 'Statistiques',
    url: '/admin/statistiques',
    icon: 'fa-solid fa-chart-column'
  }
];