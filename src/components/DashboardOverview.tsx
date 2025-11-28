import { format, startOfWeek, endOfWeek, isWithinInterval, isPast, isToday } from 'date-fns';
import { Calendar, Users, FileText, Clock } from 'lucide-react';
import { Client, Post } from '../types';

interface DashboardOverviewProps {
  clients: Client[];
  posts: Post[];
  onEditPost: (post: Post) => void;
  onDeletePost: (postId: string) => void;
}

export default function DashboardOverview({ clients, posts, onEditPost, onDeletePost }: DashboardOverviewProps) {
  const now = new Date();
  const weekStart = startOfWeek(now);
  const weekEnd = endOfWeek(now);

  const thisWeekPosts = posts.filter(post => {
    const postDate = new Date(post.scheduledDate);
    return isWithinInterval(postDate, { start: weekStart, end: weekEnd });
  });

  const upcomingPosts = posts.filter(post => {
    const postDate = new Date(post.scheduledDate);
    return !isPast(postDate) || isToday(postDate);
  }).sort((a, b) => new Date(a.scheduledDate).getTime() - new Date(b.scheduledDate).getTime()).slice(0, 5);

  const draftPosts = posts.filter(post => post.status === 'draft');
  const scheduledPosts = posts.filter(post => post.status === 'scheduled');
  const publishedPosts = posts.filter(post => post.status === 'published');

  const getClientColor = (clientId: string) => {
    const client = clients.find(c => c.id === clientId);
    return client?.color || '#6366f1';
  };

  const getClientName = (clientId: string) => {
    const client = clients.find(c => c.id === clientId);
    return client?.name || 'Unknown';
  };

  return (
    <div>
      <h1 className="view-header" style={{ marginBottom: '2rem' }}>Dashboard Overview</h1>

      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-icon">
            <Users size={24} />
          </div>
          <div className="stat-content">
            <h3>{clients.length}</h3>
            <p>Total Clients</p>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon">
            <FileText size={24} />
          </div>
          <div className="stat-content">
            <h3>{posts.length}</h3>
            <p>Total Posts</p>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon">
            <Calendar size={24} />
          </div>
          <div className="stat-content">
            <h3>{thisWeekPosts.length}</h3>
            <p>This Week</p>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon">
            <Clock size={24} />
          </div>
          <div className="stat-content">
            <h3>{scheduledPosts.length}</h3>
            <p>Scheduled</p>
          </div>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))', gap: '1.5rem' }}>
        <div className="card">
          <h2 style={{ fontSize: '1.5rem', fontWeight: 700, marginBottom: '1.5rem', color: 'var(--text-primary)' }}>Upcoming Posts</h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {upcomingPosts.length > 0 ? (
              upcomingPosts.map(post => (
                <div key={post.id} style={{ display: 'flex', gap: '1rem', padding: '1.25rem', background: 'var(--bg-secondary)', border: '1px solid var(--border)', borderRadius: 'var(--radius)', transition: 'var(--transition)', cursor: 'pointer' }} onClick={() => onEditPost(post)}>
                  <div style={{ width: '4px', borderRadius: 'var(--radius)', backgroundColor: getClientColor(post.clientId), flexShrink: 0 }}></div>
                  <div style={{ flex: 1 }}>
                    <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center', marginBottom: '0.5rem' }}>
                      <span style={{ fontWeight: 600, color: 'var(--text-primary)' }}>{getClientName(post.clientId)}</span>
                      <span style={{ padding: '0.25rem 0.75rem', background: 'var(--bg-tertiary)', borderRadius: 'var(--radius)', fontSize: '0.75rem', color: 'var(--text-secondary)' }}>{post.platform}</span>
                    </div>
                    <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem', marginBottom: '0.5rem' }}>{post.content.substring(0, 60)}...</p>
                    <p style={{ fontSize: '0.75rem', color: 'var(--text-tertiary)' }}>
                      {format(new Date(post.scheduledDate), 'MMM d, yyyy • h:mm a')}
                    </p>
                  </div>
                </div>
              ))
            ) : (
              <p style={{ textAlign: 'center', color: 'var(--text-tertiary)', padding: '2rem' }}>No upcoming posts</p>
            )}
          </div>
        </div>

        <div className="card">
          <h2 style={{ fontSize: '1.5rem', fontWeight: 700, marginBottom: '1.5rem', color: 'var(--text-primary)' }}>Post Status</h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', marginBottom: '2rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', padding: '1.25rem', background: 'var(--bg-secondary)', border: '1px solid var(--border)', borderRadius: 'var(--radius)' }}>
              <div style={{ width: '56px', height: '56px', borderRadius: 'var(--radius)', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'linear-gradient(135deg, #f59e0b 0%, #f97316 100%)', color: 'white', fontWeight: 700, fontSize: '1.5rem', boxShadow: 'var(--shadow)' }}>{draftPosts.length}</div>
              <span style={{ color: 'var(--text-primary)', fontWeight: 600 }}>Drafts</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', padding: '1.25rem', background: 'var(--bg-secondary)', border: '1px solid var(--border)', borderRadius: 'var(--radius)' }}>
              <div style={{ width: '56px', height: '56px', borderRadius: 'var(--radius)', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'var(--gradient-primary)', color: 'white', fontWeight: 700, fontSize: '1.5rem', boxShadow: 'var(--shadow)' }}>{scheduledPosts.length}</div>
              <span style={{ color: 'var(--text-primary)', fontWeight: 600 }}>Scheduled</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', padding: '1.25rem', background: 'var(--bg-secondary)', border: '1px solid var(--border)', borderRadius: 'var(--radius)' }}>
              <div style={{ width: '56px', height: '56px', borderRadius: 'var(--radius)', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'var(--gradient-success)', color: 'white', fontWeight: 700, fontSize: '1.5rem', boxShadow: 'var(--shadow)' }}>{publishedPosts.length}</div>
              <span style={{ color: 'var(--text-primary)', fontWeight: 600 }}>Published</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

