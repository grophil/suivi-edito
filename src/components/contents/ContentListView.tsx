import React, { useState, useMemo } from 'react';
import {
  ArrowUpDown,
  ArrowUp,
  ArrowDown,
  Filter,
  Download,
  AlertTriangle,
  ArrowRight,
  Edit2,
  Trash2,
  ExternalLink,
  RotateCcw
} from 'lucide-react';
import { useEditorial } from '../../context/EditorialContext';
import { ContentItem, AlertLevel } from '../../types/editorial';

interface ContentListViewProps {
  onEditContent: (content: ContentItem) => void;
  onNewContent: () => void;
}

type SortField =
  | 'title'
  | 'direction'
  | 'theme'
  | 'typology'
  | 'stage'
  | 'assignee'
  | 'contact'
  | 'daysInStage'
  | 'alertLevel';

export default function ContentListView({ onEditContent, onNewContent }: ContentListViewProps) {
  const {
    contents,
    directions,
    themes,
    typologies,
    stages,
    team,
    contacts,
    getAlertForContent,
    getDirection,
    getTheme,
    getTypology,
    getStage,
    getAssignee,
    getContact,
    moveContentStage,
    bulkMoveStage,
    deleteContent,
    searchQuery,
    setSearchQuery,
    filterDirection,
    setFilterDirection,
    filterTheme,
    setFilterTheme,
    filterTypology,
    setFilterTypology,
    filterStage,
    setFilterStage,
    filterAssignee,
    setFilterAssignee,
    filterContact,
    setFilterContact,
    filterAlert,
    setFilterAlert,
    resetFilters
  } = useEditorial();

  // Tri
  const [sortField, setSortField] = useState<SortField>('daysInStage');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('desc');

  // Sélection multiple
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [bulkTargetStage, setBulkTargetStage] = useState<string>('');

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection(field === 'daysInStage' || field === 'alertLevel' ? 'desc' : 'asc');
    }
  };

  // Filtrage combiné
  const filteredContents = useMemo(() => {
    return contents.filter((item) => {
      // 1. Recherche texte
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const titleMatch = item.title.toLowerCase().includes(q);
        const urlMatch = item.urlPath?.toLowerCase().includes(q);
        const notesMatch = item.briefNotes?.toLowerCase().includes(q);
        if (!titleMatch && !urlMatch && !notesMatch) return false;
      }

      // 2. Filtres déroulants
      if (filterDirection !== 'all' && item.directionId !== filterDirection) return false;
      if (filterTheme !== 'all' && item.themeId !== filterTheme) return false;
      if (filterTypology !== 'all' && item.typologyId !== filterTypology) return false;
      if (filterStage !== 'all' && item.stageId !== filterStage) return false;
      if (filterAssignee !== 'all' && item.assigneeId !== filterAssignee) return false;
      if (filterContact !== 'all' && item.businessContactId !== filterContact) return false;

      // 3. Filtre d'alerte
      if (filterAlert !== 'all') {
        const alert = getAlertForContent(item);
        if (filterAlert === 'alert_only' && alert.level === 'nominal') return false;
        if (filterAlert === 'critical_only' && alert.level !== 'critical') return false;
        if (filterAlert === 'warning_only' && alert.level !== 'warning') return false;
      }

      return true;
    });
  }, [
    contents,
    searchQuery,
    filterDirection,
    filterTheme,
    filterTypology,
    filterStage,
    filterAssignee,
    filterContact,
    filterAlert,
    getAlertForContent
  ]);

  // Tri des contenus filtrés
  const sortedContents = useMemo(() => {
    return [...filteredContents].sort((a, b) => {
      let valA: string | number = '';
      let valB: string | number = '';

      switch (sortField) {
        case 'title':
          valA = a.title.toLowerCase();
          valB = b.title.toLowerCase();
          break;
        case 'direction':
          valA = getDirection(a.directionId)?.name.toLowerCase() || '';
          valB = getDirection(b.directionId)?.name.toLowerCase() || '';
          break;
        case 'theme':
          valA = getTheme(a.themeId)?.name.toLowerCase() || '';
          valB = getTheme(b.themeId)?.name.toLowerCase() || '';
          break;
        case 'typology':
          valA = getTypology(a.typologyId)?.name.toLowerCase() || '';
          valB = getTypology(b.typologyId)?.name.toLowerCase() || '';
          break;
        case 'stage': {
          const stgA = getStage(a.stageId)?.order || 0;
          const stgB = getStage(b.stageId)?.order || 0;
          valA = stgA;
          valB = stgB;
          break;
        }
        case 'assignee':
          valA = getAssignee(a.assigneeId)?.name.toLowerCase() || '';
          valB = getAssignee(b.assigneeId)?.name.toLowerCase() || '';
          break;
        case 'contact':
          valA = getContact(a.businessContactId)?.name.toLowerCase() || '';
          valB = getContact(b.businessContactId)?.name.toLowerCase() || '';
          break;
        case 'daysInStage': {
          valA = getAlertForContent(a).daysInStage;
          valB = getAlertForContent(b).daysInStage;
          break;
        }
        case 'alertLevel': {
          const rank = { critical: 3, warning: 2, nominal: 1 };
          valA = rank[getAlertForContent(a).level];
          valB = rank[getAlertForContent(b).level];
          break;
        }
      }

      if (valA < valB) return sortDirection === 'asc' ? -1 : 1;
      if (valA > valB) return sortDirection === 'asc' ? 1 : -1;
      return 0;
    });
  }, [
    filteredContents,
    sortField,
    sortDirection,
    getDirection,
    getTheme,
    getTypology,
    getStage,
    getAssignee,
    getContact,
    getAlertForContent
  ]);

  // Actions de sélection multiple
  const handleSelectAll = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.checked) {
      setSelectedIds(sortedContents.map((c) => c.id));
    } else {
      setSelectedIds([]);
    }
  };

  const handleToggleSelect = (id: string) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const handleBulkMove = () => {
    if (!bulkTargetStage || selectedIds.length === 0) return;
    bulkMoveStage(selectedIds, bulkTargetStage);
    setSelectedIds([]);
    setBulkTargetStage('');
  };

  // Export CSV
  const handleExportCsv = () => {
    const headers = [
      'Titre',
      'URL',
      'Direction',
      'Thème',
      'Typologie',
      'Étape',
      'Rédacteur',
      'Interlocuteur Métier',
      'Jours dans l étape',
      'Alerte'
    ];

    const rows = sortedContents.map((c) => {
      const alert = getAlertForContent(c);
      return [
        `"${c.title.replace(/"/g, '""')}"`,
        `"${c.urlPath || ''}"`,
        `"${getDirection(c.directionId)?.name || ''}"`,
        `"${getTheme(c.themeId)?.name || ''}"`,
        `"${getTypology(c.typologyId)?.name || ''}"`,
        `"${getStage(c.stageId)?.name || ''}"`,
        `"${getAssignee(c.assigneeId)?.name || ''}"`,
        `"${getContact(c.businessContactId)?.name || ''}"`,
        alert.daysInStage,
        alert.level
      ].join(';');
    });

    const csvContent = '\uFEFF' + [headers.join(';'), ...rows].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `suivi_editorial_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const isAnyFilterActive =
    filterDirection !== 'all' ||
    filterTheme !== 'all' ||
    filterTypology !== 'all' ||
    filterStage !== 'all' ||
    filterAssignee !== 'all' ||
    filterContact !== 'all' ||
    filterAlert !== 'all' ||
    searchQuery.trim().length > 0;

  const renderSortIndicator = (field: SortField) => {
    if (sortField !== field) {
      return <ArrowUpDown className="w-3 h-3 text-slate-600 group-hover:text-slate-400" />;
    }
    return sortDirection === 'asc' ? (
      <ArrowUp className="w-3 h-3 text-indigo-400" />
    ) : (
      <ArrowDown className="w-3 h-3 text-indigo-400" />
    );
  };

  return (
    <div className="p-6 space-y-4 max-w-7xl mx-auto">
      {/* 1. Barre d'outils et de filtres complets */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 space-y-3">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <Filter className="w-4 h-4 text-indigo-400" />
            <h2 className="text-xs font-semibold uppercase tracking-wider text-slate-300">
              Filtres & Tri des contenus
            </h2>
            <span className="text-xs font-mono tabular-nums text-slate-400">
              ({sortedContents.length} / {contents.length} contenus)
            </span>
          </div>

          <div className="flex items-center gap-2">
            {isAnyFilterActive && (
              <button
                onClick={resetFilters}
                className="flex items-center gap-1 px-2.5 py-1 text-xs text-slate-400 hover:text-white bg-slate-800 rounded-lg transition-colors"
                title="Effacer tous les filtres"
              >
                <RotateCcw className="w-3 h-3" />
                <span>Réinitialiser</span>
              </button>
            )}
            <button
              onClick={handleExportCsv}
              className="flex items-center gap-1.5 px-3 py-1 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-lg text-xs font-medium transition-colors"
              title="Exporter la sélection en CSV"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Export CSV</span>
            </button>
          </div>
        </div>

        {/* Ligne des 7 filtres requis */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-7 gap-2 text-xs">
          {/* 1. Direction */}
          <div>
            <label className="block text-[10px] uppercase font-semibold text-slate-400 mb-1">
              Direction
            </label>
            <select
              value={filterDirection}
              onChange={(e) => setFilterDirection(e.target.value)}
              className="w-full bg-slate-800 border border-slate-700 rounded-md px-2 py-1 text-xs text-slate-200 focus:outline-none focus:border-indigo-500"
            >
              <option value="all">Toutes ({directions.length})</option>
              {directions.map((d) => (
                <option key={d.id} value={d.id}>
                  {d.name}
                </option>
              ))}
            </select>
          </div>

          {/* 2. Thème */}
          <div>
            <label className="block text-[10px] uppercase font-semibold text-slate-400 mb-1">
              Thème
            </label>
            <select
              value={filterTheme}
              onChange={(e) => setFilterTheme(e.target.value)}
              className="w-full bg-slate-800 border border-slate-700 rounded-md px-2 py-1 text-xs text-slate-200 focus:outline-none focus:border-indigo-500"
            >
              <option value="all">Tous ({themes.length})</option>
              {themes.map((t) => (
                <option key={t.id} value={t.id}>
                  {t.name}
                </option>
              ))}
            </select>
          </div>

          {/* 3. Typologie */}
          <div>
            <label className="block text-[10px] uppercase font-semibold text-slate-400 mb-1">
              Typologie
            </label>
            <select
              value={filterTypology}
              onChange={(e) => setFilterTypology(e.target.value)}
              className="w-full bg-slate-800 border border-slate-700 rounded-md px-2 py-1 text-xs text-slate-200 focus:outline-none focus:border-indigo-500"
            >
              <option value="all">Toutes ({typologies.length})</option>
              {typologies.map((t) => (
                <option key={t.id} value={t.id}>
                  {t.name}
                </option>
              ))}
            </select>
          </div>

          {/* 4. État d'avancement (Étape) */}
          <div>
            <label className="block text-[10px] uppercase font-semibold text-slate-400 mb-1">
              État d avancement
            </label>
            <select
              value={filterStage}
              onChange={(e) => setFilterStage(e.target.value)}
              className="w-full bg-slate-800 border border-slate-700 rounded-md px-2 py-1 text-xs text-slate-200 focus:outline-none focus:border-indigo-500"
            >
              <option value="all">Toutes étapes ({stages.length})</option>
              {stages.map((s) => (
                <option key={s.id} value={s.id}>
                  {s.name}
                </option>
              ))}
            </select>
          </div>

          {/* 5. Qui travaille dessus (Assignee) */}
          <div>
            <label className="block text-[10px] uppercase font-semibold text-slate-400 mb-1">
              Rédacteur(trice)
            </label>
            <select
              value={filterAssignee}
              onChange={(e) => setFilterAssignee(e.target.value)}
              className="w-full bg-slate-800 border border-slate-700 rounded-md px-2 py-1 text-xs text-slate-200 focus:outline-none focus:border-indigo-500"
            >
              <option value="all">Toute l équipe ({team.length})</option>
              {team.map((m) => (
                <option key={m.id} value={m.id}>
                  {m.name}
                </option>
              ))}
            </select>
          </div>

          {/* 6. Interlocuteur métier */}
          <div>
            <label className="block text-[10px] uppercase font-semibold text-slate-400 mb-1">
              Interlocuteur métier
            </label>
            <select
              value={filterContact}
              onChange={(e) => setFilterContact(e.target.value)}
              className="w-full bg-slate-800 border border-slate-700 rounded-md px-2 py-1 text-xs text-slate-200 focus:outline-none focus:border-indigo-500"
            >
              <option value="all">Tous contacts ({contacts.length})</option>
              {contacts.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name}
                </option>
              ))}
            </select>
          </div>

          {/* 7. Niveau d'alerte */}
          <div>
            <label className="block text-[10px] uppercase font-semibold text-slate-400 mb-1">
              Niveau d alerte
            </label>
            <select
              value={filterAlert}
              onChange={(e) => setFilterAlert(e.target.value as any)}
              className="w-full bg-slate-800 border border-slate-700 rounded-md px-2 py-1 text-xs text-slate-200 focus:outline-none focus:border-indigo-500 font-medium"
            >
              <option value="all">Tous statuts</option>
              <option value="alert_only">Toutes les alertes</option>
              <option value="critical_only">Critique uniquement</option>
              <option value="warning_only">Attention uniquement</option>
            </select>
          </div>
        </div>
      </div>

      {/* 2. Barre d'action par lot si sélection active */}
      {selectedIds.length > 0 && (
        <div className="p-3 bg-indigo-950/40 border border-indigo-800/80 rounded-xl flex flex-wrap items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-2 text-indigo-200">
            <span className="font-mono font-bold">{selectedIds.length}</span>
            <span>contenu(s) sélectionné(s)</span>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-slate-400">Passer à l étape :</span>
            <select
              value={bulkTargetStage}
              onChange={(e) => setBulkTargetStage(e.target.value)}
              className="bg-slate-800 border border-slate-700 rounded px-2 py-1 text-xs text-slate-200"
            >
              <option value="">Sélectionner une étape...</option>
              {stages.map((s) => (
                <option key={s.id} value={s.id}>
                  {s.name}
                </option>
              ))}
            </select>
            <button
              onClick={handleBulkMove}
              disabled={!bulkTargetStage}
              className="px-3 py-1 bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 text-white font-medium rounded transition-colors"
            >
              Appliquer
            </button>
            <button
              onClick={() => setSelectedIds([])}
              className="px-2 py-1 text-slate-400 hover:text-white"
            >
              Annuler
            </button>
          </div>
        </div>
      )}

      {/* 3. Tableau principal */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-slate-800/80 border-b border-slate-700/80 text-[11px] font-semibold text-slate-400 uppercase tracking-wider select-none">
                <th className="py-3 px-3 w-8 text-center">
                  <input
                    type="checkbox"
                    checked={
                      sortedContents.length > 0 && selectedIds.length === sortedContents.length
                    }
                    onChange={handleSelectAll}
                    className="rounded bg-slate-700 border-slate-600 text-indigo-600 focus:ring-0"
                  />
                </th>
                <th
                  onClick={() => handleSort('title')}
                  className="py-3 px-3 cursor-pointer hover:text-slate-200 transition-colors group"
                >
                  <div className="flex items-center gap-1.5">
                    <span>Contenu & URL</span>
                    {renderSortIndicator('title')}
                  </div>
                </th>
                <th
                  onClick={() => handleSort('direction')}
                  className="py-3 px-3 cursor-pointer hover:text-slate-200 transition-colors group"
                >
                  <div className="flex items-center gap-1.5">
                    <span>Direction</span>
                    {renderSortIndicator('direction')}
                  </div>
                </th>
                <th
                  onClick={() => handleSort('theme')}
                  className="py-3 px-3 cursor-pointer hover:text-slate-200 transition-colors group"
                >
                  <div className="flex items-center gap-1.5">
                    <span>Thème</span>
                    {renderSortIndicator('theme')}
                  </div>
                </th>
                <th
                  onClick={() => handleSort('typology')}
                  className="py-3 px-3 cursor-pointer hover:text-slate-200 transition-colors group"
                >
                  <div className="flex items-center gap-1.5">
                    <span>Typologie</span>
                    {renderSortIndicator('typology')}
                  </div>
                </th>
                <th
                  onClick={() => handleSort('stage')}
                  className="py-3 px-3 cursor-pointer hover:text-slate-200 transition-colors group"
                >
                  <div className="flex items-center gap-1.5">
                    <span>État d avancement</span>
                    {renderSortIndicator('stage')}
                  </div>
                </th>
                <th
                  onClick={() => handleSort('assignee')}
                  className="py-3 px-3 cursor-pointer hover:text-slate-200 transition-colors group"
                >
                  <div className="flex items-center gap-1.5">
                    <span>Rédacteur</span>
                    {renderSortIndicator('assignee')}
                  </div>
                </th>
                <th
                  onClick={() => handleSort('contact')}
                  className="py-3 px-3 cursor-pointer hover:text-slate-200 transition-colors group"
                >
                  <div className="flex items-center gap-1.5">
                    <span>Interlocuteur métier</span>
                    {renderSortIndicator('contact')}
                  </div>
                </th>
                <th
                  onClick={() => handleSort('daysInStage')}
                  className="py-3 px-3 cursor-pointer hover:text-slate-200 transition-colors group text-right"
                >
                  <div className="flex items-center justify-end gap-1.5">
                    <span>Délai étape</span>
                    {renderSortIndicator('daysInStage')}
                  </div>
                </th>
                <th
                  onClick={() => handleSort('alertLevel')}
                  className="py-3 px-3 cursor-pointer hover:text-slate-200 transition-colors group"
                >
                  <div className="flex items-center gap-1.5">
                    <span>Alerte</span>
                    {renderSortIndicator('alertLevel')}
                  </div>
                </th>
                <th className="py-3 px-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/80">
              {sortedContents.length === 0 ? (
                <tr>
                  <td colSpan={11} className="py-12 text-center text-slate-400 text-xs">
                    Aucun contenu ne correspond aux filtres appliqués.
                  </td>
                </tr>
              ) : (
                sortedContents.map((item) => {
                  const alert = getAlertForContent(item);
                  const dir = getDirection(item.directionId);
                  const theme = getTheme(item.themeId);
                  const typo = getTypology(item.typologyId);
                  const stage = getStage(item.stageId);
                  const assignee = getAssignee(item.assigneeId);
                  const contact = getContact(item.businessContactId);
                  const isSelected = selectedIds.includes(item.id);

                  // Prochaine étape possible
                  const currentIdx = stages.findIndex((s) => s.id === item.stageId);
                  const nextStage =
                    currentIdx >= 0 && currentIdx < stages.length - 1
                      ? stages[currentIdx + 1]
                      : null;

                  return (
                    <tr
                      key={item.id}
                      className={`hover:bg-slate-800/40 transition-colors ${
                        isSelected ? 'bg-indigo-950/20' : ''
                      }`}
                    >
                      {/* Checkbox */}
                      <td className="py-2.5 px-3 text-center">
                        <input
                          type="checkbox"
                          checked={isSelected}
                          onChange={() => handleToggleSelect(item.id)}
                          className="rounded bg-slate-700 border-slate-600 text-indigo-600 focus:ring-0"
                        />
                      </td>

                      {/* Titre & URL */}
                      <td className="py-2.5 px-3 min-w-[220px]">
                        <div
                          onClick={() => onEditContent(item)}
                          className="font-medium text-slate-100 hover:text-indigo-300 cursor-pointer transition-colors"
                        >
                          {item.title}
                        </div>
                        {item.urlPath && (
                          <div className="text-[11px] font-mono text-slate-400 flex items-center gap-1">
                            <span>{item.urlPath}</span>
                            {item.cmsUrl && (
                              <a
                                href={item.cmsUrl}
                                target="_blank"
                                rel="noreferrer"
                                className="hover:text-indigo-400"
                                title="Voir la prévisualisation"
                              >
                                <ExternalLink className="w-2.5 h-2.5" />
                              </a>
                            )}
                          </div>
                        )}
                      </td>

                      {/* Direction */}
                      <td className="py-2.5 px-3 whitespace-nowrap">
                        <div className="flex items-center gap-1.5">
                          <span
                            className="w-2 h-2 rounded-full shrink-0"
                            style={{ backgroundColor: dir?.color || '#94a3b8' }}
                          />
                          <span className="text-slate-200">{dir?.name || 'Non assigné'}</span>
                        </div>
                      </td>

                      {/* Thème */}
                      <td className="py-2.5 px-3 whitespace-nowrap text-slate-300">
                        {theme?.name || '—'}
                      </td>

                      {/* Typologie */}
                      <td className="py-2.5 px-3 whitespace-nowrap text-slate-400">
                        {typo?.name || '—'}
                      </td>

                      {/* Étape */}
                      <td className="py-2.5 px-3 whitespace-nowrap">
                        <span
                          className={`font-medium ${
                            stage?.isFinal ? 'text-emerald-400' : 'text-slate-200'
                          }`}
                        >
                          {stage?.name || '—'}
                        </span>
                      </td>

                      {/* Assignee */}
                      <td className="py-2.5 px-3 whitespace-nowrap">
                        {assignee ? (
                          <div className="flex items-center gap-1.5">
                            <span className="w-5 h-5 rounded-full bg-slate-800 text-slate-300 text-[10px] flex items-center justify-center font-mono">
                              {assignee.initials}
                            </span>
                            <span className="text-slate-300">{assignee.name}</span>
                          </div>
                        ) : (
                          <span className="text-slate-400">Non assigné</span>
                        )}
                      </td>

                      {/* Interlocuteur métier */}
                      <td className="py-2.5 px-3 whitespace-nowrap">
                        {contact ? (
                          <div className="text-slate-200">
                            <div>{contact.name}</div>
                            <div className="text-[10px] text-slate-400">{contact.role}</div>
                          </div>
                        ) : (
                          <span className="text-slate-400">À définir</span>
                        )}
                      </td>

                      {/* Jours dans l'étape */}
                      <td className="py-2.5 px-3 whitespace-nowrap text-right font-mono tabular-nums">
                        {stage?.isFinal ? (
                          <span className="text-slate-400 text-[11px]">—</span>
                        ) : (
                          <span
                            className={
                              alert.level === 'critical'
                                ? 'text-rose-400 font-semibold'
                                : alert.level === 'warning'
                                ? 'text-amber-300 font-medium'
                                : 'text-slate-300'
                            }
                          >
                            {alert.daysInStage}j
                            <span className="text-slate-400 text-[10px]">
                              {' '}
                              / {stage?.targetDays}j
                            </span>
                          </span>
                        )}
                      </td>

                      {/* Badge Alerte */}
                      <td className="py-2.5 px-3 whitespace-nowrap">
                        {stage?.isFinal ? (
                          <span className="text-emerald-400 text-[11px] font-medium">Terminé</span>
                        ) : alert.level === 'critical' ? (
                          <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-rose-300">
                            <AlertTriangle className="w-3 h-3 text-rose-400" />
                            <span>Critique (+{alert.daysOverdue}j)</span>
                          </span>
                        ) : alert.level === 'warning' ? (
                          <span className="inline-flex items-center gap-1 text-[11px] font-medium text-amber-300">
                            <AlertTriangle className="w-3 h-3 text-amber-400" />
                            <span>Attention (+{alert.daysOverdue}j)</span>
                          </span>
                        ) : (
                          <span className="text-slate-400 text-[11px]">Conforme</span>
                        )}
                      </td>

                      {/* Actions */}
                      <td className="py-2.5 px-3 text-right whitespace-nowrap">
                        <div className="flex items-center justify-end gap-1">
                          {nextStage && (
                            <button
                              onClick={() => moveContentStage(item.id, nextStage.id)}
                              className="p-1 hover:text-indigo-400 hover:bg-slate-800 rounded transition-colors"
                              title={`Avancer à : ${nextStage.name}`}
                            >
                              <ArrowRight className="w-3.5 h-3.5" />
                            </button>
                          )}
                          <button
                            onClick={() => onEditContent(item)}
                            className="p-1 hover:text-slate-200 hover:bg-slate-800 rounded transition-colors"
                            title="Modifier"
                          >
                            <Edit2 className="w-3.5 h-3.5 text-slate-400" />
                          </button>
                          <button
                            onClick={() => {
                              if (window.confirm(`Supprimer le contenu "${item.title}" ?`)) {
                                deleteContent(item.id);
                              }
                            }}
                            className="p-1 hover:text-rose-400 hover:bg-slate-800 rounded transition-colors"
                            title="Supprimer"
                          >
                            <Trash2 className="w-3.5 h-3.5 text-slate-400" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
