import React from 'react';
import {
  FileCheck,
  Clock,
  AlertTriangle,
  ArrowRight,
  TrendingUp,
  Mail,
  ChevronRight,
  Layers,
  Phone
} from 'lucide-react';
import { useEditorial } from '../../context/EditorialContext';
import { ContentItem } from '../../types/editorial';

interface DashboardViewProps {
  onEditContent: (content: ContentItem) => void;
}

export default function DashboardView({ onEditContent }: DashboardViewProps) {
  const {
    contents,
    stages,
    directions,
    team,
    getAlertForContent,
    getDirection,
    getStage,
    getAssignee,
    getContact,
    moveContentStage,
    setActiveTab,
    setFilterDirection,
    setFilterAlert
  } = useEditorial();

  // Statistiques globales
  const totalContents = contents.length;
  const publishedStage = stages.find((s) => s.isFinal);
  const publishedCount = contents.filter((c) => c.stageId === publishedStage?.id).length;
  const completionRate = totalContents > 0 ? Math.round((publishedCount / totalContents) * 100) : 0;

  // Alertes
  const alertItems = contents
    .map((c) => ({ content: c, alert: getAlertForContent(c) }))
    .filter((x) => x.alert.level === 'warning' || x.alert.level === 'critical')
    .sort((a, b) => {
      // Priorité critique d'abord, puis par nombre de jours de retard
      if (a.alert.level === 'critical' && b.alert.level !== 'critical') return -1;
      if (b.alert.level === 'critical' && a.alert.level !== 'critical') return 1;
      return b.alert.daysInStage - a.alert.daysInStage;
    });

  const criticalCount = alertItems.filter((x) => x.alert.level === 'critical').length;
  const warningCount = alertItems.filter((x) => x.alert.level === 'warning').length;

  // Contenus en cours (ni final, ni début non commencé)
  const inProgressCount = contents.filter((c) => !getStage(c.stageId)?.isFinal).length;

  // Calcul par étape
  const stageStats = stages.map((stg) => {
    const count = contents.filter((c) => c.stageId === stg.id).length;
    const pct = totalContents > 0 ? Math.round((count / totalContents) * 100) : 0;
    return { ...stg, count, pct };
  });

  return (
    <div className="p-6 space-y-6 max-w-7xl mx-auto">
      {/* 1. Bandeau KPI principal */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Total Contenus */}
        <div className="p-4 bg-slate-900 border border-slate-800 rounded-xl">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-xs font-medium uppercase tracking-wider">Total des contenus</span>
            <Layers className="w-4 h-4 text-slate-500" />
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-bold font-mono tabular-nums text-white">
              {totalContents}
            </span>
            <span className="text-xs text-slate-400">pages & fiches</span>
          </div>
          <div className="mt-3 text-xs text-slate-400 flex items-center justify-between">
            <span>En production active</span>
            <span className="font-mono tabular-nums font-semibold text-slate-300">
              {inProgressCount}
            </span>
          </div>
        </div>

        {/* Taux d'achèvement */}
        <div className="p-4 bg-slate-900 border border-slate-800 rounded-xl">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-xs font-medium uppercase tracking-wider">Taux d avancement</span>
            <TrendingUp className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-bold font-mono tabular-nums text-emerald-400">
              {completionRate}%
            </span>
            <span className="text-xs text-slate-400">mis en ligne</span>
          </div>
          {/* Barre de progression */}
          <div className="mt-3 w-full bg-slate-800 rounded-full h-1.5 overflow-hidden">
            <div
              className="bg-emerald-500 h-1.5 rounded-full transition-all duration-500"
              style={{ width: `${completionRate}%` }}
            />
          </div>
        </div>

        {/* Contenus publiés */}
        <div className="p-4 bg-slate-900 border border-slate-800 rounded-xl">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-xs font-medium uppercase tracking-wider">Pages publiées</span>
            <FileCheck className="w-4 h-4 text-indigo-400" />
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-bold font-mono tabular-nums text-white">
              {publishedCount}
            </span>
            <span className="text-xs text-slate-400">/ {totalContents} validées</span>
          </div>
          <div className="mt-3 text-xs text-slate-400 flex items-center justify-between">
            <span>Restantes à finaliser</span>
            <span className="font-mono tabular-nums font-semibold text-indigo-300">
              {totalContents - publishedCount}
            </span>
          </div>
        </div>

        {/* Alertes & Retards */}
        <div
          onClick={() => {
            setFilterAlert('alert_only');
            setActiveTab('contents_list');
          }}
          className={`p-4 rounded-xl border cursor-pointer transition-colors ${
            criticalCount > 0
              ? 'bg-rose-950/30 border-rose-900/60 hover:border-rose-700'
              : warningCount > 0
              ? 'bg-amber-950/30 border-amber-900/60 hover:border-amber-700'
              : 'bg-slate-900 border-slate-800'
          }`}
        >
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-xs font-medium uppercase tracking-wider">Alertes de délai</span>
            <AlertTriangle
              className={`w-4 h-4 ${
                criticalCount > 0 ? 'text-rose-400' : warningCount > 0 ? 'text-amber-400' : 'text-slate-500'
              }`}
            />
          </div>
          <div className="flex items-baseline gap-2">
            <span
              className={`text-3xl font-bold font-mono tabular-nums ${
                criticalCount > 0 ? 'text-rose-400' : warningCount > 0 ? 'text-amber-300' : 'text-slate-300'
              }`}
            >
              {alertItems.length}
            </span>
            <span className="text-xs text-slate-400">dépassements</span>
          </div>
          <div className="mt-3 text-xs flex items-center justify-between">
            <span className="text-slate-400">
              {criticalCount} critique(s) · {warningCount} attention
            </span>
            <span className="text-indigo-400 hover:underline text-[11px] flex items-center gap-0.5">
              Voir <ChevronRight className="w-3 h-3" />
            </span>
          </div>
        </div>
      </div>

      {/* 2. Pipeline global des étapes */}
      <div className="p-5 bg-slate-900 border border-slate-800 rounded-xl space-y-3">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-sm font-semibold text-white">Pipeline de rédaction & workflow</h2>
            <p className="text-xs text-slate-400">
              Répartition des contenus à travers les {stages.length} étapes configurées
            </p>
          </div>
          <button
            onClick={() => setActiveTab('contents_kanban')}
            className="text-xs text-indigo-400 hover:text-indigo-300 flex items-center gap-1 font-medium"
          >
            Vue Kanban détaillée <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-2 pt-2">
          {stageStats.map((stg) => (
            <div
              key={stg.id}
              className={`p-3 rounded-lg border transition-all ${
                stg.isFinal
                  ? 'bg-emerald-950/20 border-emerald-900/50'
                  : 'bg-slate-800/60 border-slate-700/60'
              }`}
            >
              <div className="text-[11px] text-slate-400 font-medium truncate mb-1">
                {stg.name}
              </div>
              <div className="flex items-baseline justify-between">
                <span className="text-xl font-bold font-mono tabular-nums text-white">
                  {stg.count}
                </span>
                <span className="text-xs font-mono tabular-nums text-slate-400">
                  {stg.pct}%
                </span>
              </div>
              <div className="mt-2 text-[10px] text-slate-400">
                {stg.isFinal ? 'Étape finale' : `Max cible: ${stg.targetDays}j`}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 3. Section principale à 2 colonnes : Alertes & Directions */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Colonne Gauche (7 cols) : Tableau des alertes actives */}
        <div className="lg:col-span-7 bg-slate-900 border border-slate-800 rounded-xl p-5 space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="p-1.5 rounded-lg bg-rose-500/10 text-rose-400">
                <AlertTriangle className="w-4 h-4" />
              </div>
              <div>
                <h3 className="text-sm font-semibold text-white">Contenus en dépassement de délai</h3>
                <p className="text-xs text-slate-400">
                  Calculé selon les seuils configurés dans le back-office
                </p>
              </div>
            </div>
            <span className="text-xs font-mono tabular-nums px-2 py-0.5 rounded bg-slate-800 text-slate-300">
              {alertItems.length} à débloquer
            </span>
          </div>

          {alertItems.length === 0 ? (
            <div className="py-8 text-center text-slate-400 text-xs">
              Aucun contenu en retard actuellement. Tout est dans les temps !
            </div>
          ) : (
            <div className="space-y-2.5">
              {alertItems.map(({ content, alert }) => {
                const stage = getStage(content.stageId);
                const assignee = getAssignee(content.assigneeId);
                const contact = getContact(content.businessContactId);
                const direction = getDirection(content.directionId);

                // Étape suivante possible
                const currentIdx = stages.findIndex((s) => s.id === content.stageId);
                const nextStage = currentIdx >= 0 && currentIdx < stages.length - 1 ? stages[currentIdx + 1] : null;

                return (
                  <div
                    key={content.id}
                    className={`p-3.5 rounded-lg border transition-colors ${
                      alert.level === 'critical'
                        ? 'bg-rose-950/20 border-rose-900/50'
                        : 'bg-amber-950/20 border-amber-900/50'
                    }`}
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div className="space-y-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <span
                            className={`text-[10px] font-semibold uppercase px-1.5 py-0.5 rounded ${
                              alert.level === 'critical'
                                ? 'bg-rose-500/20 text-rose-300'
                                : 'bg-amber-500/20 text-amber-300'
                            }`}
                          >
                            {alert.level === 'critical' ? 'Critique' : 'Attention'}
                          </span>
                          <span className="text-xs text-slate-400 truncate">
                            {direction?.name}
                          </span>
                        </div>

                        <h4
                          onClick={() => onEditContent(content)}
                          className="text-xs font-semibold text-white hover:text-indigo-400 cursor-pointer transition-colors truncate"
                        >
                          {content.title}
                        </h4>

                        <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-[11px] text-slate-400 pt-0.5">
                          <span>
                            Étape : <strong className="text-slate-300">{stage?.name}</strong>
                          </span>
                          <span>·</span>
                          <span className="font-mono tabular-nums text-rose-300">
                            {alert.daysInStage} jours dans l étape
                          </span>
                          <span>·</span>
                          <span>
                            Rédacteur : <strong className="text-slate-300">{assignee?.name}</strong>
                          </span>
                        </div>

                        {/* Interlocuteur métier à relancer */}
                        {contact && (
                          <div className="mt-2 pt-2 border-t border-slate-800/80 flex items-center justify-between text-[11px]">
                            <div className="flex items-center gap-2 text-slate-300">
                              <span className="text-slate-400">Interlocuteur métier :</span>
                              <span className="font-medium text-white">{contact.name}</span>
                              <span className="text-slate-400 text-[10px]">({contact.role})</span>
                            </div>
                            <div className="flex items-center gap-2">
                              {contact.email && (
                                <a
                                  href={`mailto:${contact.email}?subject=Relance rédaction web : ${encodeURIComponent(
                                    content.title
                                  )}`}
                                  className="inline-flex items-center gap-1 text-[11px] text-indigo-400 hover:text-indigo-300 transition-colors"
                                  title={`Envoyer un email à ${contact.name}`}
                                >
                                  <Mail className="w-3 h-3" />
                                  <span>Relancer</span>
                                </a>
                              )}
                              {contact.phone && (
                                <span className="text-slate-400 text-[10px] inline-flex items-center gap-0.5">
                                  <Phone className="w-2.5 h-2.5" />
                                  {contact.phone}
                                </span>
                              )}
                            </div>
                          </div>
                        )}
                      </div>

                      {/* Action rapide : avancer d'étape */}
                      {nextStage && (
                        <button
                          onClick={() => moveContentStage(content.id, nextStage.id)}
                          className="shrink-0 p-1.5 text-xs bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-md transition-colors flex items-center gap-1"
                          title={`Valider et passer à : ${nextStage.name}`}
                        >
                          <span>Étape +1</span>
                          <ArrowRight className="w-3 h-3" />
                        </button>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Colonne Droite (5 cols) : Avancement par Direction */}
        <div className="lg:col-span-5 bg-slate-900 border border-slate-800 rounded-xl p-5 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-semibold text-white">Avancement par Direction</h3>
            <span className="text-xs text-slate-400">Suivi du site</span>
          </div>

          <div className="space-y-4">
            {directions.map((dir) => {
              const dirContents = contents.filter((c) => c.directionId === dir.id);
              const totalDir = dirContents.length;
              const publishedDir = dirContents.filter((c) => getStage(c.stageId)?.isFinal).length;
              const dirPct = totalDir > 0 ? Math.round((publishedDir / totalDir) * 100) : 0;
              const dirAlerts = dirContents.filter((c) => {
                const l = getAlertForContent(c).level;
                return l === 'warning' || l === 'critical';
              }).length;

              return (
                <div
                  key={dir.id}
                  onClick={() => {
                    setFilterDirection(dir.id);
                    setActiveTab('contents_list');
                  }}
                  className="p-3 bg-slate-800/40 rounded-lg hover:bg-slate-800/80 transition-colors cursor-pointer border border-slate-800"
                >
                  <div className="flex items-center justify-between mb-1.5">
                    <div className="flex items-center gap-2">
                      <div
                        className="w-2.5 h-2.5 rounded-full"
                        style={{ backgroundColor: dir.color }}
                      />
                      <span className="text-xs font-medium text-slate-200">{dir.name}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      {dirAlerts > 0 && (
                        <span className="text-[10px] text-amber-300 font-mono">
                          {dirAlerts} alerte(s)
                        </span>
                      )}
                      <span className="text-xs font-mono tabular-nums text-slate-300">
                        {publishedDir}/{totalDir} ({dirPct}%)
                      </span>
                    </div>
                  </div>

                  {/* Progress bar */}
                  <div className="w-full bg-slate-700/60 rounded-full h-1.5 overflow-hidden">
                    <div
                      className="h-1.5 rounded-full transition-all duration-500"
                      style={{ width: `${dirPct}%`, backgroundColor: dir.color }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* 4. Charge de l'équipe éditoriale */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-sm font-semibold text-white">Équipe éditoriale (Qui travaille dessus)</h3>
            <p className="text-xs text-slate-400">
              Répartition de la charge de rédaction et alertes individuelles
            </p>
          </div>
          <button
            onClick={() => setActiveTab('backoffice')}
            className="text-xs text-indigo-400 hover:text-indigo-300 font-medium"
          >
            Gérer l équipe dans le back-office →
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3">
          {team.map((member) => {
            const memberContents = contents.filter((c) => c.assigneeId === member.id);
            const inProgress = memberContents.filter((c) => !getStage(c.stageId)?.isFinal).length;
            const completed = memberContents.filter((c) => getStage(c.stageId)?.isFinal).length;
            const alerts = memberContents.filter((c) => {
              const l = getAlertForContent(c).level;
              return l === 'warning' || l === 'critical';
            }).length;

            return (
              <div
                key={member.id}
                className="p-3.5 bg-slate-800/50 border border-slate-800 rounded-xl space-y-2.5"
              >
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-full bg-indigo-500/20 text-indigo-300 font-semibold text-xs flex items-center justify-center border border-indigo-500/30">
                    {member.initials}
                  </div>
                  <div className="min-w-0">
                    <h4 className="text-xs font-semibold text-white truncate">{member.name}</h4>
                    <p className="text-[10px] text-slate-400 truncate">{member.role}</p>
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-1 pt-1 text-center border-t border-slate-700/60 text-xs">
                  <div>
                    <div className="font-mono tabular-nums font-bold text-white text-sm">
                      {inProgress}
                    </div>
                    <div className="text-[10px] text-slate-400">En cours</div>
                  </div>
                  <div>
                    <div className="font-mono tabular-nums font-bold text-emerald-400 text-sm">
                      {completed}
                    </div>
                    <div className="text-[10px] text-slate-400">Validés</div>
                  </div>
                  <div>
                    <div
                      className={`font-mono tabular-nums font-bold text-sm ${
                        alerts > 0 ? 'text-rose-400' : 'text-slate-500'
                      }`}
                    >
                      {alerts}
                    </div>
                    <div className="text-[10px] text-slate-400">Alertes</div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
