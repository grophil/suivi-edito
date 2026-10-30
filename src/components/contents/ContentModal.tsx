import React, { useState, useEffect } from 'react';
import {
  X,
  Plus,
  AlertTriangle,
  Clock,
  ExternalLink,
  UserPlus,
  History,
  Check
} from 'lucide-react';
import { useEditorial } from '../../context/EditorialContext';
import { ContentItem, Priority } from '../../types/editorial';
import { formatDateFr } from '../../utils/alerts';

interface ContentModalProps {
  isOpen: boolean;
  onClose: () => void;
  contentToEdit?: ContentItem | null;
}

export default function ContentModal({ isOpen, onClose, contentToEdit }: ContentModalProps) {
  const {
    directions,
    themes,
    typologies,
    stages,
    team,
    contacts,
    addContent,
    updateContent,
    addBusinessContact,
    getAlertForContent
  } = useEditorial();

  // État du formulaire
  const [title, setTitle] = useState('');
  const [urlPath, setUrlPath] = useState('');
  const [directionId, setDirectionId] = useState('');
  const [themeId, setThemeId] = useState('');
  const [typologyId, setTypologyId] = useState('');
  const [stageId, setStageId] = useState('');
  const [assigneeId, setAssigneeId] = useState('');
  const [businessContactId, setBusinessContactId] = useState('');
  const [priority, setPriority] = useState<Priority>('moyenne');
  const [targetDeliveryDate, setTargetDeliveryDate] = useState('');
  const [briefNotes, setBriefNotes] = useState('');
  const [docUrl, setDocUrl] = useState('');
  const [cmsUrl, setCmsUrl] = useState('');

  // Mode ajout rapide d'un interlocuteur métier
  const [isAddingContact, setIsAddingContact] = useState(false);
  const [newContactName, setNewContactName] = useState('');
  const [newContactRole, setNewContactRole] = useState('');
  const [newContactEmail, setNewContactEmail] = useState('');
  const [newContactPhone, setNewContactPhone] = useState('');
  const [newContactDirectionId, setNewContactDirectionId] = useState('');

  // Pré-remplir lors de l'ouverture
  useEffect(() => {
    if (contentToEdit) {
      setTitle(contentToEdit.title);
      setUrlPath(contentToEdit.urlPath || '');
      setDirectionId(contentToEdit.directionId);
      setThemeId(contentToEdit.themeId);
      setTypologyId(contentToEdit.typologyId);
      setStageId(contentToEdit.stageId);
      setAssigneeId(contentToEdit.assigneeId);
      setBusinessContactId(contentToEdit.businessContactId);
      setPriority(contentToEdit.priority || 'moyenne');
      setTargetDeliveryDate(
        contentToEdit.targetDeliveryDate
          ? contentToEdit.targetDeliveryDate.slice(0, 10)
          : ''
      );
      setBriefNotes(contentToEdit.briefNotes || '');
      setDocUrl(contentToEdit.docUrl || '');
      setCmsUrl(contentToEdit.cmsUrl || '');
    } else {
      // Valeurs par défaut pour nouveau contenu
      setTitle('');
      setUrlPath('');
      setDirectionId(directions[0]?.id || '');
      setThemeId(themes[0]?.id || '');
      setTypologyId(typologies[0]?.id || '');
      setStageId(stages[0]?.id || '');
      setAssigneeId(team[0]?.id || '');
      setBusinessContactId(contacts[0]?.id || '');
      setPriority('moyenne');
      setTargetDeliveryDate('');
      setBriefNotes('');
      setDocUrl('');
      setCmsUrl('');
    }
    setIsAddingContact(false);
  }, [contentToEdit, isOpen, directions, themes, typologies, stages, team, contacts]);

  if (!isOpen) return null;

  // Création rapide d'un interlocuteur métier depuis la modale
  const handleCreateContact = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newContactName.trim() || !newContactEmail.trim()) return;

    const created = addBusinessContact({
      name: newContactName.trim(),
      role: newContactRole.trim() || 'Référent métier',
      email: newContactEmail.trim(),
      phone: newContactPhone.trim() || undefined,
      directionId: newContactDirectionId || directionId || directions[0]?.id || ''
    });

    setBusinessContactId(created.id);
    setIsAddingContact(false);
    setNewContactName('');
    setNewContactRole('');
    setNewContactEmail('');
    setNewContactPhone('');
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    if (contentToEdit) {
      updateContent(contentToEdit.id, {
        title: title.trim(),
        urlPath: urlPath.trim() || undefined,
        directionId,
        themeId,
        typologyId,
        stageId,
        assigneeId,
        businessContactId,
        priority,
        targetDeliveryDate: targetDeliveryDate || undefined,
        briefNotes: briefNotes.trim() || undefined,
        docUrl: docUrl.trim() || undefined,
        cmsUrl: cmsUrl.trim() || undefined
      });
    } else {
      addContent({
        title: title.trim(),
        urlPath: urlPath.trim() || undefined,
        directionId,
        themeId,
        typologyId,
        stageId,
        assigneeId,
        businessContactId,
        stageEnteredAt: new Date().toISOString(),
        priority,
        targetDeliveryDate: targetDeliveryDate || undefined,
        briefNotes: briefNotes.trim() || undefined,
        docUrl: docUrl.trim() || undefined,
        cmsUrl: cmsUrl.trim() || undefined
      });
    }

    onClose();
  };

  const selectedStage = stages.find((s) => s.id === stageId);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm overflow-y-auto">
      <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-2xl max-h-[92vh] flex flex-col shadow-2xl overflow-hidden my-auto">
        {/* Header de la modale */}
        <div className="px-6 py-4 border-b border-slate-800 flex items-center justify-between bg-slate-900/80">
          <div>
            <h3 className="text-base font-semibold text-white">
              {contentToEdit ? 'Modifier la fiche de contenu' : 'Créer un nouveau contenu'}
            </h3>
            <p className="text-xs text-slate-400">
              Renseignez la direction, l équipe, l interlocuteur métier et l étape
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-1 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Corps formulaire */}
        <form onSubmit={handleSubmit} className="p-6 overflow-y-auto space-y-5 text-xs">
          {/* Diagnostic d'alerte pour le contenu en édition */}
          {contentToEdit && (
            <div className="p-3 rounded-lg bg-slate-800/60 border border-slate-700/60 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4 text-indigo-400" />
                <span className="text-slate-300">
                  Dans l étape actuelle depuis :{' '}
                  <strong className="text-white font-mono tabular-nums">
                    {getAlertForContent(contentToEdit).daysInStage} jours
                  </strong>
                </span>
              </div>
              <span className="text-slate-400 text-[11px]">
                Seuil alerte : {selectedStage?.warningDays}j · Bloqué : {selectedStage?.criticalDays}j
              </span>
            </div>
          )}

          {/* Titre & URL */}
          <div className="space-y-3">
            <div>
              <label className="block text-slate-300 font-semibold mb-1">
                Titre du contenu / de la page <span className="text-rose-400">*</span>
              </label>
              <input
                type="text"
                required
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Ex: Tarifs & Abonnements PME"
                className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-slate-300 font-medium mb-1">Chemin URL / Slug</label>
                <input
                  type="text"
                  value={urlPath}
                  onChange={(e) => setUrlPath(e.target.value)}
                  placeholder="Ex: /solutions/analytique"
                  className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 font-mono text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500"
                />
              </div>

              <div>
                <label className="block text-slate-300 font-medium mb-1">Priorité</label>
                <select
                  value={priority}
                  onChange={(e) => setPriority(e.target.value as Priority)}
                  className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-indigo-500"
                >
                  <option value="basse">Basse</option>
                  <option value="moyenne">Moyenne</option>
                  <option value="haute">Haute</option>
                  <option value="urgente">Urgente</option>
                </select>
              </div>
            </div>
          </div>

          {/* 3 axes clés : Direction, Thème, Typologie */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2 border-t border-slate-800">
            <div>
              <label className="block text-slate-300 font-medium mb-1">
                Direction <span className="text-rose-400">*</span>
              </label>
              <select
                required
                value={directionId}
                onChange={(e) => setDirectionId(e.target.value)}
                className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-indigo-500"
              >
                {directions.map((d) => (
                  <option key={d.id} value={d.id}>
                    {d.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-slate-300 font-medium mb-1">
                Thème <span className="text-rose-400">*</span>
              </label>
              <select
                required
                value={themeId}
                onChange={(e) => setThemeId(e.target.value)}
                className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-indigo-500"
              >
                {themes.map((t) => (
                  <option key={t.id} value={t.id}>
                    {t.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-slate-300 font-medium mb-1">
                Typologie <span className="text-rose-400">*</span>
              </label>
              <select
                required
                value={typologyId}
                onChange={(e) => setTypologyId(e.target.value)}
                className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-indigo-500"
              >
                {typologies.map((ty) => (
                  <option key={ty.id} value={ty.id}>
                    {ty.name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Workflow & Acteurs : Étape, Rédacteur, Interlocuteur métier */}
          <div className="space-y-3 pt-2 border-t border-slate-800">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-slate-300 font-medium mb-1">
                  État d avancement (Étape actuelle) <span className="text-rose-400">*</span>
                </label>
                <select
                  required
                  value={stageId}
                  onChange={(e) => setStageId(e.target.value)}
                  className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-indigo-500 font-medium"
                >
                  {stages.map((s) => (
                    <option key={s.id} value={s.id}>
                      {s.name} ({s.isFinal ? 'Publié' : `Cible ${s.targetDays}j / Max ${s.warningDays}j`})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-slate-300 font-medium mb-1">
                  Qui travaille dessus (Rédacteur assigné) <span className="text-rose-400">*</span>
                </label>
                <select
                  required
                  value={assigneeId}
                  onChange={(e) => setAssigneeId(e.target.value)}
                  className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-indigo-500"
                >
                  {team.map((m) => (
                    <option key={m.id} value={m.id}>
                      {m.name} — {m.role}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Interlocuteur métier (avec possibilité d'enrichir au fur et à mesure !) */}
            <div className="bg-slate-850 p-3 rounded-lg border border-slate-800 space-y-2">
              <div className="flex items-center justify-between">
                <label className="text-slate-300 font-semibold">
                  Interlocuteur métier (Contact de référence)
                </label>
                <button
                  type="button"
                  onClick={() => setIsAddingContact(!isAddingContact)}
                  className="text-xs text-indigo-400 hover:text-indigo-300 flex items-center gap-1 font-medium"
                >
                  <UserPlus className="w-3.5 h-3.5" />
                  <span>{isAddingContact ? 'Choisir un existant' : '+ Nouvel interlocuteur'}</span>
                </button>
              </div>

              {!isAddingContact ? (
                <select
                  value={businessContactId}
                  onChange={(e) => setBusinessContactId(e.target.value)}
                  className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-indigo-500"
                >
                  <option value="">Sélectionner un interlocuteur métier...</option>
                  {contacts.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.name} ({c.role}) · {c.email}
                    </option>
                  ))}
                </select>
              ) : (
                <div className="p-3 bg-slate-800 rounded-lg space-y-2.5 border border-slate-700">
                  <div className="text-[11px] font-medium text-indigo-300">
                    Enrichir le carnet d interlocuteurs métiers :
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    <input
                      type="text"
                      placeholder="Nom et Prénom *"
                      value={newContactName}
                      onChange={(e) => setNewContactName(e.target.value)}
                      className="bg-slate-900 border border-slate-700 rounded px-2.5 py-1.5 text-white placeholder-slate-500"
                    />
                    <input
                      type="text"
                      placeholder="Fonction (ex: Chef de produit) *"
                      value={newContactRole}
                      onChange={(e) => setNewContactRole(e.target.value)}
                      className="bg-slate-900 border border-slate-700 rounded px-2.5 py-1.5 text-white placeholder-slate-500"
                    />
                    <input
                      type="email"
                      placeholder="Email professionnel *"
                      value={newContactEmail}
                      onChange={(e) => setNewContactEmail(e.target.value)}
                      className="bg-slate-900 border border-slate-700 rounded px-2.5 py-1.5 text-white placeholder-slate-500"
                    />
                    <input
                      type="text"
                      placeholder="Téléphone / Ligne directe"
                      value={newContactPhone}
                      onChange={(e) => setNewContactPhone(e.target.value)}
                      className="bg-slate-900 border border-slate-700 rounded px-2.5 py-1.5 text-white placeholder-slate-500"
                    />
                  </div>
                  <div className="flex justify-end gap-2 pt-1">
                    <button
                      type="button"
                      onClick={() => setIsAddingContact(false)}
                      className="px-2.5 py-1 text-slate-400 hover:text-white"
                    >
                      Annuler
                    </button>
                    <button
                      type="button"
                      onClick={handleCreateContact}
                      disabled={!newContactName || !newContactEmail}
                      className="px-3 py-1 bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 text-white font-medium rounded transition-colors"
                    >
                      Enregistrer et lier
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Liens & Notes */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2 border-t border-slate-800">
            <div>
              <label className="block text-slate-300 font-medium mb-1">
                Lien Document (Google Docs, Notion, Word...)
              </label>
              <input
                type="url"
                value={docUrl}
                onChange={(e) => setDocUrl(e.target.value)}
                placeholder="https://docs.google.com/..."
                className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-white placeholder-slate-500 font-mono text-[11px]"
              />
            </div>

            <div>
              <label className="block text-slate-300 font-medium mb-1">
                Lien Prévisualisation CMS
              </label>
              <input
                type="url"
                value={cmsUrl}
                onChange={(e) => setCmsUrl(e.target.value)}
                placeholder="https://preview.site.fr/..."
                className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-white placeholder-slate-500 font-mono text-[11px]"
              />
            </div>
          </div>

          <div>
            <label className="block text-slate-300 font-medium mb-1">
              Notes de cadrage, brief et consignes
            </label>
            <textarea
              rows={3}
              value={briefNotes}
              onChange={(e) => setBriefNotes(e.target.value)}
              placeholder="Objectif de la page, points de vigilance, mots-clés obligatoires..."
              className="w-full bg-slate-800 border border-slate-700 rounded-lg p-2.5 text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500"
            />
          </div>

          {/* Historique des étapes si existant */}
          {contentToEdit && contentToEdit.history && contentToEdit.history.length > 0 && (
            <div className="pt-2 border-t border-slate-800 space-y-2">
              <div className="flex items-center gap-1.5 text-slate-400 font-semibold text-[11px] uppercase tracking-wider">
                <History className="w-3.5 h-3.5" />
                <span>Historique du cycle éditorial</span>
              </div>
              <div className="space-y-1 bg-slate-800/40 p-2.5 rounded-lg border border-slate-800">
                {contentToEdit.history.map((h, i) => (
                  <div
                    key={i}
                    className="flex items-center justify-between text-[11px] text-slate-300 py-0.5"
                  >
                    <span>{h.stageName}</span>
                    <span className="font-mono tabular-nums text-slate-400">
                      Entré le {formatDateFr(h.enteredAt)}{' '}
                      {h.durationDays ? `(${h.durationDays}j)` : '(En cours)'}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Boutons validation */}
          <div className="pt-4 border-t border-slate-800 flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-slate-400 hover:text-white transition-colors"
            >
              Annuler
            </button>
            <button
              type="submit"
              className="px-5 py-2 bg-indigo-600 hover:bg-indigo-500 text-white font-semibold rounded-lg shadow-sm transition-colors flex items-center gap-1.5"
            >
              <Check className="w-4 h-4" />
              <span>{contentToEdit ? 'Enregistrer les modifications' : 'Créer le contenu'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
