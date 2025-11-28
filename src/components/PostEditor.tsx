import { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import { Client, Post } from '../types';

interface PostEditorProps {
  post: Post | null;
  clients: Client[];
  onSave: (post: Post) => void;
  onClose: () => void;
}

const PLATFORM_OPTIONS = ['Facebook', 'Instagram', 'Twitter', 'LinkedIn', 'TikTok', 'YouTube'];
const STATUS_OPTIONS = ['draft', 'scheduled', 'published'] as const;

export default function PostEditor({ post, clients, onSave, onClose }: PostEditorProps) {
  const [formData, setFormData] = useState({
    clientId: clients[0]?.id || '',
    content: '',
    scheduledDate: new Date().toISOString().slice(0, 16),
    platform: PLATFORM_OPTIONS[0],
    status: 'draft' as const,
    mediaUrl: ''
  });

  useEffect(() => {
    if (post) {
      setFormData({
        clientId: post.clientId,
        content: post.content,
        scheduledDate: new Date(post.scheduledDate).toISOString().slice(0, 16),
        platform: post.platform,
        status: post.status,
        mediaUrl: post.mediaUrl || ''
      });
    }
  }, [post]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const postData: Post = {
      id: post?.id || Date.now().toString(),
      clientId: formData.clientId,
      content: formData.content,
      scheduledDate: new Date(formData.scheduledDate).toISOString(),
      platform: formData.platform,
      status: formData.status,
      mediaUrl: formData.mediaUrl || undefined,
      createdAt: post?.createdAt || new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    onSave(postData);
  };

  const selectedClient = clients.find(c => c.id === formData.clientId);

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content post-editor-modal" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2>{post ? 'Edit Post' : 'Create New Post'}</h2>
          <button className="modal-close" onClick={onClose}>
            <X size={24} />
          </button>
        </div>
        <form onSubmit={handleSubmit} className="post-form">
          <div className="form-group">
            <label>Client *</label>
            <select
              value={formData.clientId}
              onChange={(e) => setFormData({ ...formData, clientId: e.target.value })}
              required
            >
              <option value="">Select a client</option>
              {clients.map(client => (
                <option key={client.id} value={client.id}>
                  {client.name}
                </option>
              ))}
            </select>
            {selectedClient && (
              <div className="client-preview" style={{ borderLeftColor: selectedClient.color }}>
                <span style={{ color: selectedClient.color }}>{selectedClient.name}</span>
              </div>
            )}
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>Platform *</label>
              <select
                value={formData.platform}
                onChange={(e) => setFormData({ ...formData, platform: e.target.value })}
                required
              >
                {PLATFORM_OPTIONS.map(platform => (
                  <option key={platform} value={platform}>{platform}</option>
                ))}
              </select>
            </div>

            <div className="form-group">
              <label>Status *</label>
              <select
                value={formData.status}
                onChange={(e) => setFormData({ ...formData, status: e.target.value as typeof formData.status })}
                required
              >
                {STATUS_OPTIONS.map(status => (
                  <option key={status} value={status}>
                    {status.charAt(0).toUpperCase() + status.slice(1)}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="form-group">
            <label>Scheduled Date & Time *</label>
            <input
              type="datetime-local"
              value={formData.scheduledDate}
              onChange={(e) => setFormData({ ...formData, scheduledDate: e.target.value })}
              required
            />
          </div>

          <div className="form-group">
            <label>Content *</label>
            <textarea
              value={formData.content}
              onChange={(e) => setFormData({ ...formData, content: e.target.value })}
              rows={6}
              placeholder="Write your post content here..."
              required
            />
            <div className="char-count">{formData.content.length} characters</div>
          </div>

          <div className="form-group">
            <label>Media URL (optional)</label>
            <input
              type="url"
              value={formData.mediaUrl}
              onChange={(e) => setFormData({ ...formData, mediaUrl: e.target.value })}
              placeholder="https://example.com/image.jpg"
            />
          </div>

          <div className="form-actions">
            <button type="button" className="btn-secondary" onClick={onClose}>
              Cancel
            </button>
            <button type="submit" className="btn-primary">
              {post ? 'Update' : 'Create'} Post
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

