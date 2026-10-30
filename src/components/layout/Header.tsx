import React from 'react';
import { Plus, Search, Filter, Kanban, List } from 'lucide-react';
import { useEditorial } from '../../context/EditorialContext';

interface HeaderProps {
  onOpenNewContentModal: () => void;
}

export default function Header({ onOpenNewContentModal }: HeaderProps) {
  const {
    activeTab,
    setActiveTab,
    searchQuery,
    setSearchQuery,
    filterAlert,
    setFilterAlert,
    contents,
    getAlertForContent
  } = useEditorial();

  const totalAlerts = contents.filter((c) => {
    const l = getAlertForContent(c).level;
    return l === 'warning' || l === 'critical';
  }).length;

  const breadcrumbLabels: Record<string, string> = {
    dashboard: 'Tableau de bord de suivi',
    contents_list: 'Contenus · Vue Liste & Tableur',
    contents_kanban: 'Contenus · Vue Pipeline Kanban',
    contacts: 'Annuaire des interlocuteurs métiers',
    backoffice: 'Back-office de paramétrage & Délais'
  };

  return (
    <header className="h-16 px-6 bg-slate-900/90 backdrop-blur border-b border-slate-800 flex items-center justify-between gap-6 shrink-0 z-20">
      {/* Left: Breadcrumbs */}
      <div className="flex items-center gap-2 text-xs">
        <span className="text-slate-400">ÉditoFlow</span>
        <span className="text-slate-600">/</span>
        <span className="font-semibold text-slate-200">
          {breadcrumbLabels[activeTab] || 'Vue'}
        </span>
      </div>

      {/* Center: Search & Quick Alert Toggle */}
      <div className="flex items-center gap-3 max-w-md w-full">
        <div className="relative w-full">
          <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Rechercher par titre, URL, mot-clé..."
            className="w-full bg-slate-800/80 border border-slate-700/80 rounded-lg pl-9 pr-3 py-1.5 text-xs text-slate-200 placeholder-slate-400 focus:outline-none focus:border-indigo-500 transition-colors"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-2.5 top-1/2 -translate-y-1/2 text-xs text-slate-400 hover:text-white"
            >
              ×
            </button>
          )}
        </div>

        {/* Quick Filter: Alertes */}
        {totalAlerts > 0 && (
          <button
            onClick={() => {
              if (activeTab !== 'contents_list' && activeTab !== 'contents_kanban') {
                setActiveTab('contents_list');
              }
              setFilterAlert(filterAlert === 'all' ? 'alert_only' : 'all');
            }}
            className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-medium border transition-colors whitespace-nowrap shrink-0 ${
              filterAlert !== 'all'
                ? 'bg-rose-500/20 text-rose-300 border-rose-500/40'
                : 'bg-slate-800/80 text-slate-300 border-slate-700 hover:text-white'
            }`}
            title="Filtrer uniquement les contenus en alerte de délai"
          >
            <Filter className="w-3 h-3 text-rose-400" />
            <span>Alertes ({totalAlerts})</span>
          </button>
        )}
      </div>

      {/* Right Actions */}
      <div className="flex items-center gap-2.5 shrink-0">
        {/* Toggle View (List <-> Kanban) */}
        {(activeTab === 'contents_list' || activeTab === 'contents_kanban') && (
          <div className="flex items-center p-0.5 bg-slate-800 border border-slate-700 rounded-lg text-xs">
            <button
              onClick={() => setActiveTab('contents_list')}
              className={`p-1.5 rounded-md transition-colors ${
                activeTab === 'contents_list'
                  ? 'bg-indigo-600 text-white'
                  : 'text-slate-400 hover:text-white'
              }`}
              title="Vue Liste / Tableur"
            >
              <List className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={() => setActiveTab('contents_kanban')}
              className={`p-1.5 rounded-md transition-colors ${
                activeTab === 'contents_kanban'
                  ? 'bg-indigo-600 text-white'
                  : 'text-slate-400 hover:text-white'
              }`}
              title="Vue Pipeline Kanban"
            >
              <Kanban className="w-3.5 h-3.5" />
            </button>
          </div>
        )}

        {/* Primary CTA: Ajouter un contenu */}
        <button
          onClick={onOpenNewContentModal}
          className="flex items-center gap-1.5 px-3.5 py-1.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg text-xs font-semibold shadow-sm transition-colors whitespace-nowrap"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>Nouveau contenu</span>
        </button>
      </div>
    </header>
  );
}
