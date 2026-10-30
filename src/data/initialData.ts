import { Direction, Theme, Typology, Stage, TeamMember, BusinessContact, ContentItem } from '../types/editorial';

export const INITIAL_DIRECTIONS: Direction[] = [
  {
    id: 'dir_marketing',
    name: 'Direction Marketing & Croissance',
    code: 'MKT',
    color: '#3B82F6', // Blue
    description: 'Campagnes d acquisition, positionnement d offres et conversion'
  },
  {
    id: 'dir_rse_marque',
    name: 'Direction Marque & RSE',
    code: 'RSE',
    color: '#10B981', // Emerald
    description: 'Identité de marque, engagements durables et gouvernance éthique'
  },
  {
    id: 'dir_rh',
    name: 'Direction Ressources Humaines',
    code: 'RH',
    color: '#8B5CF6', // Purple
    description: 'Marque employeur, offres d emploi et culture d entreprise'
  },
  {
    id: 'dir_produit',
    name: 'Direction Produit & Tech',
    code: 'PRD',
    color: '#06B6D4', // Cyan
    description: 'Fonctionnalités, roadmap, sécurité et documentation technique'
  },
  {
    id: 'dir_juridique',
    name: 'Direction Juridique & Conformité',
    code: 'JUR',
    color: '#F59E0B', // Amber
    description: 'Mentions légales, RGPD, CGU/CGV et conformité réglementaire'
  },
  {
    id: 'dir_client',
    name: 'Direction Relation Client & Support',
    code: 'REL',
    color: '#EC4899', // Pink
    description: 'Satisfaction, centre d aide, onboarding et guides utilisateurs'
  }
];

export const INITIAL_THEMES: Theme[] = [
  {
    id: 'theme_offres',
    name: 'Offres & Tarifs',
    color: '#3B82F6',
    description: 'Présentation des forfaits, grille tarifaire et comparatifs'
  },
  {
    id: 'theme_engagements',
    name: 'Engagements RSE & Impact',
    color: '#10B981',
    description: 'Bilan carbone, inclusion, achats responsables et mécénat'
  },
  {
    id: 'theme_recrutement',
    name: 'Recrutement & Talents',
    color: '#8B5CF6',
    description: 'Témoignages collaborateurs, avantages et processus d embauche'
  },
  {
    id: 'theme_expertises',
    name: 'Expertises & Cas Clients',
    color: '#F97316',
    description: 'Retours d expérience clients, chiffres clés et méthodologie'
  },
  {
    id: 'theme_conformite',
    name: 'Sécurité & Données RGPD',
    color: '#64748B',
    description: 'Politique de confidentialité, cookies et certifications ISO'
  },
  {
    id: 'theme_support',
    name: 'Centre d Aide & Tutoriels',
    color: '#EC4899',
    description: 'Questions fréquentes, guides pas-à-pas et contact assistance'
  }
];

export const INITIAL_TYPOLOGIES: Typology[] = [
  {
    id: 'typo_pilier',
    name: 'Page Pilier / Vitrine',
    estimatedWords: 1500,
    description: 'Page stratégique structurante du site à fort enjeu SEO et conversion'
  },
  {
    id: 'typo_produit',
    name: 'Fiche Solution / Produit',
    estimatedWords: 900,
    description: 'Description détaillée d une offre, bénéfices métiers et captures d écran'
  },
  {
    id: 'typo_article',
    name: 'Article Blog Expert',
    estimatedWords: 1200,
    description: 'Contenu éditorial thématique d autorité avec sources et citations'
  },
  {
    id: 'typo_landing',
    name: 'Landing Page Campagne',
    estimatedWords: 600,
    description: 'Page d atterrissage ciblée avec formulaire de génération de leads'
  },
  {
    id: 'typo_temoignage',
    name: 'Cas Client / Témoignage',
    estimatedWords: 800,
    description: 'Récit client avec contexte, solution déployée et métriques d impact'
  },
  {
    id: 'typo_faq',
    name: 'Guide FAQ / Support',
    estimatedWords: 750,
    description: 'Ensemble de réponses claires aux questions récurrentes des prospects'
  },
  {
    id: 'typo_juridique',
    name: 'Page Réglementaire & CGU',
    estimatedWords: 1800,
    description: 'Textes contractuels obligatoires validés par les juristes'
  }
];

