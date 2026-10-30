import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  Direction,
  Theme,
  Typology,
  Stage,
  TeamMember,
  BusinessContact,
  ContentItem,
  AlertStatus,
  AlertLevel
} from '../types/editorial';
import {
  INITIAL_DIRECTIONS,
  INITIAL_THEMES,
  INITIAL_TYPOLOGIES,
  INITIAL_STAGES,
  INITIAL_TEAM,
  INITIAL_BUSINESS_CONTACTS,
  INITIAL_CONTENTS
} from '../data/initialData';
import { calculateAlertStatus } from '../utils/alerts';

const STORAGE_KEY = 'editoflow_editorial_data_v1';

export type MainNavTab = 'dashboard' | 'contents_list' | 'contents_kanban' | 'contacts' | 'backoffice';

interface EditorialContextType {
  // Données
  directions: Direction[];
  themes: Theme[];
  typologies: Typology[];
  stages: Stage[];
  team: TeamMember[];
  contacts: BusinessContact[];
  contents: ContentItem[];

  // Navigation
  activeTab: MainNavTab;
  setActiveTab: (tab: MainNavTab) => void;

  // Filtres globaux
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  filterDirection: string;
  setFilterDirection: (id: string) => void;
  filterTheme: string;
  setFilterTheme: (id: string) => void;
  filterTypology: string;
  setFilterTypology: (id: string) => void;
  filterStage: string;
  setFilterStage: (id: string) => void;
  filterAssignee: string;
  setFilterAssignee: (id: string) => void;
  filterContact: string;
  setFilterContact: (id: string) => void;
  filterAlert: 'all' | 'alert_only' | 'critical_only' | 'warning_only';
  setFilterAlert: (filter: 'all' | 'alert_only' | 'critical_only' | 'warning_only') => void;
  resetFilters: () => void;

  // Helpers calculés
  getAlertForContent: (content: ContentItem) => AlertStatus;
  getDirection: (id: string) => Direction | undefined;
  getTheme: (id: string) => Theme | undefined;
  getTypology: (id: string) => Typology | undefined;
  getStage: (id: string) => Stage | undefined;
  getAssignee: (id: string) => TeamMember | undefined;
  getContact: (id: string) => BusinessContact | undefined;

  // Actions Contenus
  addContent: (data: Omit<ContentItem, 'id' | 'createdAt' | 'updatedAt' | 'history'>) => ContentItem;
  updateContent: (id: string, updates: Partial<ContentItem>) => void;
  deleteContent: (id: string) => void;
  moveContentStage: (contentId: string, newStageId: string) => void;
  bulkMoveStage: (contentIds: string[], newStageId: string) => void;

  // Backoffice Actions
  addDirection: (dir: Omit<Direction, 'id'>) => Direction;
  updateDirection: (id: string, dir: Partial<Direction>) => void;
  deleteDirection: (id: string) => void;

  addTheme: (th: Omit<Theme, 'id'>) => Theme;
  updateTheme: (id: string, th: Partial<Theme>) => void;
  deleteTheme: (id: string) => void;

  addTypology: (typo: Omit<Typology, 'id'>) => Typology;
  updateTypology: (id: string, typo: Partial<Typology>) => void;
  deleteTypology: (id: string) => void;

  addStage: (stg: Omit<Stage, 'id'>) => Stage;
  updateStage: (id: string, stg: Partial<Stage>) => void;
  deleteStage: (id: string) => void;

  addTeamMember: (member: Omit<TeamMember, 'id'>) => TeamMember;
  updateTeamMember: (id: string, member: Partial<TeamMember>) => void;
  deleteTeamMember: (id: string) => void;

  addBusinessContact: (contact: Omit<BusinessContact, 'id'>) => BusinessContact;
  updateBusinessContact: (id: string, contact: Partial<BusinessContact>) => void;
  deleteBusinessContact: (id: string) => void;

  // Utilitaires de données
  resetToDefaults: () => void;
  exportDataJson: () => string;
  importDataJson: (json: string) => boolean;
}

const EditorialContext = createContext<EditorialContextType | null>(null);

