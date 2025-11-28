import { Calendar, Users, FileText, LayoutDashboard } from 'lucide-react';

interface SidebarProps {
  activeView: 'overview' | 'calendar' | 'clients' | 'posts';
  onViewChange: (view: 'overview' | 'calendar' | 'clients' | 'posts') => void;
  onNewPost: () => void;
}

export default function Sidebar({ activeView, onViewChange, onNewPost }: SidebarProps) {
  return (
    <aside className="sidebar">
      <div className="sidebar-header">
        <h1>Social Media Planner</h1>
      </div>
      <nav className="sidebar-nav">
        <button
          className={activeView === 'overview' ? 'active' : ''}
          onClick={() => onViewChange('overview')}
        >
          <LayoutDashboard size={20} />
          <span>Overview</span>
        </button>
        <button
          className={activeView === 'calendar' ? 'active' : ''}
          onClick={() => onViewChange('calendar')}
        >
          <Calendar size={20} />
          <span>Calendar</span>
        </button>
        <button
          className={activeView === 'clients' ? 'active' : ''}
          onClick={() => onViewChange('clients')}
        >
          <Users size={20} />
          <span>Clients</span>
        </button>
        <button
          className={activeView === 'posts' ? 'active' : ''}
          onClick={() => onViewChange('posts')}
        >
          <FileText size={20} />
          <span>All Posts</span>
        </button>
      </nav>
      <div className="sidebar-footer">
        <button className="btn-new-post" onClick={onNewPost}>
          + New Post
        </button>
      </div>
    </aside>
  );
}

