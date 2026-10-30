import React from 'react';
import {
  ChevronLeft,
  ChevronRight,
  AlertTriangle,
  ExternalLink,
  Plus,
  User,
  Building
} from 'lucide-react';
import { useEditorial } from '../../context/EditorialContext';
import { ContentItem } from '../../types/editorial';

interface ContentKanbanViewProps {
  onEditContent: (content: ContentItem) => void;
  onNewContent: () => void;
}

export default function ContentKanbanView({ onEditContent, onNewContent }: ContentKanbanViewProps) {
  const {
    stages,
    contents,
    getAlertForContent,
    getDirection,
    getTypology,
    getAssignee,
    getContact,
    moveContentStage,
    searchQuery,
    filterDirection,
    filterTheme,
    filterTypology,
    filterAssignee,
    filterContact,
    filterAlert
  } = useEditorial();

  // Filtrer les contenus
  const filteredContents = contents.filter((item) => {
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const match =
        item.title.toLowerCase().includes(q) ||
        item.urlPath?.toLowerCase().includes(q) ||
        item.briefNotes?.toLowerCase().includes(q);
      if (!match) return false;
    }
    if (filterDirection !== 'all' && item.directionId !== filterDirection) return false;
    if (filterTheme !== 'all' && item.themeId !== filterTheme) return false;
    if (filterTypology !== 'all' && item.typologyId !== filterTypology) return false;
    if (filterAssignee !== 'all' && item.assigneeId !== filterAssignee) return false;
    if (filterContact !== 'all' && item.businessContactId !== filterContact) return false;
    if (filterAlert !== 'all') {
      const alert = getAlertForContent(item);
      if (filterAlert === 'alert_only' && alert.level === 'nominal') return false;
      if (filterAlert === 'critical_only' && alert.level !== 'critical') return false;
      if (filterAlert === 'warning_only' && alert.level !== 'warning') return false;
    }
    return true;
  });

  return (
    <div className="p-6 h-[calc(100vh-4rem)] flex flex-col space-y-4 overflow-hidden">
      <div className="flex items-center justify-between shrink-0">
        <div>
          <h2 className="text-sm font-semibold text-white">Pipeline de rédaction (Vue Kanban)</h2>
          <p className="text-xs text-slate-400">
            Faites progresser vos contenus d étape en étape selon les délais configurés
          </p>
        </div>
        <button
          onClick={onNewContent}
          className="flex items-center gap-1.5 px-3 py-1.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg text-xs font-semibold shadow-sm transition-colors"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>Ajouter un contenu</span>
        </button>
      </div>

      {/* Colonnes Kanban horizontales défilables */}
      <div className="flex-1 flex gap-4 overflow-x-auto pb-4">
        {stages.map((stage, stageIndex) => {
          const stageContents = filteredContents.filter((c) => c.stageId === stage.id);
          const alertCount = stageContents.filter((c) => {
            const l = getAlertForContent(c).level;
            return l === 'warning' || l === 'critical';
          }).length;

          const prevStage = stageIndex > 0 ? stages[stageIndex - 1] : null;
          const nextStage = stageIndex < stages.length - 1 ? stages[stageIndex + 1] : null;

          return (
            <div
              key={stage.id}
              className="w-80 shrink-0 bg-slate-900 border border-slate-800 rounded-xl flex flex-col max-h-full"
            >
              {/* En-tête de colonne */}
              <div className="p-3.5 border-b border-slate-800/80 flex items-center justify-between">
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="text-xs font-semibold text-white truncate">{stage.name}</h3>
                    <span className="text-[11px] font-mono tabular-nums px-1.5 py-0.2 rounded bg-slate-800 text-slate-300">
                      {stageContents.length}
                    </span>
                  </div>
                  <div className="text-[10px] text-slate-400 mt-0.5">
                    {stage.isFinal ? (
                      <span className="text-emerald-400">Étape de publication</span>
                    ) : (
                      <span>Cible: {stage.targetDays}j · Alerte: {stage.warningDays}j</span>
                    )}
                  </div>
                </div>

                {alertCount > 0 && (
                  <span className="text-[10px] font-semibold text-rose-300 bg-rose-500/20 px-1.5 py-0.5 rounded flex items-center gap-1">
                    <AlertTriangle className="w-2.5 h-2.5" />
                    <span>{alertCount}</span>
                  </span>
                )}
              </div>

              {/* Liste des cartes */}
              <div className="flex-1 p-3 overflow-y-auto space-y-2.5">
                {stageContents.length === 0 ? (
                  <div className="py-8 text-center text-slate-400 text-xs">
                    Aucun contenu dans cette étape
                  </div>
                ) : (
                  stageContents.map((content) => {
                    const alert = getAlertForContent(content);
                    const dir = getDirection(content.directionId);
                    const typo = getTypology(content.typologyId);
                    const assignee = getAssignee(content.assigneeId);
                    const contact = getContact(content.businessContactId);

                    return (
                      <div
                        key={content.id}
                        className={`p-3 rounded-lg border transition-all hover:border-slate-700 bg-slate-800/50 space-y-2.5 shadow-sm ${
                          alert.level === 'critical'
                            ? 'border-rose-900/60 bg-rose-950/20'
                            : alert.level === 'warning'
                            ? 'border-amber-900/60 bg-amber-950/20'
                            : 'border-slate-800'
                        }`}
                      >
                        {/* Direction & Alerte */}
                        <div className="flex items-center justify-between text-[11px]">
                          <div className="flex items-center gap-1.5">
                            <span
                              className="w-2 h-2 rounded-full shrink-0"
                              style={{ backgroundColor: dir?.color || '#64748B' }}
                            />
                            <span className="text-slate-300 truncate max-w-[150px]">
                              {dir?.name}
                            </span>
                          </div>

                          {!stage.isFinal && (
                            <span
                              className={`font-mono tabular-nums text-[10px] ${
                                alert.level === 'critical'
                                  ? 'text-rose-300 font-bold'
                                  : alert.level === 'warning'
                                  ? 'text-amber-300 font-semibold'
                                  : 'text-slate-400'
                              }`}
                            >
                              {alert.daysInStage}j / {stage.targetDays}j
                            </span>
                          )}
                        </div>

                        {/* Titre */}
                        <h4
                          onClick={() => onEditContent(content)}
                          className="text-xs font-semibold text-white hover:text-indigo-300 cursor-pointer transition-colors leading-snug"
                        >
                          {content.title}
                        </h4>

                        {/* Typologie & URL */}
                        <div className="text-[11px] text-slate-400 flex items-center justify-between">
                          <span>{typo?.name || 'Standard'}</span>
                          {content.urlPath && (
                            <span className="font-mono text-[10px] truncate max-w-[120px]">
                              {content.urlPath}
                            </span>
                          )}
                        </div>

                        {/* Rédacteur et Interlocuteur */}
                        <div className="pt-2 border-t border-slate-700/60 space-y-1 text-[11px]">
                          <div className="flex items-center justify-between text-slate-300">
                            <span className="text-slate-400 flex items-center gap-1 text-[10px]">
                              <User className="w-3 h-3 text-slate-400" />
                              Rédacteur :
                            </span>
                            <span className="font-medium truncate max-w-[130px]">
                              {assignee?.name || 'Non assigné'}
                            </span>
                          </div>

                          <div className="flex items-center justify-between text-slate-300">
                            <span className="text-slate-400 flex items-center gap-1 text-[10px]">
                              <Building className="w-3 h-3 text-slate-400" />
                              Métier :
                            </span>
                            <span className="font-medium truncate max-w-[130px] text-indigo-300">
                              {contact?.name || 'À définir'}
                            </span>
                          </div>
                        </div>

                        {/* Barre d'action : étape précédente / suivante */}
                        <div className="pt-1 flex items-center justify-between gap-1">
                          {prevStage ? (
                            <button
                              onClick={() => moveContentStage(content.id, prevStage.id)}
                              className="px-2 py-1 text-[10px] bg-slate-800 hover:bg-slate-700 text-slate-300 rounded flex items-center gap-0.5 transition-colors"
                              title={`Revenir à : ${prevStage.name}`}
                            >
                              <ChevronLeft className="w-3 h-3" />
                              <span>Précédent</span>
                            </button>
                          ) : (
                            <div />
                          )}

                          {nextStage && (
                            <button
                              onClick={() => moveContentStage(content.id, nextStage.id)}
                              className="px-2.5 py-1 text-[10px] bg-indigo-600 hover:bg-indigo-500 text-white rounded font-medium flex items-center gap-0.5 transition-colors shadow-sm ml-auto"
                              title={`Valider et passer à : ${nextStage.name}`}
                            >
                              <span>Suivant</span>
                              <ChevronRight className="w-3 h-3" />
                            </button>
                          )}
                        </div>
                      </div>
                    );
                  })
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