export function EditorialProvider({ children }: { children: React.ReactNode }) {
  const [directions, setDirections] = useState<Direction[]>(INITIAL_DIRECTIONS);
  const [themes, setThemes] = useState<Theme[]>(INITIAL_THEMES);
  const [typologies, setTypologies] = useState<Typology[]>(INITIAL_TYPOLOGIES);
  const [stages, setStages] = useState<Stage[]>(INITIAL_STAGES);
  const [team, setTeam] = useState<TeamMember[]>(INITIAL_TEAM);
  const [contacts, setContacts] = useState<BusinessContact[]>(INITIAL_BUSINESS_CONTACTS);
  const [contents, setContents] = useState<ContentItem[]>(INITIAL_CONTENTS);

  // Navigation
  const [activeTab, setActiveTab] = useState<MainNavTab>('dashboard');

  // Filtres
  const [searchQuery, setSearchQuery] = useState('');
  const [filterDirection, setFilterDirection] = useState('all');
  const [filterTheme, setFilterTheme] = useState('all');
  const [filterTypology, setFilterTypology] = useState('all');
  const [filterStage, setFilterStage] = useState('all');
  const [filterAssignee, setFilterAssignee] = useState('all');
  const [filterContact, setFilterContact] = useState('all');
  const [filterAlert, setFilterAlert] = useState<'all' | 'alert_only' | 'critical_only' | 'warning_only'>('all');

  // Charger depuis localStorage au démarrage
  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        if (parsed.directions) setDirections(parsed.directions);
        if (parsed.themes) setThemes(parsed.themes);
        if (parsed.typologies) setTypologies(parsed.typologies);
        if (parsed.stages) setStages(parsed.stages);
        if (parsed.team) setTeam(parsed.team);
        if (parsed.contacts) setContacts(parsed.contacts);
        if (parsed.contents) setContents(parsed.contents);
      }
    } catch (e) {
      console.warn('Erreur lors du chargement des données depuis localStorage:', e);
    }
  }, []);

  // Sauvegarder dans localStorage
  const saveStateToDisk = (
    newDirs = directions,
    newTh = themes,
    newTypo = typologies,
    newStg = stages,
    newTm = team,
    newCt = contacts,
    newCnt = contents
  ) => {
    try {
      localStorage.setItem(
        STORAGE_KEY,
        JSON.stringify({
          directions: newDirs,
          themes: newTh,
          typologies: newTypo,
          stages: newStg,
          team: newTm,
          contacts: newCt,
          contents: newCnt,
          savedAt: new Date().toISOString()
        })
      );
    } catch (e) {
      console.warn('Erreur lors de la sauvegarde dans localStorage:', e);
    }
  };

  const resetFilters = () => {
    setSearchQuery('');
    setFilterDirection('all');
    setFilterTheme('all');
    setFilterTypology('all');
    setFilterStage('all');
    setFilterAssignee('all');
    setFilterContact('all');
    setFilterAlert('all');
  };

  // Helpers de résolution
  const getAlertForContent = (item: ContentItem): AlertStatus => {
    return calculateAlertStatus(item, stages);
  };

  const getDirection = (id: string) => directions.find((d) => d.id === id);
  const getTheme = (id: string) => themes.find((t) => t.id === id);
  const getTypology = (id: string) => typologies.find((t) => t.id === id);
  const getStage = (id: string) => stages.find((s) => s.id === id);
  const getAssignee = (id: string) => team.find((m) => m.id === id);
  const getContact = (id: string) => contacts.find((c) => c.id === id);

  // Actions Contenus
  const addContent = (data: Omit<ContentItem, 'id' | 'createdAt' | 'updatedAt' | 'history'>): ContentItem => {
    const stage = stages.find((s) => s.id === data.stageId) || stages[0];
    const now = new Date().toISOString();
    const newContent: ContentItem = {
      ...data,
      id: `cnt_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
      createdAt: now,
      updatedAt: now,
      history: [
        {
          stageId: stage.id,
          stageName: stage.name,
          enteredAt: data.stageEnteredAt || now
        }
      ]
    };
    const updated = [newContent, ...contents];
    setContents(updated);
    saveStateToDisk(directions, themes, typologies, stages, team, contacts, updated);
    return newContent;
  };

  const updateContent = (id: string, updates: Partial<ContentItem>) => {
    const updated = contents.map((item) => {
      if (item.id !== id) return item;

      // Si l'étape a changé, mettre à jour l'historique et la date d'entrée
      if (updates.stageId && updates.stageId !== item.stageId) {
        const now = new Date().toISOString();
        const prevStage = stages.find((s) => s.id === item.stageId);
        const enteredDate = new Date(item.stageEnteredAt).getTime();
        const durationDays = Math.max(0, Math.floor((Date.now() - enteredDate) / (1000 * 60 * 60 * 24)));

        const newStage = stages.find((s) => s.id === updates.stageId) || stages[0];
        const newHistory = [
          ...item.history.map((h, idx) =>
            idx === item.history.length - 1
              ? { ...h, leftAt: now, durationDays }
              : h
          ),
          {
            stageId: newStage.id,
            stageName: newStage.name,
            enteredAt: now
          }
        ];

        return {
          ...item,
          ...updates,
          stageEnteredAt: now,
          updatedAt: now,
          history: newHistory
        };
      }

      return {
        ...item,
        ...updates,
        updatedAt: new Date().toISOString()
      };
    });

    setContents(updated);
    saveStateToDisk(directions, themes, typologies, stages, team, contacts, updated);
  };

  const deleteContent = (id: string) => {
    const updated = contents.filter((item) => item.id !== id);
    setContents(updated);
    saveStateToDisk(directions, themes, typologies, stages, team, contacts, updated);
  };

  const moveContentStage = (contentId: string, newStageId: string) => {
    updateContent(contentId, { stageId: newStageId });
  };

  const bulkMoveStage = (contentIds: string[], newStageId: string) => {
    contentIds.forEach((id) => moveContentStage(id, newStageId));
  };

  // Backoffice Actions
  const addDirection = (dir: Omit<Direction, 'id'>) => {
    const newDir: Direction = {
      ...dir,
      id: `dir_${Date.now()}`
    };
    const updated = [...directions, newDir];
    setDirections(updated);
    saveStateToDisk(updated);
    return newDir;
  };

  const updateDirection = (id: string, updates: Partial<Direction>) => {
    const updated = directions.map((d) => (d.id === id ? { ...d, ...updates } : d));
    setDirections(updated);
    saveStateToDisk(updated);
  };

  const deleteDirection = (id: string) => {
    const updated = directions.filter((d) => d.id !== id);
    setDirections(updated);
    saveStateToDisk(updated);
  };

  const addTheme = (th: Omit<Theme, 'id'>) => {
    const newTh: Theme = {
      ...th,
      id: `theme_${Date.now()}`
    };
    const updated = [...themes, newTh];
    setThemes(updated);
    saveStateToDisk(undefined, updated);
    return newTh;
  };

  const updateTheme = (id: string, updates: Partial<Theme>) => {
    const updated = themes.map((t) => (t.id === id ? { ...t, ...updates } : t));
    setThemes(updated);
    saveStateToDisk(undefined, updated);
  };

  const deleteTheme = (id: string) => {
    const updated = themes.filter((t) => t.id !== id);
    setThemes(updated);
    saveStateToDisk(undefined, updated);
  };

  const addTypology = (typo: Omit<Typology, 'id'>) => {
    const newTypo: Typology = {
      ...typo,
      id: `typo_${Date.now()}`
    };
    const updated = [...typologies, newTypo];
    setTypologies(updated);
    saveStateToDisk(undefined, undefined, updated);
    return newTypo;
  };

  const updateTypology = (id: string, updates: Partial<Typology>) => {
    const updated = typologies.map((t) => (t.id === id ? { ...t, ...updates } : t));
    setTypologies(updated);
    saveStateToDisk(undefined, undefined, updated);
  };

  const deleteTypology = (id: string) => {
    const updated = typologies.filter((t) => t.id !== id);
    setTypologies(updated);
    saveStateToDisk(undefined, undefined, updated);
  };

  const addStage = (stg: Omit<Stage, 'id'>) => {
    const newStage: Stage = {
      ...stg,
      id: `stage_${Date.now()}`
    };
    const updated = [...stages, newStage].sort((a, b) => a.order - b.order);
    setStages(updated);
    saveStateToDisk(undefined, undefined, undefined, updated);
    return newStage;
  };

  const updateStage = (id: string, updates: Partial<Stage>) => {
    const updated = stages
      .map((s) => (s.id === id ? { ...s, ...updates } : s))
      .sort((a, b) => a.order - b.order);
    setStages(updated);
    saveStateToDisk(undefined, undefined, undefined, updated);
  };

  const deleteStage = (id: string) => {
    const updated = stages.filter((s) => s.id !== id);
    setStages(updated);
    saveStateToDisk(undefined, undefined, undefined, updated);
  };

  const addTeamMember = (member: Omit<TeamMember, 'id'>) => {
    const newMember: TeamMember = {
      ...member,
      id: `team_${Date.now()}`
    };
    const updated = [...team, newMember];
    setTeam(updated);
    saveStateToDisk(undefined, undefined, undefined, undefined, updated);
    return newMember;
  };

  const updateTeamMember = (id: string, updates: Partial<TeamMember>) => {
    const updated = team.map((m) => (m.id === id ? { ...m, ...updates } : m));
    setTeam(updated);
    saveStateToDisk(undefined, undefined, undefined, undefined, updated);
  };

  const deleteTeamMember = (id: string) => {
    const updated = team.filter((m) => m.id !== id);
    setTeam(updated);
    saveStateToDisk(undefined, undefined, undefined, undefined, updated);
  };

  const addBusinessContact = (contact: Omit<BusinessContact, 'id'>) => {
    const newContact: BusinessContact = {
      ...contact,
      id: `contact_${Date.now()}`
    };
    const updated = [...contacts, newContact];
    setContacts(updated);
    saveStateToDisk(undefined, undefined, undefined, undefined, undefined, updated);
    return newContact;
  };

  const updateBusinessContact = (id: string, updates: Partial<BusinessContact>) => {
    const updated = contacts.map((c) => (c.id === id ? { ...c, ...updates } : c));
    setContacts(updated);
    saveStateToDisk(undefined, undefined, undefined, undefined, undefined, updated);
  };

  const deleteBusinessContact = (id: string) => {
    const updated = contacts.filter((c) => c.id !== id);
    setContacts(updated);
    saveStateToDisk(undefined, undefined, undefined, undefined, undefined, updated);
  };

  const resetToDefaults = () => {
    localStorage.removeItem(STORAGE_KEY);
    setDirections(INITIAL_DIRECTIONS);
    setThemes(INITIAL_THEMES);
    setTypologies(INITIAL_TYPOLOGIES);
    setStages(INITIAL_STAGES);
    setTeam(INITIAL_TEAM);
    setContacts(INITIAL_BUSINESS_CONTACTS);
    setContents(INITIAL_CONTENTS);
  };

  const exportDataJson = () => {
    return JSON.stringify(
      {
        directions,
        themes,
        typologies,
        stages,
        team,
        contacts,
        contents,
        exportedAt: new Date().toISOString()
      },
      null,
      2
    );
  };

  const importDataJson = (json: string): boolean => {
    try {
      const parsed = JSON.parse(json);
      if (Array.isArray(parsed.directions)) setDirections(parsed.directions);
      if (Array.isArray(parsed.themes)) setThemes(parsed.themes);
      if (Array.isArray(parsed.typologies)) setTypologies(parsed.typologies);
      if (Array.isArray(parsed.stages)) setStages(parsed.stages);
      if (Array.isArray(parsed.team)) setTeam(parsed.team);
      if (Array.isArray(parsed.contacts)) setContacts(parsed.contacts);
      if (Array.isArray(parsed.contents)) setContents(parsed.contents);
      saveStateToDisk(
        parsed.directions || directions,
        parsed.themes || themes,
        parsed.typologies || typologies,
        parsed.stages || stages,
        parsed.team || team,
        parsed.contacts || contacts,
        parsed.contents || contents
      );
      return true;
    } catch (e) {
      console.error('Erreur import JSON:', e);
      return false;
    }
  };

  return (
    <EditorialContext.Provider
      value={{
        directions,
        themes,
        typologies,
        stages,
        team,
        contacts,
        contents,
        activeTab,
        setActiveTab,
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
        resetFilters,
        getAlertForContent,
        getDirection,
        getTheme,
        getTypology,
        getStage,
        getAssignee,
        getContact,
        addContent,
        updateContent,
        deleteContent,
        moveContentStage,
        bulkMoveStage,
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
        addBusinessContact,
        updateBusinessContact,
        deleteBusinessContact,
        resetToDefaults,
        exportDataJson,
        importDataJson
      }}
    >
      {children}
    </EditorialContext.Provider>
  );
}

export function useEditorial() {
  const context = useContext(EditorialContext);
  if (!context) {
    throw new Error('useEditorial must be used within an EditorialProvider');
  }
  return context;
}
