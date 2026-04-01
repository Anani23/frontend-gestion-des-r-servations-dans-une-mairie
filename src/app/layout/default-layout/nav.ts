import { INavData } from '@coreui/angular';

// 🌍 PUBLIC
export const publicNav: INavData[] = [
  { title: true, name: 'PUBLIC' },

  { name: 'Accueil', url: '/accueil', iconComponent: { name: 'cilHome' } },
  { name: 'Actualités', url: '/actualites', iconComponent: { name: 'cilNotes' } },
  { name: 'Contact', url: '/contact', iconComponent: { name: 'cilEnvelopeOpen' } },
  { name: 'Maire', url: '/maire', iconComponent: { name: 'cilUser' } },
  { name: 'Organisation', url: '/organisation', iconComponent: { name: 'cilPeople' } }
];


// 👤 CITOYEN
export const citoyenNav: INavData[] = [
  { title: true, name: 'ESPACE CITOYEN' },

  { name: 'Dashboard', url: '/citizen', iconComponent: { name: 'cilSpeedometer' } },

  {
    name: 'Rendez-vous',
    iconComponent: { name: 'cilCalendar' },
    children: [
      { name: 'Prendre rendez-vous', url: '/citizen/prendre-rdv' },
      { name: 'Mes rendez-vous', url: '/citizen/mes-rdv' }
    ]
  },

  {
    name: 'Dossiers',
    iconComponent: { name: 'cilFolder' },
    children: [
      { name: 'Créer dossier', url: '/citizen/dossier/create' },
      { name: 'Mes dossiers', url: '/citizen/dossiers' }
    ]
  }
];


// 🏢 AGENT
export const agentNav: INavData[] = [
  { title: true, name: 'ESPACE AGENT' },

  { name: 'Dashboard Agent', url: '/agent', iconComponent: { name: 'cilSpeedometer' } },
  { name: 'Rendez-vous', url: '/agent/rdv', iconComponent: { name: 'cilCalendar' } },
  { name: 'Dossiers', url: '/agent/dossiers', iconComponent: { name: 'cilFolderOpen' } }
];


// ⚙️ ADMIN
export const adminNav: INavData[] = [
  { title: true, name: 'ADMINISTRATION' },

  { name: 'Dashboard Admin', url: '/admin', iconComponent: { name: 'cilSpeedometer' } },
  { name: 'Utilisateurs', url: '/admin/utilisateurs', iconComponent: { name: 'cilPeople' } },
  { name: 'Services', url: '/admin/services', iconComponent: { name: 'cilSettings' } },
  { name: 'Statistiques', url: '/admin/statistiques', iconComponent: { name: 'cilChart' } }
];