export const INITIAL_STAGES: Stage[] = [
  {
    id: 'stage_brief',
    order: 1,
    name: '1. Cadrage & Brief',
    description: 'Recueil des besoins, angle éditorial et mots-clés cibles',
    targetDays: 3,
    warningDays: 5,
    criticalDays: 8,
    isFinal: false
  },
  {
    id: 'stage_redaction',
    order: 2,
    name: '2. Rédaction en cours',
    description: 'Écriture du premier jet et structuration des contenus',
    targetDays: 5,
    warningDays: 7,
    criticalDays: 11,
    isFinal: false
  },
  {
    id: 'stage_relecture',
    order: 3,
    name: '3. Relecture interne',
    description: 'Relecture orthotypographique, ton et conformité charte',
    targetDays: 2,
    warningDays: 4,
    criticalDays: 6,
    isFinal: false
  },
  {
    id: 'stage_validation_metier',
    order: 4,
    name: '4. Validation métier',
    description: 'Relecture et bon pour accord par l interlocuteur métier référent',
    targetDays: 4,
    warningDays: 6,
    criticalDays: 9,
    isFinal: false
  },
  {
    id: 'stage_integration',
    order: 5,
    name: '5. Intégration CMS & SEO',
    description: 'Mise en page dans le CMS, balisage SEO, images et maillage',
    targetDays: 3,
    warningDays: 4,
    criticalDays: 7,
    isFinal: false
  },
  {
    id: 'stage_publie',
    order: 6,
    name: '6. En ligne / Publié',
    description: 'Page validée, indexée et accessible au public',
    targetDays: 0,
    warningDays: 0,
    criticalDays: 0,
    isFinal: true
  }
];

export const INITIAL_TEAM: TeamMember[] = [
  {
    id: 'team_sarah',
    name: 'Sarah Benali',
    email: 'sarah.benali@entreprise.com',
    role: 'Rédactrice en chef / Lead Content',
    initials: 'SB'
  },
  {
    id: 'team_thomas',
    name: 'Thomas Mercier',
    email: 'thomas.mercier@entreprise.com',
    role: 'Rédacteur Technique & SEO',
    initials: 'TM'
  },
  {
    id: 'team_claire',
    name: 'Claire Dupont',
    email: 'claire.dupont@entreprise.com',
    role: 'Copywriter & Brand Content',
    initials: 'CD'
  },
  {
    id: 'team_julien',
    name: 'Julien Leroy',
    email: 'julien.leroy@entreprise.com',
    role: 'Rédacteur UX & Micro-copy',
    initials: 'JL'
  },
  {
    id: 'team_emma',
    name: 'Emma Martin',
    email: 'emma.martin@entreprise.com',
    role: 'Relectrice & Intégratrice CMS',
    initials: 'EM'
  }
];

export const INITIAL_BUSINESS_CONTACTS: BusinessContact[] = [
  {
    id: 'contact_marc',
    name: 'Marc Lefebvre',
    role: 'Directeur Marketing Produit',
    email: 'm.lefebvre@entreprise.com',
    phone: '01 42 68 11 02',
    directionId: 'dir_marketing',
    department: 'Marketing Offres'
  },
  {
    id: 'contact_helene',
    name: 'Hélène Vasseur',
    role: 'Responsable RSE & Impact',
    email: 'h.vasseur@entreprise.com',
    phone: '01 42 68 15 44',
    directionId: 'dir_rse_marque',
    department: 'Développement Durable'
  },
  {
    id: 'contact_antoine',
    name: 'Antoine Girard',
    role: 'Responsable Marque Employeur',
    email: 'a.girard@entreprise.com',
    phone: '01 42 68 19 80',
    directionId: 'dir_rh',
    department: 'Talents & Recrutement'
  },
  {
    id: 'contact_sophie',
    name: 'Sophie Renard',
    role: 'Head of Product Architecture',
    email: 's.renard@entreprise.com',
    phone: '01 42 68 22 15',
    directionId: 'dir_produit',
    department: 'Ingénierie & Plateforme'
  },
  {
    id: 'contact_david',
    name: 'David Morel',
    role: 'Juriste DPO & Données Personnelles',
    email: 'd.morel@entreprise.com',
    phone: '01 42 68 30 08',
    directionId: 'dir_juridique',
    department: 'Affaires Juridiques'
  },
  {
    id: 'contact_camille',
    name: 'Camille Roche',
    role: 'Responsable Expérience Client',
    email: 'c.roche@entreprise.com',
    phone: '01 42 68 41 90',
    directionId: 'dir_client',
    department: 'Support & Success'
  },
  {
    id: 'contact_laurent',
    name: 'Laurent Picard',
    role: 'Directeur de la Communication Corporate',
    email: 'l.picard@entreprise.com',
    phone: '01 42 68 55 12',
    directionId: 'dir_rse_marque',
    department: 'Relations Publiques'
  }
];

