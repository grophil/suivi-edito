import { ContentItem, Stage, AlertStatus } from '../types/editorial';

/**
 * Calcule dynamiquement le statut d'alerte d'un contenu en fonction
 * du temps passé dans l'étape courante et des seuils configurés dans le backoffice.
 */
export function calculateAlertStatus(
  content: ContentItem,
  stages: Stage[],
  nowMs: number = Date.now()
): AlertStatus {
  const stage = stages.find((s) => s.id === content.stageId);

  // Valeurs par défaut sécurisées
  if (!stage) {
    return {
      level: 'nominal',
      daysInStage: 0,
      targetDays: 5,
      warningDays: 7,
      criticalDays: 12,
      daysOverdue: 0,
      message: 'Étape non définie'
    };
  }

  // Si c'est l'étape finale (ex: En ligne / Publié), pas d'alerte de retard
  if (stage.isFinal) {
    const enteredDate = new Date(content.stageEnteredAt).getTime();
    const daysInStage = Math.max(0, Math.floor((nowMs - enteredDate) / (1000 * 60 * 60 * 24)));
    return {
      level: 'nominal',
      daysInStage,
      targetDays: stage.targetDays || 0,
      warningDays: stage.warningDays || 0,
      criticalDays: stage.criticalDays || 0,
      daysOverdue: 0,
      message: 'Terminé / Publié'
    };
  }

  const enteredDate = new Date(content.stageEnteredAt).getTime();
  const diffMs = nowMs - enteredDate;
  const daysInStage = Math.max(0, Math.floor(diffMs / (1000 * 60 * 60 * 24)));

  const warningLimit = stage.warningDays ?? 5;
  const criticalLimit = stage.criticalDays ?? 8;
  const targetDays = stage.targetDays ?? 3;

  if (daysInStage >= criticalLimit) {
    const overdue = daysInStage - warningLimit;
    return {
      level: 'critical',
      daysInStage,
      targetDays,
      warningDays: warningLimit,
      criticalDays: criticalLimit,
      daysOverdue: overdue,
      message: `Critique : bloqué depuis ${daysInStage}j (seuil ${criticalLimit}j)`
    };
  }

  if (daysInStage >= warningLimit) {
    const overdue = daysInStage - warningLimit + 1;
    return {
      level: 'warning',
      daysInStage,
      targetDays,
      warningDays: warningLimit,
      criticalDays: criticalLimit,
      daysOverdue: overdue,
      message: `Attention : ${daysInStage}j dans l'étape (seuil ${warningLimit}j)`
    };
  }

  return {
    level: 'nominal',
    daysInStage,
    targetDays,
    warningDays: warningLimit,
    criticalDays: criticalLimit,
    daysOverdue: 0,
    message: `Dans les temps (${daysInStage}/${targetDays}j)`
  };
}

export function formatDateFr(isoDate: string): string {
  try {
    const d = new Date(isoDate);
    return new Intl.DateTimeFormat('fr-FR', {
      day: 'numeric',
      month: 'short',
      year: 'numeric'
    }).format(d);
  } catch {
    return isoDate;
  }
}

export function formatShortDateFr(isoDate: string): string {
  try {
    const d = new Date(isoDate);
    return new Intl.DateTimeFormat('fr-FR', {
      day: '2-digit',
      month: '2-digit'
    }).format(d);
  } catch {
    return isoDate;
  }
}
