import { useState, useEffect } from 'react';
import TopNav from './TopNav';
import CalendarView from './CalendarView';
import ClientManagement from './ClientManagement';
import PostEditor from './PostEditor';
import DashboardOverview from './DashboardOverview';
import DataImport from './DataImport';
import { Client, Post } from '../types';

export default function Dashboard() {
  const [activeView, setActiveView] = useState<'overview' | 'calendar' | 'clients' | 'posts'>('overview');
  const [clients, setClients] = useState<Client[]>([]);
  const [posts, setPosts] = useState<Post[]>([]);
  const [selectedPost, setSelectedPost] = useState<Post | null>(null);
  const [isPostEditorOpen, setIsPostEditorOpen] = useState(false);
  const [isImportOpen, setIsImportOpen] = useState(false);

  useEffect(() => {
    const savedClients = localStorage.getItem('sm-clients');
    const savedPosts = localStorage.getItem('sm-posts');
    
    if (savedClients) {
      setClients(JSON.parse(savedClients));
    }
    if (savedPosts) {
      setPosts(JSON.parse(savedPosts));
    }
  }, []);

  useEffect(() => {
    if (clients.length > 0 || localStorage.getItem('sm-clients')) {
      localStorage.setItem('sm-clients', JSON.stringify(clients));
    }
  }, [clients]);

  useEffect(() => {
    if (posts.length > 0 || localStorage.getItem('sm-posts')) {
      localStorage.setItem('sm-posts', JSON.stringify(posts));
    }
  }, [posts]);

  const handleAddClient = (client: Client) => {
    setClients([...clients, client]);
  };

  const handleUpdateClient = (updatedClient: Client) => {
    setClients(clients.map(c => c.id === updatedClient.id ? updatedClient : c));
  };

  const handleDeleteClient = (clientId: string) => {
    setClients(clients.filter(c => c.id !== clientId));
    setPosts(posts.filter(p => p.clientId !== clientId));
  };

  const handleAddPost = (post: Post) => {
    setPosts([...posts, post]);
    setIsPostEditorOpen(false);
    setSelectedPost(null);
  };

  const handleUpdatePost = (updatedPost: Post) => {
    setPosts(posts.map(p => p.id === updatedPost.id ? updatedPost : p));
    setIsPostEditorOpen(false);
    setSelectedPost(null);
  };

  const handleDeletePost = (postId: string) => {
    setPosts(posts.filter(p => p.id !== postId));
  };

  const handleEditPost = (post: Post) => {
    setSelectedPost(post);
    setIsPostEditorOpen(true);
  };

  const handleNewPost = () => {
    setSelectedPost(null);
    setIsPostEditorOpen(true);
  };

  const handleImport = (importedClients: Client[], importedPosts: Post[]) => {
    const existingClientNames = new Set(clients.map(c => c.name.toLowerCase()));
    const newClients = importedClients.filter(c => !existingClientNames.has(c.name.toLowerCase()));
    setClients([...clients, ...newClients]);
    setPosts([...posts, ...importedPosts]);
  };

  return (
    <div className="dashboard-container">
      <TopNav
        activeView={activeView}
        onViewChange={setActiveView}
        onNewPost={handleNewPost}
        onImport={() => setIsImportOpen(true)}
      />
      <main className="dashboard-main">
        {activeView === 'overview' && (
          <DashboardOverview 
            clients={clients}
            posts={posts}
            onEditPost={handleEditPost}
            onDeletePost={handleDeletePost}
          />
        )}
        {activeView === 'calendar' && (
          <CalendarView 
            clients={clients}
            posts={posts}
            onPostClick={handleEditPost}
          />
        )}
        {activeView === 'clients' && (
          <ClientManagement 
            clients={clients}
            onAddClient={handleAddClient}
            onUpdateClient={handleUpdateClient}
            onDeleteClient={handleDeleteClient}
          />
        )}
        {activeView === 'posts' && (
          <div className="card">
            <div className="view-header">
              <h1>All Posts</h1>
              <button className="btn-primary" onClick={handleNewPost}>
                + New Post
              </button>
            </div>
            <div className="clients-grid">
              {posts.map(post => {
                const client = clients.find(c => c.id === post.clientId);
                return (
                  <div key={post.id} className="client-card">
                    <div className="client-card-header" style={{ background: client?.color || '#6366f1' }}>
                      <h2>{client?.name || 'Unknown'}</h2>
                    </div>
                    <div className="client-card-body">
                      <p style={{ color: 'var(--text-secondary)', marginBottom: '1rem' }}>
                        {post.content.substring(0, 100)}...
                      </p>
                      <p style={{ fontSize: '0.875rem', color: 'var(--text-tertiary)' }}>
                        {new Date(post.scheduledDate).toLocaleDateString('en-US', {
                          month: 'short',
                          day: 'numeric',
                          year: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit'
                        })}
                      </p>
                    </div>
                    <div className="client-card-actions">
                      <button className="btn-icon" onClick={() => handleEditPost(post)}>Edit</button>
                      <button className="btn-icon" onClick={() => handleDeletePost(post.id)}>Delete</button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </main>
      {isPostEditorOpen && (
        <PostEditor
          post={selectedPost}
          clients={clients}
          onSave={selectedPost ? handleUpdatePost : handleAddPost}
          onClose={() => {
            setIsPostEditorOpen(false);
            setSelectedPost(null);
          }}
        />
      )}
      {isImportOpen && (
        <DataImport
          onImport={handleImport}
          onClose={() => setIsImportOpen(false)}
        />
      )}
    </div>
  );
}

