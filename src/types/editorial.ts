export type AlertLevel = 'nominal' | 'warning' | 'critical';

export interface Direction {
  id: string;
  name: string;
  code: string;
  color: string;
  description?: string;
}

export interface Theme {
  id: string;
  name: string;
  color: string;
  description?: string;
}

export interface Typology {
  id: string;
  name: string;
  estimatedWords?: number;
  description?: string;
}

export interface Stage {
  id: string;
  order: number;
  name: string;
  description?: string;
  targetDays: number;     // Délai cible recommandé (jours)
  warningDays: number;    // Seuil déclenchement alerte 'Attention' (jours)
  criticalDays: number;   // Seuil déclenchement alerte 'Critique / Bloqué' (jours)
  isFinal?: boolean;      // Ex: "En ligne / Publié"
}

export interface TeamMember {
  id: string;
  name: string;
  email: string;
  role: string;           // Ex: Rédacteur senior, Copywriter, Relecteur...
  avatar?: string;
  initials: string;
}

export interface BusinessContact {
  id: string;
  name: string;
  role: string;           // Ex: Responsable RSE, Chef de produit, DRH...
  email: string;
  phone?: string;
  directionId: string;
  department?: string;
}

export interface StageHistoryEntry {
  stageId: string;
  stageName: string;
  enteredAt: string; // ISO date
  leftAt?: string;   // ISO date
  durationDays?: number;
}

export type Priority = 'basse' | 'moyenne' | 'haute' | 'urgente';

export interface ContentItem {
  id: string;
  title: string;
  urlPath?: string;
  directionId: string;
  themeId: string;
  typologyId: string;
  stageId: string;
  assigneeId: string;       // Qui travaille dessus (équipe éditoriale)
  businessContactId: string;// Interlocuteur métier
  stageEnteredAt: string;   // Date d'entrée dans l'étape actuelle (ISO)
  targetDeliveryDate?: string;
  priority: Priority;
  briefNotes?: string;
  docUrl?: string;          // Ex: Google Doc ou Notion
  cmsUrl?: string;          // Ex: Lien prévisu WordPress/Strapi
  createdAt: string;
  updatedAt: string;
  history: StageHistoryEntry[];
}

export interface AlertStatus {
  level: AlertLevel;
  daysInStage: number;
  targetDays: number;
  warningDays: number;
  criticalDays: number;
  daysOverdue: number; // >0 si dépassement du warningDays
  message: string;
}
