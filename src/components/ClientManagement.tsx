import { useState } from 'react';
import { Plus, Edit, Trash2 } from 'lucide-react';
import { Client } from '../types';

interface ClientManagementProps {
  clients: Client[];
  onAddClient: (client: Client) => void;
  onUpdateClient: (client: Client) => void;
  onDeleteClient: (clientId: string) => void;
}

const PLATFORM_OPTIONS = ['Facebook', 'Instagram', 'Twitter', 'LinkedIn', 'TikTok', 'YouTube'];
const COLOR_OPTIONS = [
  '#6366f1', '#8b5cf6', '#ec4899', '#f43f5e',
  '#ef4444', '#f59e0b', '#10b981', '#06b6d4',
  '#3b82f6', '#14b8a6', '#84cc16', '#f97316'
];

export default function ClientManagement({ clients, onAddClient, onUpdateClient, onDeleteClient }: ClientManagementProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingClient, setEditingClient] = useState<Client | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    color: COLOR_OPTIONS[0],
    platforms: [] as string[]
  });

  const handleOpenModal = (client?: Client) => {
    if (client) {
      setEditingClient(client);
      setFormData({
        name: client.name,
        email: client.email || '',
        color: client.color,
        platforms: client.platforms
      });
    } else {
      setEditingClient(null);
      setFormData({
        name: '',
        email: '',
        color: COLOR_OPTIONS[0],
        platforms: []
      });
    }
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingClient(null);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (editingClient) {
      onUpdateClient({
        ...editingClient,
        ...formData
      });
    } else {
      onAddClient({
        id: Date.now().toString(),
        name: formData.name,
        email: formData.email,
        color: formData.color,
        platforms: formData.platforms,
        createdAt: new Date().toISOString()
      });
    }
    
    handleCloseModal();
  };

  const togglePlatform = (platform: string) => {
    setFormData(prev => ({
      ...prev,
      platforms: prev.platforms.includes(platform)
        ? prev.platforms.filter(p => p !== platform)
        : [...prev.platforms, platform]
    }));
  };

  return (
    <div>
      <div className="view-header">
        <h1>Client Management</h1>
        <button className="btn-primary" onClick={() => handleOpenModal()}>
          <Plus size={20} />
          Add Client
        </button>
      </div>

      <div className="clients-grid">
        {clients.map(client => (
          <div key={client.id} className="client-card">
            <div className="client-card-header" style={{ background: client.color }}>
              <h2>{client.name}</h2>
            </div>
            <div className="client-card-body">
              {client.email && <p style={{ color: 'var(--text-secondary)', marginBottom: '1rem', fontSize: '0.875rem' }}>{client.email}</p>}
              <div className="client-platforms">
                {client.platforms.map(platform => (
                  <span key={platform} className="platform-badge">{platform}</span>
                ))}
              </div>
            </div>
            <div className="client-card-actions">
              <button className="btn-icon" onClick={() => handleOpenModal(client)}>
                <Edit size={18} />
              </button>
              <button className="btn-icon" onClick={() => onDeleteClient(client.id)}>
                <Trash2 size={18} />
              </button>
            </div>
          </div>
        ))}
        {clients.length === 0 && (
          <div className="empty-state">
            <p>No clients yet. Add your first client to get started!</p>
          </div>
        )}
      </div>

      {isModalOpen && (
        <div className="modal-overlay" onClick={handleCloseModal}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>{editingClient ? 'Edit Client' : 'Add New Client'}</h2>
              <button className="modal-close" onClick={handleCloseModal}>×</button>
            </div>
            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label>Client Name *</label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  required
                />
              </div>
              <div className="form-group">
                <label>Email</label>
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                />
              </div>
              <div className="form-group">
                <label>Color</label>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(6, 1fr)', gap: '0.75rem' }}>
                  {COLOR_OPTIONS.map(color => (
                    <button
                      key={color}
                      type="button"
                      onClick={() => setFormData({ ...formData, color })}
                      style={{
                        width: '100%',
                        aspectRatio: 1,
                        border: formData.color === color ? '3px solid var(--text-primary)' : '3px solid transparent',
                        borderRadius: 'var(--radius)',
                        backgroundColor: color,
                        cursor: 'pointer',
                        transition: 'var(--transition)'
                      }}
                    />
                  ))}
                </div>
              </div>
              <div className="form-group">
                <label>Platforms</label>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '0.75rem' }}>
                  {PLATFORM_OPTIONS.map(platform => (
                    <label key={platform} style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', cursor: 'pointer', padding: '0.875rem', border: '1px solid var(--border)', borderRadius: 'var(--radius)', background: 'var(--bg-secondary)', transition: 'var(--transition)' }}>
                      <input
                        type="checkbox"
                        checked={formData.platforms.includes(platform)}
                        onChange={() => togglePlatform(platform)}
                      />
                      <span>{platform}</span>
                    </label>
                  ))}
                </div>
              </div>
              <div className="form-actions">
                <button type="button" className="btn-secondary" onClick={handleCloseModal}>
                  Cancel
                </button>
                <button type="submit" className="btn-primary">
                  {editingClient ? 'Update' : 'Create'} Client
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

