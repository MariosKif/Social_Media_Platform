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
    <div className="dashboard-overview">
      <h1>Dashboard Overview</h1>

      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-icon" style={{ backgroundColor: '#6366f1' }}>
            <Users size={24} />
          </div>
          <div className="stat-content">
            <h3>{clients.length}</h3>
            <p>Total Clients</p>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon" style={{ backgroundColor: '#8b5cf6' }}>
            <FileText size={24} />
          </div>
          <div className="stat-content">
            <h3>{posts.length}</h3>
            <p>Total Posts</p>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon" style={{ backgroundColor: '#ec4899' }}>
            <Calendar size={24} />
          </div>
          <div className="stat-content">
            <h3>{thisWeekPosts.length}</h3>
            <p>This Week</p>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon" style={{ backgroundColor: '#10b981' }}>
            <Clock size={24} />
          </div>
          <div className="stat-content">
            <h3>{scheduledPosts.length}</h3>
            <p>Scheduled</p>
          </div>
        </div>
      </div>

      <div className="overview-grid">
        <div className="overview-section">
          <h2>Upcoming Posts</h2>
          <div className="upcoming-posts">
            {upcomingPosts.length > 0 ? (
              upcomingPosts.map(post => (
                <div key={post.id} className="upcoming-post-item">
                  <div className="post-indicator" style={{ backgroundColor: getClientColor(post.clientId) }}></div>
                  <div className="post-info">
                    <div className="post-header">
                      <span className="client-name">{getClientName(post.clientId)}</span>
                      <span className="post-platform">{post.platform}</span>
                    </div>
                    <p className="post-content-preview">{post.content.substring(0, 60)}...</p>
                    <p className="post-date">
                      {format(new Date(post.scheduledDate), 'MMM d, yyyy • h:mm a')}
                    </p>
                  </div>
                  <div className="post-actions">
                    <button onClick={() => onEditPost(post)} className="btn-small">Edit</button>
                  </div>
                </div>
              ))
            ) : (
              <p className="empty-message">No upcoming posts</p>
            )}
          </div>
        </div>

        <div className="overview-section">
          <h2>Post Status</h2>
          <div className="status-breakdown">
            <div className="status-item">
              <div className="status-badge draft">{draftPosts.length}</div>
              <span>Drafts</span>
            </div>
            <div className="status-item">
              <div className="status-badge scheduled">{scheduledPosts.length}</div>
              <span>Scheduled</span>
            </div>
            <div className="status-item">
              <div className="status-badge published">{publishedPosts.length}</div>
              <span>Published</span>
            </div>
          </div>

          <h3 style={{ marginTop: '2rem' }}>Recent Posts</h3>
          <div className="recent-posts">
            {posts.slice(0, 5).map(post => (
              <div key={post.id} className="recent-post-item">
                <div className="recent-post-header">
                  <span className="client-badge-small" style={{ backgroundColor: getClientColor(post.clientId) }}>
                    {getClientName(post.clientId)}
                  </span>
                  <span className="post-status-small" data-status={post.status}>
                    {post.status}
                  </span>
                </div>
                <p>{post.content.substring(0, 50)}...</p>
                <span className="post-date-small">
                  {format(new Date(post.scheduledDate), 'MMM d, yyyy')}
                </span>
              </div>
            ))}
            {posts.length === 0 && (
              <p className="empty-message">No posts yet</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

