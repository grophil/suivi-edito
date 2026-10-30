import React, { useState } from 'react';
import {
  Users,
  Plus,
  Mail,
  Phone,
  Building,
  Edit2,
  Trash2,
  AlertTriangle,
  FileText
} from 'lucide-react';
import { useEditorial } from '../../context/EditorialContext';
import { BusinessContact, ContentItem } from '../../types/editorial';

interface ContactsViewProps {
  onEditContent: (content: ContentItem) => void;
}

export default function ContactsView({ onEditContent }: ContactsViewProps) {
  const {
    contacts,
    directions,
    contents,
    getDirection,
    getStage,
    getAlertForContent,
    addBusinessContact,
    updateBusinessContact,
    deleteBusinessContact
  } = useEditorial();

  // État formulaire ajout / modif
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingContact, setEditingContact] = useState<BusinessContact | null>(null);

  const [name, setName] = useState('');
  const [role, setRole] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [directionId, setDirectionId] = useState('');
  const [department, setDepartment] = useState('');

  const openNewContact = () => {
    setEditingContact(null);
    setName('');
    setRole('');
    setEmail('');
    setPhone('');
    setDirectionId(directions[0]?.id || '');
    setDepartment('');
    setIsModalOpen(true);
  };

  const openEditContact = (c: BusinessContact) => {
    setEditingContact(c);
    setName(c.name);
    setRole(c.role);
    setEmail(c.email);
    setPhone(c.phone || '');
    setDirectionId(c.directionId);
    setDepartment(c.department || '');
    setIsModalOpen(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !email.trim()) return;

    if (editingContact) {
      updateBusinessContact(editingContact.id, {
        name: name.trim(),
        role: role.trim(),
        email: email.trim(),
        phone: phone.trim() || undefined,
        directionId,
        department: department.trim() || undefined
      });
    } else {
      addBusinessContact({
        name: name.trim(),
        role: role.trim(),
        email: email.trim(),
        phone: phone.trim() || undefined,
        directionId,
        department: department.trim() || undefined
      });
    }

    setIsModalOpen(false);
  };

  return (
    <div className="p-6 space-y-6 max-w-7xl mx-auto">
      {/* En-tête */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h2 className="text-base font-semibold text-white">
            Annuaire des interlocuteurs métiers
          </h2>
          <p className="text-xs text-slate-400">
            Contacts référents par direction pour valider et alimenter les contenus
          </p>
        </div>

        <button
          onClick={openNewContact}
          className="flex items-center gap-1.5 px-3.5 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg text-xs font-semibold shadow-sm transition-colors"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>Ajouter un interlocuteur métier</span>
        </button>
      </div>

      {/* Grille des interlocuteurs */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {contacts.map((contact) => {
          const dir = getDirection(contact.directionId);
          const contactContents = contents.filter((c) => c.businessContactId === contact.id);
          const waitingValidation = contactContents.filter((c) => {
            const stg = getStage(c.stageId);
            return stg?.name.toLowerCase().includes('validation') && !stg.isFinal;
          });
          const alertsCount = contactContents.filter((c) => {
            const l = getAlertForContent(c).level;
            return l === 'warning' || l === 'critical';
          }).length;

          return (
            <div
              key={contact.id}
              className="bg-slate-900 border border-slate-800 rounded-xl p-4 space-y-3 shadow-sm hover:border-slate-700 transition-colors"
            >
              {/* Entête de carte */}
              <div className="flex items-start justify-between gap-2">
                <div>
                  <h3 className="text-sm font-semibold text-white">{contact.name}</h3>
                  <p className="text-xs text-slate-300 font-medium">{contact.role}</p>
                  {contact.department && (
                    <p className="text-[11px] text-slate-400">{contact.department}</p>
                  )}
                </div>

                <div className="flex items-center gap-1">
                  <button
                    onClick={() => openEditContact(contact)}
                    className="p-1 text-slate-400 hover:text-white rounded hover:bg-slate-800 transition-colors"
                    title="Modifier le contact"
                  >
                    <Edit2 className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={() => {
                      if (
                        window.confirm(
                          `Supprimer le contact ${contact.name} ? Ses contenus deviendront non assignés.`
                        )
                      ) {
                        deleteBusinessContact(contact.id);
                      }
                    }}
                    className="p-1 text-slate-400 hover:text-rose-400 rounded hover:bg-slate-800 transition-colors"
                    title="Supprimer le contact"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

              {/* Direction rattachée */}
              <div className="flex items-center gap-2 text-xs">
                <Building className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                <span
                  className="w-2 h-2 rounded-full shrink-0"
                  style={{ backgroundColor: dir?.color || '#94a3b8' }}
                />
                <span className="text-slate-300 truncate">{dir?.name || 'Non rattaché'}</span>
              </div>

              {/* Coordonnées */}
              <div className="space-y-1 text-xs text-slate-400 pt-1 border-t border-slate-800">
                <a
                  href={`mailto:${contact.email}`}
                  className="flex items-center gap-2 hover:text-indigo-400 transition-colors truncate"
                >
                  <Mail className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                  <span className="truncate">{contact.email}</span>
                </a>
                {contact.phone && (
                  <div className="flex items-center gap-2 text-slate-400 font-mono text-[11px]">
                    <Phone className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                    <span>{contact.phone}</span>
                  </div>
                )}
              </div>

              {/* Contenus associés & Alertes */}
              <div className="pt-2 border-t border-slate-800 flex items-center justify-between text-xs">
                <div className="flex items-center gap-1.5 text-slate-400">
                  <FileText className="w-3.5 h-3.5 text-slate-400" />
                  <span className="font-mono tabular-nums text-slate-200">
                    {contactContents.length}
                  </span>
                  <span>contenu(s) lié(s)</span>
                </div>

                {alertsCount > 0 && (
                  <span className="text-[11px] font-medium text-amber-300 flex items-center gap-1">
                    <AlertTriangle className="w-3 h-3 text-amber-400" />
                    <span>{alertsCount} en alerte</span>
                  </span>
                )}
              </div>

              {/* Liste miniature des contenus en attente */}
              {waitingValidation.length > 0 && (
                <div className="p-2 rounded bg-amber-950/20 border border-amber-900/40 text-[11px] space-y-1">
                  <span className="text-amber-300 font-semibold block">
                    En attente de sa validation :
                  </span>
                  {waitingValidation.map((c) => (
                    <div
                      key={c.id}
                      onClick={() => onEditContent(c)}
                      className="text-slate-300 hover:text-white cursor-pointer truncate"
                    >
                      • {c.title}
                    </div>
                  ))}
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Modal Ajout / Modification Contact */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
          <div className="bg-slate-900 border border-slate-800 rounded-xl max-w-md w-full p-5 space-y-4 shadow-2xl">
            <h3 className="text-sm font-semibold text-white">
              {editingContact ? 'Modifier l interlocuteur métier' : 'Nouvel interlocuteur métier'}
            </h3>

            <form onSubmit={handleSubmit} className="space-y-3 text-xs">
              <div>
                <label className="block text-slate-300 font-medium mb-1">Nom et Prénom *</label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Ex: Sophie Martin"
                  className="w-full bg-slate-800 border border-slate-700 rounded-lg p-2 text-white"
                />
              </div>

              <div>
                <label className="block text-slate-300 font-medium mb-1">Rôle / Fonction *</label>
                <input
                  type="text"
                  required
                  value={role}
                  onChange={(e) => setRole(e.target.value)}
                  placeholder="Ex: Responsable Marque Employeur"
                  className="w-full bg-slate-800 border border-slate-700 rounded-lg p-2 text-white"
                />
              </div>

              <div>
                <label className="block text-slate-300 font-medium mb-1">Direction rattachée</label>
                <select
                  value={directionId}
                  onChange={(e) => setDirectionId(e.target.value)}
                  className="w-full bg-slate-800 border border-slate-700 rounded-lg p-2 text-white"
                >
                  {directions.map((d) => (
                    <option key={d.id} value={d.id}>
                      {d.name}
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-slate-300 font-medium mb-1">Email *</label>
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="s.martin@cie.fr"
                    className="w-full bg-slate-800 border border-slate-700 rounded-lg p-2 text-white"
                  />
                </div>
                <div>
                  <label className="block text-slate-300 font-medium mb-1">Téléphone</label>
                  <input
                    type="text"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="01 42 68..."
                    className="w-full bg-slate-800 border border-slate-700 rounded-lg p-2 text-white font-mono"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-300 font-medium mb-1">Département interne</label>
                <input
                  type="text"
                  value={department}
                  onChange={(e) => setDepartment(e.target.value)}
                  placeholder="Ex: Pôle Acquisition & Recrutement"
                  className="w-full bg-slate-800 border border-slate-700 rounded-lg p-2 text-white"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-3 py-1.5 text-slate-400 hover:text-white"
                >
                  Annuler
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 bg-indigo-600 hover:bg-indigo-500 text-white font-medium rounded-lg"
                >
                  {editingContact ? 'Enregistrer' : 'Créer le contact'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
