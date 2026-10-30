import React, { useState } from 'react';
import { EditorialProvider, useEditorial } from './context/EditorialContext';
import Sidebar from './components/layout/Sidebar';
import Header from './components/layout/Header';
import DashboardView from './components/dashboard/DashboardView';
import ContentListView from './components/contents/ContentListView';
import ContentKanbanView from './components/contents/ContentKanbanView';
import ContactsView from './components/contacts/ContactsView';
import BackofficeView from './components/backoffice/BackofficeView';
import ContentModal from './components/contents/ContentModal';
import { ContentItem } from './types/editorial';

function EditorialApp() {
  const { activeTab } = useEditorial();

  // Modale de création / édition de contenu
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedContent, setSelectedContent] = useState<ContentItem | null>(null);

  const handleOpenNewContentModal = () => {
    setSelectedContent(null);
    setIsModalOpen(true);
  };

  const handleEditContent = (content: ContentItem) => {
    setSelectedContent(content);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedContent(null);
  };

  return (
    <div className="flex h-screen w-screen overflow-hidden bg-slate-950 text-slate-100 font-sans selection:bg-indigo-500 selection:text-white antialiased">
      {/* 1. Barre latérale de navigation */}
      <Sidebar />

      {/* 2. Colonne de contenu principale */}
      <div className="flex-1 flex flex-col min-w-0 h-full overflow-hidden">
        {/* Top bar contract */}
        <Header onOpenNewContentModal={handleOpenNewContentModal} />

        {/* Viewport de contenu */}
        <main className="flex-1 overflow-y-auto">
          {activeTab === 'dashboard' && (
            <DashboardView onEditContent={handleEditContent} />
          )}

          {activeTab === 'contents_list' && (
            <ContentListView
              onEditContent={handleEditContent}
              onNewContent={handleOpenNewContentModal}
            />
          )}

          {activeTab === 'contents_kanban' && (
            <ContentKanbanView
              onEditContent={handleEditContent}
              onNewContent={handleOpenNewContentModal}
            />
          )}

          {activeTab === 'contacts' && (
            <ContactsView onEditContent={handleEditContent} />
          )}

          {activeTab === 'backoffice' && <BackofficeView />}
        </main>
      </div>

      {/* Modale globale de création / édition */}
      <ContentModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        contentToEdit={selectedContent}
      />
    </div>
  );
}

export default function App() {
  return (
    <EditorialProvider>
      <EditorialApp />
    </EditorialProvider>
  );
}
