import { Calendar, Users, FileText, LayoutDashboard, Upload } from 'lucide-react';

interface TopNavProps {
  activeView: 'overview' | 'calendar' | 'clients' | 'posts';
  onViewChange: (view: 'overview' | 'calendar' | 'clients' | 'posts') => void;
  onNewPost: () => void;
  onImport: () => void;
}

export default function TopNav({ activeView, onViewChange, onNewPost, onImport }: TopNavProps) {
  return (
    <nav className="top-nav">
      <div className="top-nav-container">
        <div className="top-nav-brand">
          <h1>Social Media Planner</h1>
        </div>
        
        <div className="top-nav-links">
          <button
            className={activeView === 'overview' ? 'active' : ''}
            onClick={() => onViewChange('overview')}
            title="Dashboard Overview"
          >
            <LayoutDashboard size={18} />
            <span>Overview</span>
          </button>
          <button
            className={activeView === 'calendar' ? 'active' : ''}
            onClick={() => onViewChange('calendar')}
            title="Calendar View"
          >
            <Calendar size={18} />
            <span>Calendar</span>
          </button>
          <button
            className={activeView === 'clients' ? 'active' : ''}
            onClick={() => onViewChange('clients')}
            title="Client Management"
          >
            <Users size={18} />
            <span>Clients</span>
          </button>
          <button
            className={activeView === 'posts' ? 'active' : ''}
            onClick={() => onViewChange('posts')}
            title="All Posts"
          >
            <FileText size={18} />
            <span>All Posts</span>
          </button>
        </div>

        <div className="top-nav-actions">
          <button className="top-nav-action-btn" onClick={onImport} title="Import from Google Sheets">
            <Upload size={18} />
            <span>Import</span>
          </button>
          <button className="top-nav-action-btn primary" onClick={onNewPost} title="Create New Post">
            + New Post
          </button>
        </div>
      </div>
    </nav>
  );
}