// Fonction utilitaire pour générer des dates réalistes dans le passé
const daysAgo = (days: number): string => {
  const d = new Date();
  d.setDate(d.getDate() - days);
  return d.toISOString();
};

export const INITIAL_CONTENTS: ContentItem[] = [
  {
    id: 'cnt_01',
    title: 'Page Accueil & Proposition de valeur',
    urlPath: '/',
    directionId: 'dir_marketing',
    themeId: 'theme_offres',
    typologyId: 'typo_pilier',
    stageId: 'stage_publie',
    assigneeId: 'team_sarah',
    businessContactId: 'contact_marc',
    stageEnteredAt: daysAgo(14),
    targetDeliveryDate: daysAgo(10),
    priority: 'urgente',
    briefNotes: 'Refonte globale du message principal, chiffres clés et CTA conversion.',
    docUrl: 'https://docs.google.com/document/d/demo-accueil',
    cmsUrl: 'https://preview.site.fr/',
    createdAt: daysAgo(40),
    updatedAt: daysAgo(14),
    history: [
      { stageId: 'stage_brief', stageName: '1. Cadrage & Brief', enteredAt: daysAgo(40), leftAt: daysAgo(35), durationDays: 5 },
      { stageId: 'stage_redaction', stageName: '2. Rédaction', enteredAt: daysAgo(35), leftAt: daysAgo(28), durationDays: 7 },
      { stageId: 'stage_relecture', stageName: '3. Relecture', enteredAt: daysAgo(28), leftAt: daysAgo(25), durationDays: 3 },
      { stageId: 'stage_validation_metier', stageName: '4. Validation métier', enteredAt: daysAgo(25), leftAt: daysAgo(18), durationDays: 7 },
      { stageId: 'stage_integration', stageName: '5. Intégration CMS', enteredAt: daysAgo(18), leftAt: daysAgo(14), durationDays: 4 },
      { stageId: 'stage_publie', stageName: '6. En ligne', enteredAt: daysAgo(14) }
    ]
  },
  {
    id: 'cnt_02',
    title: 'Tarifs et Comparateur d Abonnements',
    urlPath: '/tarifs',
    directionId: 'dir_marketing',
    themeId: 'theme_offres',
    typologyId: 'typo_pilier',
    stageId: 'stage_validation_metier',
    assigneeId: 'team_claire',
    businessContactId: 'contact_marc',
    stageEnteredAt: daysAgo(10), // Dépassé ! Seuil critique = 9j -> CRITIQUE
    targetDeliveryDate: daysAgo(2),
    priority: 'urgente',
    briefNotes: 'Nouveau modèle freemium et détails des options entreprises. En attente validation des remises par Marc Lefebvre.',
    docUrl: 'https://docs.google.com/document/d/demo-tarifs',
    createdAt: daysAgo(28),
    updatedAt: daysAgo(10),
    history: [
      { stageId: 'stage_brief', stageName: '1. Cadrage & Brief', enteredAt: daysAgo(28), leftAt: daysAgo(24), durationDays: 4 },
      { stageId: 'stage_redaction', stageName: '2. Rédaction', enteredAt: daysAgo(24), leftAt: daysAgo(15), durationDays: 9 },
      { stageId: 'stage_relecture', stageName: '3. Relecture', enteredAt: daysAgo(15), leftAt: daysAgo(10), durationDays: 5 },
      { stageId: 'stage_validation_metier', stageName: '4. Validation métier', enteredAt: daysAgo(10) }
    ]
  },
  {
    id: 'cnt_03',
    title: 'Politique de Confidentialité & RGPD 2026',
    urlPath: '/confidentialite',
    directionId: 'dir_juridique',
    themeId: 'theme_conformite',
    typologyId: 'typo_juridique',
    stageId: 'stage_validation_metier',
    assigneeId: 'team_thomas',
    businessContactId: 'contact_david',
    stageEnteredAt: daysAgo(7), // Seuil warning = 6j -> ATTENTION
    targetDeliveryDate: daysAgo(1),
    priority: 'haute',
    briefNotes: 'Mise en conformité avec les directives sur l IA et cookies tiers. Attente retour de David Morel.',
    docUrl: 'https://docs.google.com/document/d/demo-rgpd',
    createdAt: daysAgo(20),
    updatedAt: daysAgo(7),
    history: [
      { stageId: 'stage_brief', stageName: '1. Cadrage & Brief', enteredAt: daysAgo(20), leftAt: daysAgo(17), durationDays: 3 },
      { stageId: 'stage_redaction', stageName: '2. Rédaction', enteredAt: daysAgo(17), leftAt: daysAgo(9), durationDays: 8 },
      { stageId: 'stage_relecture', stageName: '3. Relecture', enteredAt: daysAgo(9), leftAt: daysAgo(7), durationDays: 2 },
      { stageId: 'stage_validation_metier', stageName: '4. Validation métier', enteredAt: daysAgo(7) }
    ]
  },
  {
    id: 'cnt_04',
    title: 'Page Carrières & Nous Rejoindre',
    urlPath: '/carrieres',
    directionId: 'dir_rh',
    themeId: 'theme_recrutement',
    typologyId: 'typo_pilier',
    stageId: 'stage_integration',
    assigneeId: 'team_emma',
    businessContactId: 'contact_antoine',
    stageEnteredAt: daysAgo(2), // Seuil warning = 4j -> NOMINAL
    targetDeliveryDate: daysAgo(-3),
    priority: 'haute',
    briefNotes: 'Présentation des avantages, grille salariale transparente et vidéos collaborateurs.',
    docUrl: 'https://docs.google.com/document/d/demo-carrieres',
    cmsUrl: 'https://preview.site.fr/carrieres',
    createdAt: daysAgo(22),
    updatedAt: daysAgo(2),
    history: [
      { stageId: 'stage_brief', stageName: '1. Cadrage & Brief', enteredAt: daysAgo(22), leftAt: daysAgo(18), durationDays: 4 },
      { stageId: 'stage_redaction', stageName: '2. Rédaction', enteredAt: daysAgo(18), leftAt: daysAgo(9), durationDays: 9 },
      { stageId: 'stage_relecture', stageName: '3. Relecture', enteredAt: daysAgo(9), leftAt: daysAgo(6), durationDays: 3 },
      { stageId: 'stage_validation_metier', stageName: '4. Validation métier', enteredAt: daysAgo(6), leftAt: daysAgo(2), durationDays: 4 },
      { stageId: 'stage_integration', stageName: '5. Intégration CMS', enteredAt: daysAgo(2) }
    ]
  },
  {
    id: 'cnt_05',
    title: 'Rapport RSE & Bilan Carbone 2025-2026',
    urlPath: '/rse-engagements',
    directionId: 'dir_rse_marque',
    themeId: 'theme_engagements',
    typologyId: 'typo_article',
    stageId: 'stage_redaction',
    assigneeId: 'team_claire',
    businessContactId: 'contact_helene',
    stageEnteredAt: daysAgo(12), // Seuil critique = 11j -> CRITIQUE
    targetDeliveryDate: daysAgo(3),
    priority: 'urgente',
    briefNotes: 'Compilation des données Scope 1-2-3 et actions de compensation. Rédacteur en attente des chiffres certifiés.',
    docUrl: 'https://docs.google.com/document/d/demo-rse',
    createdAt: daysAgo(16),
    updatedAt: daysAgo(12),
    history: [
      { stageId: 'stage_brief', stageName: '1. Cadrage & Brief', enteredAt: daysAgo(16), leftAt: daysAgo(12), durationDays: 4 },
      { stageId: 'stage_redaction', stageName: '2. Rédaction', enteredAt: daysAgo(12) }
    ]
  },
  {
    id: 'cnt_06',
    title: 'Architecture Sécurité et Chiffrement Cloud',
    urlPath: '/securite',
    directionId: 'dir_produit',
    themeId: 'theme_conformite',
    typologyId: 'typo_produit',
    stageId: 'stage_relecture',
    assigneeId: 'team_thomas',
    businessContactId: 'contact_sophie',
    stageEnteredAt: daysAgo(1), // Seuil warning = 4j -> NOMINAL
    targetDeliveryDate: daysAgo(-4),
    priority: 'moyenne',
    briefNotes: 'Livre blanc et page dédiée aux RSSI avec diagrammes d infrastructure et certification SOC2.',
    docUrl: 'https://docs.google.com/document/d/demo-securite',
    createdAt: daysAgo(14),
    updatedAt: daysAgo(1),
    history: [
      { stageId: 'stage_brief', stageName: '1. Cadrage & Brief', enteredAt: daysAgo(14), leftAt: daysAgo(10), durationDays: 4 },
      { stageId: 'stage_redaction', stageName: '2. Rédaction', enteredAt: daysAgo(10), leftAt: daysAgo(1), durationDays: 9 },
      { stageId: 'stage_relecture', stageName: '3. Relecture', enteredAt: daysAgo(1) }
    ]
  },
  {
    id: 'cnt_07',
    title: 'Centre d Assistance & FAQ Interactive',
    urlPath: '/aide',
    directionId: 'dir_client',
    themeId: 'theme_support',
    typologyId: 'typo_faq',
    stageId: 'stage_redaction',
    assigneeId: 'team_julien',
    businessContactId: 'contact_camille',
    stageEnteredAt: daysAgo(4), // Seuil warning = 7j -> NOMINAL
    targetDeliveryDate: daysAgo(-6),
    priority: 'haute',
    briefNotes: 'Arborescence des 40 questions les plus posées par catégorie (facturation, compte, bugs).',
    docUrl: 'https://docs.google.com/document/d/demo-faq',
    createdAt: daysAgo(7),
    updatedAt: daysAgo(4),
    history: [
      { stageId: 'stage_brief', stageName: '1. Cadrage & Brief', enteredAt: daysAgo(7), leftAt: daysAgo(4), durationDays: 3 },
      { stageId: 'stage_redaction', stageName: '2. Rédaction', enteredAt: daysAgo(4) }
    ]
  },
  {
    id: 'cnt_08',
    title: 'Étude de cas : Déploiement chez Novacorp',
    urlPath: '/cas-clients/novacorp',
    directionId: 'dir_marketing',
    themeId: 'theme_expertises',
    typologyId: 'typo_temoignage',
    stageId: 'stage_publie',
    assigneeId: 'team_sarah',
    businessContactId: 'contact_marc',
    stageEnteredAt: daysAgo(5),
    targetDeliveryDate: daysAgo(6),
    priority: 'moyenne',
    briefNotes: '+35% de productivité mesurée en 3 mois. Validé par le directeur des opérations Novacorp.',
    docUrl: 'https://docs.google.com/document/d/demo-novacorp',
    cmsUrl: 'https://preview.site.fr/cas-clients/novacorp',
    createdAt: daysAgo(30),
    updatedAt: daysAgo(5),
    history: [
      { stageId: 'stage_brief', stageName: '1. Cadrage & Brief', enteredAt: daysAgo(30), leftAt: daysAgo(26), durationDays: 4 },
      { stageId: 'stage_redaction', stageName: '2. Rédaction', enteredAt: daysAgo(26), leftAt: daysAgo(16), durationDays: 10 },
      { stageId: 'stage_relecture', stageName: '3. Relecture', enteredAt: daysAgo(16), leftAt: daysAgo(12), durationDays: 4 },
      { stageId: 'stage_validation_metier', stageName: '4. Validation métier', enteredAt: daysAgo(12), leftAt: daysAgo(8), durationDays: 4 },
      { stageId: 'stage_integration', stageName: '5. Intégration CMS', enteredAt: daysAgo(8), leftAt: daysAgo(5), durationDays: 3 },
      { stageId: 'stage_publie', stageName: '6. En ligne', enteredAt: daysAgo(5) }
    ]
  },
  {
    id: 'cnt_09',
    title: 'Fiche Solution : Module Analytique Temps Réel',
    urlPath: '/solutions/analytique',
    directionId: 'dir_produit',
    themeId: 'theme_offres',
    typologyId: 'typo_produit',
    stageId: 'stage_brief',
    assigneeId: 'team_thomas',
    businessContactId: 'contact_sophie',
    stageEnteredAt: daysAgo(6), // Seuil warning = 5j -> ATTENTION
    targetDeliveryDate: daysAgo(-2),
    priority: 'moyenne',
    briefNotes: 'Attente du document de spécifications API auprès de l équipe Core Platform.',
    createdAt: daysAgo(6),
    updatedAt: daysAgo(6),
    history: [
      { stageId: 'stage_brief', stageName: '1. Cadrage & Brief', enteredAt: daysAgo(6) }
    ]
  },
  {
    id: 'cnt_10',
    title: 'Guide d Intégration des Nouveaux Salariés',
    urlPath: '/recrutement/onboarding',
    directionId: 'dir_rh',
    themeId: 'theme_recrutement',
    typologyId: 'typo_article',
    stageId: 'stage_brief',
    assigneeId: 'team_julien',
    businessContactId: 'contact_antoine',
    stageEnteredAt: daysAgo(2), // Seuil warning = 5j -> NOMINAL
    targetDeliveryDate: daysAgo(-10),
    priority: 'basse',
    briefNotes: 'Focus sur le programme de parrainage et la semaine d immersion.',
    createdAt: daysAgo(2),
    updatedAt: daysAgo(2),
    history: [
      { stageId: 'stage_brief', stageName: '1. Cadrage & Brief', enteredAt: daysAgo(2) }
    ]
  },
  {
    id: 'cnt_11',
    title: 'Landing Page Campagne Salon Tech Paris',
    urlPath: '/evenements/tech-paris-2026',
    directionId: 'dir_marketing',
    themeId: 'theme_offres',
    typologyId: 'typo_landing',
    stageId: 'stage_relecture',
    assigneeId: 'team_sarah',
    businessContactId: 'contact_marc',
    stageEnteredAt: daysAgo(5), // Seuil warning = 4j -> ATTENTION
    targetDeliveryDate: daysAgo(-1),
    priority: 'urgente',
    briefNotes: 'Formulaire de réservation de démo sur le stand B24.',
    docUrl: 'https://docs.google.com/document/d/demo-salon',
    createdAt: daysAgo(12),
    updatedAt: daysAgo(5),
    history: [
      { stageId: 'stage_brief', stageName: '1. Cadrage & Brief', enteredAt: daysAgo(12), leftAt: daysAgo(9), durationDays: 3 },
      { stageId: 'stage_redaction', stageName: '2. Rédaction', enteredAt: daysAgo(9), leftAt: daysAgo(5), durationDays: 4 },
      { stageId: 'stage_relecture', stageName: '3. Relecture', enteredAt: daysAgo(5) }
    ]
  },
  {
    id: 'cnt_12',
    title: 'Conditions Générales de Vente (CGV)',
    urlPath: '/cgv',
    directionId: 'dir_juridique',
    themeId: 'theme_conformite',
    typologyId: 'typo_juridique',
    stageId: 'stage_publie',
    assigneeId: 'team_thomas',
    businessContactId: 'contact_david',
    stageEnteredAt: daysAgo(18),
    targetDeliveryDate: daysAgo(20),
    priority: 'moyenne',
    briefNotes: 'Clauses de résiliation, garanties de niveau de service (SLA 99.9%).',
    cmsUrl: 'https://preview.site.fr/cgv',
    createdAt: daysAgo(45),
    updatedAt: daysAgo(18),
    history: [
      { stageId: 'stage_brief', stageName: '1. Cadrage & Brief', enteredAt: daysAgo(45), leftAt: daysAgo(40), durationDays: 5 },
      { stageId: 'stage_redaction', stageName: '2. Rédaction', enteredAt: daysAgo(40), leftAt: daysAgo(30), durationDays: 10 },
      { stageId: 'stage_relecture', stageName: '3. Relecture', enteredAt: daysAgo(30), leftAt: daysAgo(26), durationDays: 4 },
      { stageId: 'stage_validation_metier', stageName: '4. Validation métier', enteredAt: daysAgo(26), leftAt: daysAgo(21), durationDays: 5 },
      { stageId: 'stage_integration', stageName: '5. Intégration CMS', enteredAt: daysAgo(21), leftAt: daysAgo(18), durationDays: 3 },
      { stageId: 'stage_publie', stageName: '6. En ligne', enteredAt: daysAgo(18) }
    ]
  }
];
