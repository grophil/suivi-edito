import React from 'react';
import {
  LayoutDashboard,
  FileText,
  Kanban,
  Users,
  Settings,
  AlertTriangle,
  RotateCcw
} from 'lucide-react';
import { useEditorial, MainNavTab } from '../../context/EditorialContext';

export default function Sidebar() {
  const { activeTab, setActiveTab, contents, getAlertForContent, resetToDefaults } = useEditorial();

  // Nombre d'alertes actives
  const criticalCount = contents.filter((c) => getAlertForContent(c).level === 'critical').length;
  const warningCount = contents.filter((c) => getAlertForContent(c).level === 'warning').length;
  const totalAlerts = criticalCount + warningCount;

  const navItems: { id: MainNavTab; label: string; icon: React.ElementType; badge?: number; badgeColor?: string }[] = [
    {
      id: 'dashboard',
      label: 'Tableau de bord',
      icon: LayoutDashboard,
      badge: totalAlerts > 0 ? totalAlerts : undefined,
      badgeColor: criticalCount > 0 ? 'bg-rose-500/20 text-rose-300' : 'bg-amber-500/20 text-amber-300'
    },
    {
      id: 'contents_list',
      label: 'Tous les contenus',
      icon: FileText,
      badge: contents.length,
      badgeColor: 'bg-slate-800 text-slate-300'
    },
    {
      id: 'contents_kanban',
      label: 'Pipeline Kanban',
      icon: Kanban
    },
    {
      id: 'contacts',
      label: 'Interlocuteurs métiers',
      icon: Users
    },
    {
      id: 'backoffice',
      label: 'Back-office & Délais',
      icon: Settings
    }
  ];

  return (
    <aside className="w-64 bg-slate-900 border-r border-slate-800 flex flex-col shrink-0 select-none">
      {/* Brand & Workspace */}
      <div className="h-16 px-5 flex items-center gap-3 border-b border-slate-800">
        <div className="w-8 h-8 rounded-lg bg-indigo-600 flex items-center justify-center text-white font-semibold text-sm shadow-sm">
          ÉF
        </div>
        <div>
          <h1 className="text-sm font-semibold text-white tracking-tight leading-tight">
            ÉditoFlow
          </h1>
          <p className="text-xs text-slate-400">Suivi éditorial web</p>
        </div>
      </div>

      {/* Navigation principale */}
      <nav className="flex-1 p-3 space-y-1">
        <div className="px-3 py-1 text-[11px] font-medium uppercase tracking-wider text-slate-400">
          Navigation
        </div>
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`w-full flex items-center justify-between px-3 py-2 text-xs font-medium rounded-lg transition-colors ${
                isActive
                  ? 'bg-indigo-600 text-white shadow-sm'
                  : 'text-slate-300 hover:text-white hover:bg-slate-800/80'
              }`}
            >
              <div className="flex items-center gap-2.5">
                <Icon className={`w-4 h-4 ${isActive ? 'text-white' : 'text-slate-400'}`} />
                <span>{item.label}</span>
              </div>
              {item.badge !== undefined && (
                <span
                  className={`text-[10px] font-mono tabular-nums px-1.5 py-0.5 rounded ${
                    isActive ? 'bg-indigo-700/60 text-white' : item.badgeColor
                  }`}
                >
                  {item.badge}
                </span>
              )}
            </button>
          );
        })}
      </nav>

      {/* Alertes d'état en bas de sidebar */}
      {totalAlerts > 0 && (
        <div className="mx-3 mb-3 p-3 rounded-lg bg-rose-950/40 border border-rose-900/60 text-xs">
          <div className="flex items-center gap-2 text-rose-300 font-semibold mb-1">
            <AlertTriangle className="w-3.5 h-3.5 text-rose-400 shrink-0" />
            <span>Retards détectés</span>
          </div>
          <p className="text-slate-300 text-[11px] leading-relaxed">
            {criticalCount > 0 ? (
              <span className="font-semibold text-rose-300 font-mono tabular-nums">{criticalCount} critique(s)</span>
            ) : null}
            {criticalCount > 0 && warningCount > 0 ? ' · ' : ''}
            {warningCount > 0 ? (
              <span className="text-amber-300 font-mono tabular-nums">{warningCount} en alerte</span>
            ) : null}
          </p>
        </div>
      )}

      {/* Footer avec réinitialisation et info */}
      <div className="p-3 border-t border-slate-800 flex items-center justify-between text-xs text-slate-400">
        <span className="text-[11px]">Projet Refonte Web</span>
        <button
          onClick={() => {
            if (window.confirm('Voulez-vous réinitialiser toutes les données aux valeurs par défaut ?')) {
              resetToDefaults();
            }
          }}
          title="Réinitialiser les données d'exemple"
          className="p-1.5 hover:text-slate-200 hover:bg-slate-800 rounded transition-colors"
        >
          <RotateCcw className="w-3.5 h-3.5" />
        </button>
      </div>
    </aside>
  );
}
