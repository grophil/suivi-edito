import React, { useState } from 'react';
import {
  Sliders,
  Compass,
  Tag,
  FileCode,
  Users,
  Database,
  Plus,
  Edit2,
  Trash2,
  AlertTriangle,
  Clock,
  Check,
  RotateCcw,
  Download,
  Upload
} from 'lucide-react';
import { useEditorial } from '../../context/EditorialContext';
import { Direction, Theme, Typology, Stage, TeamMember } from '../../types/editorial';

type BackofficeTab = 'stages' | 'directions' | 'themes' | 'typologies' | 'team' | 'data';

export default function BackofficeView() {
  const {
    directions,
    themes,
    typologies,
    stages,
    team,
    addDirection,
    updateDirection,
    deleteDirection,
    addTheme,
    updateTheme,
    deleteTheme,
    addTypology,
    updateTypology,
    deleteTypology,
    addStage,
    updateStage,
    deleteStage,
    addTeamMember,
    updateTeamMember,
    deleteTeamMember,
    resetToDefaults,
    exportDataJson,
    importDataJson
  } = useEditorial();

  const [activeSubTab, setActiveSubTab] = useState<BackofficeTab>('stages');

  // Modale générique pour les sous-entités
  const [editingStage, setEditingStage] = useState<Stage | null>(null);
  const [editingDirection, setEditingDirection] = useState<Direction | null>(null);
  const [editingTheme, setEditingTheme] = useState<Theme | null>(null);
  const [editingTypology, setEditingTypology] = useState<Typology | null>(null);
  const [editingMember, setEditingMember] = useState<TeamMember | null>(null);

  // Import JSON status
  const [importMessage, setImportMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const subNavItems: { id: BackofficeTab; label: string; icon: React.ElementType }[] = [
    { id: 'stages', label: 'Étapes & Délais d alerte', icon: Clock },
    { id: 'directions', label: 'Directions', icon: Compass },
    { id: 'themes', label: 'Thèmes', icon: Tag },
    { id: 'typologies', label: 'Typologies', icon: FileCode },
    { id: 'team', label: 'Équipe éditoriale', icon: Users },
    { id: 'data', label: 'Données & Import/Export', icon: Database }
  ];

  return (
    <div className="p-6 space-y-6 max-w-7xl mx-auto">
      {/* En-tête du backoffice */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h2 className="text-base font-semibold text-white">Back-office de paramétrage</h2>
          <p className="text-xs text-slate-400">
            Configurez les axes de tri, les étapes de votre workflow et les seuils de délais d alerte
          </p>
        </div>
      </div>

      {/* Barre d'onglets du backoffice */}
      <div className="flex border-b border-slate-800 gap-1 overflow-x-auto text-xs">
        {subNavItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeSubTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => setActiveSubTab(item.id)}
              className={`flex items-center gap-2 px-4 py-2.5 font-medium border-b-2 transition-colors whitespace-nowrap ${
                isActive
                  ? 'border-indigo-500 text-white bg-slate-900/60'
                  : 'border-transparent text-slate-400 hover:text-slate-200'
              }`}
            >
              <Icon className={`w-4 h-4 ${isActive ? 'text-indigo-400' : 'text-slate-400'}`} />
              <span>{item.label}</span>
            </button>
          );
        })}
      </div>

      {/* Contenu de l'onglet actif */}
      <div className="space-y-6">
        {/* ========================================================= */}
        {/* 1. ÉTAPES & DÉLAIS D'ALERTE (CENTRAL)                    */}
        {/* ========================================================= */}
        {activeSubTab === 'stages' && (
          <div className="space-y-4">
            <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-5 space-y-3">
              <div className="flex items-center gap-2 text-indigo-400">
                <AlertTriangle className="w-4 h-4" />
                <h3 className="text-sm font-semibold text-white">
                  Règles de calcul des alertes de délai
                </h3>
              </div>
              <p className="text-xs text-slate-400 leading-relaxed max-w-3xl">
                Chaque contenu présent dans une étape voit son temps calculé automatiquement.
                Si le temps passé dans l étape dépasse le <strong>seuil d attention</strong>, une alerte ambre
                s active. S il dépasse le <strong>seuil critique</strong>, le contenu passe en alerte rouge
                bloquante avec notification sur le tableau de bord.
              </p>
            </div>

            <div className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden shadow-sm">
              <div className="p-4 border-b border-slate-800 flex items-center justify-between">
                <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                  Étapes du workflow séquentiel ({stages.length})
                </span>
                <button
                  onClick={() => {
                    const newStage = addStage({
                      order: stages.length + 1,
                      name: `Nouvelle étape ${stages.length + 1}`,
                      targetDays: 3,
                      warningDays: 5,
                      criticalDays: 8,
                      isFinal: false
                    });
                    setEditingStage(newStage);
                  }}
                  className="flex items-center gap-1.5 px-3 py-1.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg text-xs font-medium"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Ajouter une étape</span>
                </button>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-slate-800/80 text-[11px] font-semibold text-slate-400 uppercase tracking-wider border-b border-slate-700/80">
                    <tr>
                      <th className="py-3 px-4 w-12 text-center">Ordre</th>
                      <th className="py-3 px-4">Nom de l étape</th>
                      <th className="py-3 px-4 text-center">Délai cible</th>
                      <th className="py-3 px-4 text-center">Seuil Attention</th>
                      <th className="py-3 px-4 text-center">Seuil Critique</th>
                      <th className="py-3 px-4">Type</th>
                      <th className="py-3 px-4 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800">
                    {stages.map((stg) => (
                      <tr key={stg.id} className="hover:bg-slate-800/40">
                        <td className="py-3 px-4 text-center font-mono tabular-nums text-slate-400">
                          {stg.order}
                        </td>
                        <td className="py-3 px-4">
                          <span className="font-semibold text-slate-100">{stg.name}</span>
                          {stg.description && (
                            <p className="text-[11px] text-slate-400">{stg.description}</p>
                          )}
                        </td>
                        <td className="py-3 px-4 text-center font-mono tabular-nums text-slate-300">
                          {stg.isFinal ? '—' : `${stg.targetDays} jours`}
                        </td>
                        <td className="py-3 px-4 text-center font-mono tabular-nums text-amber-300 font-medium">
                          {stg.isFinal ? '—' : `≥ ${stg.warningDays} jours`}
                        </td>
                        <td className="py-3 px-4 text-center font-mono tabular-nums text-rose-400 font-semibold">
                          {stg.isFinal ? '—' : `≥ ${stg.criticalDays} jours`}
                        </td>
                        <td className="py-3 px-4">
                          {stg.isFinal ? (
                            <span className="text-emerald-400 text-[11px] font-medium">
                              Étape finale (En ligne)
                            </span>
                          ) : (
                            <span className="text-slate-400 text-[11px]">En cours</span>
                          )}
                        </td>
                        <td className="py-3 px-4 text-right">
                          <button
                            onClick={() => setEditingStage(stg)}
                            className="p-1 hover:text-indigo-400 hover:bg-slate-800 rounded transition-colors mr-1"
                            title="Modifier les délais"
                          >
                            <Edit2 className="w-3.5 h-3.5 text-slate-400" />
                          </button>
                          {!stg.isFinal && (
                            <button
                              onClick={() => {
                                if (window.confirm(`Supprimer l étape ${stg.name} ?`)) {
                                  deleteStage(stg.id);
                                }
                              }}
                              className="p-1 hover:text-rose-400 hover:bg-slate-800 rounded transition-colors"
                              title="Supprimer"
                            >
                              <Trash2 className="w-3.5 h-3.5 text-slate-400" />
                            </button>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* ========================================================= */}
        {/* 2. DIRECTIONS                                             */}
        {/* ========================================================= */}
        {activeSubTab === 'directions' && (
          <div className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden shadow-sm">
            <div className="p-4 border-b border-slate-800 flex items-center justify-between">
              <div>
                <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                  Directions organisationnelles ({directions.length})
                </h3>
                <p className="text-xs text-slate-400">
                  Périmètres métiers propriétaires des contenus web
                </p>
              </div>
              <button
                onClick={() => {
                  const newDir = addDirection({
                    name: 'Nouvelle Direction',
                    code: 'DIR',
                    color: '#6366F1',
                    description: ''
                  });
                  setEditingDirection(newDir);
                }}
                className="flex items-center gap-1.5 px-3 py-1.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg text-xs font-medium"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Ajouter une direction</span>
              </button>
            </div>

            <div className="divide-y divide-slate-800">
              {directions.map((dir) => (
                <div
                  key={dir.id}
                  className="p-4 flex items-center justify-between hover:bg-slate-800/40 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <span
                      className="w-4 h-4 rounded-full shrink-0"
                      style={{ backgroundColor: dir.color }}
                    />
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-semibold text-slate-100 text-xs">{dir.name}</span>
                        <span className="font-mono text-[10px] px-1.5 py-0.5 rounded bg-slate-800 text-slate-300">
                          {dir.code}
                        </span>
                      </div>
                      {dir.description && (
                        <p className="text-xs text-slate-400">{dir.description}</p>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => setEditingDirection(dir)}
                      className="p-1.5 hover:text-indigo-400 rounded hover:bg-slate-800"
                    >
                      <Edit2 className="w-3.5 h-3.5 text-slate-400" />
                    </button>
                    <button
                      onClick={() => {
                        if (window.confirm(`Supprimer la direction ${dir.name} ?`)) {
                          deleteDirection(dir.id);
                        }
                      }}
                      className="p-1.5 hover:text-rose-400 rounded hover:bg-slate-800"
                    >
                      <Trash2 className="w-3.5 h-3.5 text-slate-400" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ========================================================= */}
        {/* 3. THÈMES                                                 */}
        {/* ========================================================= */}
        {activeSubTab === 'themes' && (
          <div className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden shadow-sm">
            <div className="p-4 border-b border-slate-800 flex items-center justify-between">
              <div>
                <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                  Thèmes éditoriaux ({themes.length})
                </h3>
                <p className="text-xs text-slate-400">Sujets et piliers de contenu du site</p>
              </div>
              <button
                onClick={() => {
                  const newTheme = addTheme({
                    name: 'Nouveau Thème',
                    color: '#10B981',
                    description: ''
                  });
                  setEditingTheme(newTheme);
                }}
                className="flex items-center gap-1.5 px-3 py-1.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg text-xs font-medium"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Ajouter un thème</span>
              </button>
            </div>

            <div className="divide-y divide-slate-800">
              {themes.map((th) => (
                <div
                  key={th.id}
                  className="p-4 flex items-center justify-between hover:bg-slate-800/40 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <span
                      className="w-3 h-3 rounded-full shrink-0"
                      style={{ backgroundColor: th.color }}
                    />
                    <div>
                      <span className="font-semibold text-slate-100 text-xs">{th.name}</span>
                      {th.description && (
                        <p className="text-xs text-slate-400">{th.description}</p>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => setEditingTheme(th)}
                      className="p-1.5 hover:text-indigo-400 rounded hover:bg-slate-800"
                    >
                      <Edit2 className="w-3.5 h-3.5 text-slate-400" />
                    </button>
                    <button
                      onClick={() => {
                        if (window.confirm(`Supprimer le thème ${th.name} ?`)) {
                          deleteTheme(th.id);
                        }
                      }}
                      className="p-1.5 hover:text-rose-400 rounded hover:bg-slate-800"
                    >
                      <Trash2 className="w-3.5 h-3.5 text-slate-400" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ========================================================= */}
        {/* 4. TYPOLOGIES                                             */}
        {/* ========================================================= */}
        {activeSubTab === 'typologies' && (
          <div className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden shadow-sm">
            <div className="p-4 border-b border-slate-800 flex items-center justify-between">
              <div>
                <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                  Typologies de contenus ({typologies.length})
                </h3>
                <p className="text-xs text-slate-400">
                  Formats de pages (Pages piliers, articles de blog, fiches produits, FAQ...)
                </p>
              </div>
              <button
                onClick={() => {
                  const newTypo = addTypology({
                    name: 'Nouveau Format',
                    estimatedWords: 800,
                    description: ''
                  });
                  setEditingTypology(newTypo);
                }}
                className="flex items-center gap-1.5 px-3 py-1.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg text-xs font-medium"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Ajouter une typologie</span>
              </button>
            </div>

            <div className="divide-y divide-slate-800">
              {typologies.map((ty) => (
                <div
                  key={ty.id}
                  className="p-4 flex items-center justify-between hover:bg-slate-800/40 transition-colors"
                >
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-semibold text-slate-100 text-xs">{ty.name}</span>
                      {ty.estimatedWords && (
                        <span className="font-mono text-[10px] text-slate-400">
                          ~{ty.estimatedWords} mots
                        </span>
                      )}
                    </div>
                    {ty.description && (
                      <p className="text-xs text-slate-400">{ty.description}</p>
                    )}
                  </div>

                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => setEditingTypology(ty)}
                      className="p-1.5 hover:text-indigo-400 rounded hover:bg-slate-800"
                    >
                      <Edit2 className="w-3.5 h-3.5 text-slate-400" />
                    </button>
                    <button
                      onClick={() => {
                        if (window.confirm(`Supprimer la typologie ${ty.name} ?`)) {
                          deleteTypology(ty.id);
                        }
                      }}
                      className="p-1.5 hover:text-rose-400 rounded hover:bg-slate-800"
                    >
                      <Trash2 className="w-3.5 h-3.5 text-slate-400" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ========================================================= */}
        {/* 5. ÉQUIPE ÉDITORIALE                                      */}
        {/* ========================================================= */}
        {activeSubTab === 'team' && (
          <div className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden shadow-sm">
            <div className="p-4 border-b border-slate-800 flex items-center justify-between">
              <div>
                <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                  Équipe éditoriale (Qui travaille dessus) ({team.length})
                </h3>
                <p className="text-xs text-slate-400">
                  Rédacteurs, copywriters, relecteurs et intégrateurs assignables aux contenus
                </p>
              </div>
              <button
                onClick={() => {
                  const newMember = addTeamMember({
                    name: 'Nouveau Membre',
                    email: 'membre@entreprise.com',
                    role: 'Rédacteur Web',
                    initials: 'NM'
                  });
                  setEditingMember(newMember);
                }}
                className="flex items-center gap-1.5 px-3 py-1.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg text-xs font-medium"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Ajouter un rédacteur</span>
              </button>
            </div>

            <div className="divide-y divide-slate-800">
              {team.map((member) => (
                <div
                  key={member.id}
                  className="p-4 flex items-center justify-between hover:bg-slate-800/40 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <span className="w-8 h-8 rounded-full bg-indigo-500/20 text-indigo-300 font-semibold text-xs flex items-center justify-center font-mono">
                      {member.initials}
                    </span>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-semibold text-slate-100 text-xs">{member.name}</span>
                        <span className="text-[11px] text-slate-400">({member.role})</span>
                      </div>
                      <p className="text-xs text-slate-400">{member.email}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => setEditingMember(member)}
                      className="p-1.5 hover:text-indigo-400 rounded hover:bg-slate-800"
                    >
                      <Edit2 className="w-3.5 h-3.5 text-slate-400" />
                    </button>
                    <button
                      onClick={() => {
                        if (window.confirm(`Supprimer ${member.name} de l équipe ?`)) {
                          deleteTeamMember(member.id);
                        }
                      }}
                      className="p-1.5 hover:text-rose-400 rounded hover:bg-slate-800"
                    >
                      <Trash2 className="w-3.5 h-3.5 text-slate-400" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ========================================================= */}
        {/* 6. DONNÉES & IMPORT/EXPORT                                */}
        {/* ========================================================= */}
        {activeSubTab === 'data' && (
          <div className="space-y-4">
            <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 space-y-4">
              <h3 className="text-sm font-semibold text-white">
                Gestion, sauvegarde et réinitialisation des données
              </h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Toutes les modifications apportées dans l application sont sauvegardées localement
                dans votre navigateur. Vous pouvez exporter l ensemble de votre projet au format JSON
                pour le sauvegarder ou le partager.
              </p>

              {importMessage && (
                <div
                  className={`p-3 rounded-lg text-xs ${
                    importMessage.type === 'success'
                      ? 'bg-emerald-950/40 border border-emerald-900 text-emerald-300'
                      : 'bg-rose-950/40 border border-rose-900 text-rose-300'
                  }`}
                >
                  {importMessage.text}
                </div>
              )}

              <div className="flex flex-wrap gap-3 pt-2">
                <button
                  onClick={() => {
                    const json = exportDataJson();
                    const blob = new Blob([json], { type: 'application/json' });
                    const url = URL.createObjectURL(blob);
                    const a = document.createElement('a');
                    a.href = url;
                    a.download = `editoflow_backup_${new Date().toISOString().slice(0, 10)}.json`;
                    a.click();
                  }}
                  className="flex items-center gap-2 px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg text-xs font-semibold shadow-sm transition-colors"
                >
                  <Download className="w-4 h-4" />
                  <span>Exporter toutes les données (JSON)</span>
                </button>

                <label className="flex items-center gap-2 px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-lg text-xs font-medium cursor-pointer transition-colors">
                  <Upload className="w-4 h-4" />
                  <span>Importer un fichier JSON</span>
                  <input
                    type="file"
                    accept=".json"
                    className="hidden"
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (!file) return;
                      const reader = new FileReader();
                      reader.onload = (event) => {
                        const content = event.target?.result as string;
                        const ok = importDataJson(content);
                        if (ok) {
                          setImportMessage({
                            type: 'success',
                            text: 'Import réussi ! Toutes les données ont été mises à jour.'
                          });
                        } else {
                          setImportMessage({
                            type: 'error',
                            text: 'Erreur lors de la lecture du fichier JSON. Format invalide.'
                          });
                        }
                      };
                      reader.readAsText(file);
                    }}
                  />
                </label>

                <button
                  onClick={() => {
                    if (
                      window.confirm(
                        'Attention : cela va réinitialiser tous les contenus, directions et étapes aux données initiales du projet. Continuer ?'
                      )
                    ) {
                      resetToDefaults();
                      setImportMessage({
                        type: 'success',
                        text: 'Données réinitialisées aux valeurs initiales d exemple.'
                      });
                    }
                  }}
                  className="flex items-center gap-2 px-4 py-2 bg-rose-950/40 hover:bg-rose-900/60 text-rose-300 border border-rose-900/80 rounded-lg text-xs font-medium transition-colors"
                >
                  <RotateCcw className="w-4 h-4" />
                  <span>Réinitialiser les données d exemple</span>
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* ========================================================= */}
      {/* MODALES DE MODIFICATION DU BACKOFFICE                      */}
      {/* ========================================================= */}

      {/* 1. Modal Édition Étape & Délais */}
      {editingStage && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
          <div className="bg-slate-900 border border-slate-800 rounded-xl max-w-md w-full p-5 space-y-4 shadow-2xl">
            <h3 className="text-sm font-semibold text-white">
              Paramétrer l étape et ses délais d alerte
            </h3>

            <div className="space-y-3 text-xs">
              <div>
                <label className="block text-slate-300 font-medium mb-1">Nom de l étape *</label>
                <input
                  type="text"
                  value={editingStage.name}
                  onChange={(e) => setEditingStage({ ...editingStage, name: e.target.value })}
                  className="w-full bg-slate-800 border border-slate-700 rounded-lg p-2 text-white"
                />
              </div>

              <div>
                <label className="block text-slate-300 font-medium mb-1">Description / Objectif</label>
                <input
                  type="text"
                  value={editingStage.description || ''}
                  onChange={(e) =>
                    setEditingStage({ ...editingStage, description: e.target.value })
                  }
                  className="w-full bg-slate-800 border border-slate-700 rounded-lg p-2 text-white"
                />
              </div>

              <div className="grid grid-cols-3 gap-2">
                <div>
                  <label className="block text-slate-300 font-medium mb-1 text-[11px]">
                    Délai cible (j)
                  </label>
                  <input
                    type="number"
                    min="1"
                    value={editingStage.targetDays}
                    onChange={(e) =>
                      setEditingStage({
                        ...editingStage,
                        targetDays: parseInt(e.target.value, 10) || 1
                      })
                    }
                    className="w-full bg-slate-800 border border-slate-700 rounded-lg p-2 text-white font-mono text-center"
                  />
                </div>

                <div>
                  <label className="block text-amber-300 font-medium mb-1 text-[11px]">
                    Alerte Attention (j)
                  </label>
                  <input
                    type="number"
                    min="1"
                    value={editingStage.warningDays}
                    onChange={(e) =>
                      setEditingStage({
                        ...editingStage,
                        warningDays: parseInt(e.target.value, 10) || 1
                      })
                    }
                    className="w-full bg-slate-800 border border-slate-700 rounded-lg p-2 text-amber-300 font-mono text-center"
                  />
                </div>

                <div>
                  <label className="block text-rose-400 font-medium mb-1 text-[11px]">
                    Alerte Critique (j)
                  </label>
                  <input
                    type="number"
                    min="1"
                    value={editingStage.criticalDays}
                    onChange={(e) =>
                      setEditingStage({
                        ...editingStage,
                        criticalDays: parseInt(e.target.value, 10) || 1
                      })
                    }
                    className="w-full bg-slate-800 border border-slate-700 rounded-lg p-2 text-rose-400 font-mono text-center"
                  />
                </div>
              </div>

              <div className="flex items-center gap-2 pt-2">
                <input
                  type="checkbox"
                  id="isFinalCheckbox"
                  checked={editingStage.isFinal || false}
                  onChange={(e) =>
                    setEditingStage({ ...editingStage, isFinal: e.target.checked })
                  }
                  className="rounded bg-slate-700 border-slate-600 text-indigo-600 focus:ring-0"
                />
                <label htmlFor="isFinalCheckbox" className="text-slate-300 text-xs">
                  Cette étape représente la mise en ligne finale (ne déclenche pas d alerte de retard)
                </label>
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-2 border-t border-slate-800">
              <button
                onClick={() => setEditingStage(null)}
                className="px-3 py-1.5 text-slate-400 hover:text-white"
              >
                Annuler
              </button>
              <button
                onClick={() => {
                  updateStage(editingStage.id, editingStage);
                  setEditingStage(null);
                }}
                className="px-4 py-1.5 bg-indigo-600 hover:bg-indigo-500 text-white font-medium rounded-lg"
              >
                Enregistrer les délais
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 2. Modal Édition Direction */}
      {editingDirection && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
          <div className="bg-slate-900 border border-slate-800 rounded-xl max-w-md w-full p-5 space-y-4 shadow-2xl text-xs">
            <h3 className="text-sm font-semibold text-white">Paramétrer la Direction</h3>
            <div className="space-y-3">
              <div>
                <label className="block text-slate-300 font-medium mb-1">Nom de la direction</label>
                <input
                  type="text"
                  value={editingDirection.name}
                  onChange={(e) =>
                    setEditingDirection({ ...editingDirection, name: e.target.value })
                  }
                  className="w-full bg-slate-800 border border-slate-700 rounded-lg p-2 text-white"
                />
              </div>
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-slate-300 font-medium mb-1">Code / Sigle</label>
                  <input
                    type="text"
                    value={editingDirection.code}
                    onChange={(e) =>
                      setEditingDirection({ ...editingDirection, code: e.target.value })
                    }
                    className="w-full bg-slate-800 border border-slate-700 rounded-lg p-2 text-white font-mono uppercase"
                  />
                </div>
                <div>
                  <label className="block text-slate-300 font-medium mb-1">Couleur</label>
                  <input
                    type="color"
                    value={editingDirection.color}
                    onChange={(e) =>
                      setEditingDirection({ ...editingDirection, color: e.target.value })
                    }
                    className="w-full h-9 bg-slate-800 border border-slate-700 rounded-lg p-1 cursor-pointer"
                  />
                </div>
              </div>
              <div>
                <label className="block text-slate-300 font-medium mb-1">Description</label>
                <input
                  type="text"
                  value={editingDirection.description || ''}
                  onChange={(e) =>
                    setEditingDirection({ ...editingDirection, description: e.target.value })
                  }
                  className="w-full bg-slate-800 border border-slate-700 rounded-lg p-2 text-white"
                />
              </div>
            </div>
            <div className="flex justify-end gap-2 pt-2 border-t border-slate-800">
              <button
                onClick={() => setEditingDirection(null)}
                className="px-3 py-1.5 text-slate-400 hover:text-white"
              >
                Annuler
              </button>
              <button
                onClick={() => {
                  updateDirection(editingDirection.id, editingDirection);
                  setEditingDirection(null);
                }}
                className="px-4 py-1.5 bg-indigo-600 hover:bg-indigo-500 text-white font-medium rounded-lg"
              >
                Enregistrer
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 3. Modal Édition Thème */}
      {editingTheme && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
          <div className="bg-slate-900 border border-slate-800 rounded-xl max-w-md w-full p-5 space-y-4 shadow-2xl text-xs">
            <h3 className="text-sm font-semibold text-white">Paramétrer le Thème</h3>
            <div className="space-y-3">
              <div>
                <label className="block text-slate-300 font-medium mb-1">Nom du thème</label>
                <input
                  type="text"
                  value={editingTheme.name}
                  onChange={(e) => setEditingTheme({ ...editingTheme, name: e.target.value })}
                  className="w-full bg-slate-800 border border-slate-700 rounded-lg p-2 text-white"
                />
              </div>
              <div>
                <label className="block text-slate-300 font-medium mb-1">Couleur</label>
                <input
                  type="color"
                  value={editingTheme.color}
                  onChange={(e) => setEditingTheme({ ...editingTheme, color: e.target.value })}
                  className="w-full h-9 bg-slate-800 border border-slate-700 rounded-lg p-1 cursor-pointer"
                />
              </div>
              <div>
                <label className="block text-slate-300 font-medium mb-1">Description</label>
                <input
                  type="text"
                  value={editingTheme.description || ''}
                  onChange={(e) =>
                    setEditingTheme({ ...editingTheme, description: e.target.value })
                  }
                  className="w-full bg-slate-800 border border-slate-700 rounded-lg p-2 text-white"
                />
              </div>
            </div>
            <div className="flex justify-end gap-2 pt-2 border-t border-slate-800">
              <button
                onClick={() => setEditingTheme(null)}
                className="px-3 py-1.5 text-slate-400 hover:text-white"
              >
                Annuler
              </button>
              <button
                onClick={() => {
                  updateTheme(editingTheme.id, editingTheme);
                  setEditingTheme(null);
                }}
                className="px-4 py-1.5 bg-indigo-600 hover:bg-indigo-500 text-white font-medium rounded-lg"
              >
                Enregistrer
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 4. Modal Édition Typologie */}
      {editingTypology && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
          <div className="bg-slate-900 border border-slate-800 rounded-xl max-w-md w-full p-5 space-y-4 shadow-2xl text-xs">
            <h3 className="text-sm font-semibold text-white">Paramétrer la Typologie de contenu</h3>
            <div className="space-y-3">
              <div>
                <label className="block text-slate-300 font-medium mb-1">Nom du format</label>
                <input
                  type="text"
                  value={editingTypology.name}
                  onChange={(e) =>
                    setEditingTypology({ ...editingTypology, name: e.target.value })
                  }
                  className="w-full bg-slate-800 border border-slate-700 rounded-lg p-2 text-white"
                />
              </div>
              <div>
                <label className="block text-slate-300 font-medium mb-1">
                  Volume moyen de mots estimé
                </label>
                <input
                  type="number"
                  value={editingTypology.estimatedWords || ''}
                  onChange={(e) =>
                    setEditingTypology({
                      ...editingTypology,
                      estimatedWords: parseInt(e.target.value, 10) || undefined
                    })
                  }
                  className="w-full bg-slate-800 border border-slate-700 rounded-lg p-2 text-white font-mono"
                />
              </div>
              <div>
                <label className="block text-slate-300 font-medium mb-1">Description</label>
                <input
                  type="text"
                  value={editingTypology.description || ''}
                  onChange={(e) =>
                    setEditingTypology({ ...editingTypology, description: e.target.value })
                  }
                  className="w-full bg-slate-800 border border-slate-700 rounded-lg p-2 text-white"
                />
              </div>
            </div>
            <div className="flex justify-end gap-2 pt-2 border-t border-slate-800">
              <button
                onClick={() => setEditingTypology(null)}
                className="px-3 py-1.5 text-slate-400 hover:text-white"
              >
                Annuler
              </button>
              <button
                onClick={() => {
                  updateTypology(editingTypology.id, editingTypology);
                  setEditingTypology(null);
                }}
                className="px-4 py-1.5 bg-indigo-600 hover:bg-indigo-500 text-white font-medium rounded-lg"
              >
                Enregistrer
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 5. Modal Édition Rédacteur */}
      {editingMember && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
          <div className="bg-slate-900 border border-slate-800 rounded-xl max-w-md w-full p-5 space-y-4 shadow-2xl text-xs">
            <h3 className="text-sm font-semibold text-white">
              Paramétrer le membre de l équipe éditoriale
            </h3>
            <div className="space-y-3">
              <div>
                <label className="block text-slate-300 font-medium mb-1">Nom et prénom *</label>
                <input
                  type="text"
                  value={editingMember.name}
                  onChange={(e) =>
                    setEditingMember({
                      ...editingMember,
                      name: e.target.value,
                      initials: e.target.value
                        .split(' ')
                        .map((n) => n[0])
                        .join('')
                        .toUpperCase()
                        .slice(0, 2)
                    })
                  }
                  className="w-full bg-slate-800 border border-slate-700 rounded-lg p-2 text-white"
                />
              </div>
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-slate-300 font-medium mb-1">Rôle / Titre *</label>
                  <input
                    type="text"
                    value={editingMember.role}
                    onChange={(e) =>
                      setEditingMember({ ...editingMember, role: e.target.value })
                    }
                    className="w-full bg-slate-800 border border-slate-700 rounded-lg p-2 text-white"
                  />
                </div>
                <div>
                  <label className="block text-slate-300 font-medium mb-1">Initiales</label>
                  <input
                    type="text"
                    value={editingMember.initials}
                    onChange={(e) =>
                      setEditingMember({ ...editingMember, initials: e.target.value })
                    }
                    className="w-full bg-slate-800 border border-slate-700 rounded-lg p-2 text-white font-mono uppercase"
                  />
                </div>
              </div>
              <div>
                <label className="block text-slate-300 font-medium mb-1">Email *</label>
                <input
                  type="email"
                  value={editingMember.email}
                  onChange={(e) =>
                    setEditingMember({ ...editingMember, email: e.target.value })
                  }
                  className="w-full bg-slate-800 border border-slate-700 rounded-lg p-2 text-white"
                />
              </div>
            </div>
            <div className="flex justify-end gap-2 pt-2 border-t border-slate-800">
              <button
                onClick={() => setEditingMember(null)}
                className="px-3 py-1.5 text-slate-400 hover:text-white"
              >
                Annuler
              </button>
              <button
                onClick={() => {
                  updateTeamMember(editingMember.id, editingMember);
                  setEditingMember(null);
                }}
                className="px-4 py-1.5 bg-indigo-600 hover:bg-indigo-500 text-white font-medium rounded-lg"
              >
                Enregistrer
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
