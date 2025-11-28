import { useState } from 'react';
import { format, startOfMonth, endOfMonth, eachDayOfInterval, isSameMonth, isSameDay, addMonths, subMonths, startOfWeek, endOfWeek } from 'date-fns';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Client, Post } from '../types';

interface CalendarViewProps {
  clients: Client[];
  posts: Post[];
  onPostClick: (post: Post) => void;
}

export default function CalendarView({ clients, posts, onPostClick }: CalendarViewProps) {
  const [currentDate, setCurrentDate] = useState(new Date());

  const monthStart = startOfMonth(currentDate);
  const monthEnd = endOfMonth(currentDate);
  const calendarStart = startOfWeek(monthStart);
  const calendarEnd = endOfWeek(monthEnd);
  
  const daysInMonth = eachDayOfInterval({ start: calendarStart, end: calendarEnd });

  const getPostsForDate = (date: Date) => {
    return posts.filter(post => {
      const postDate = new Date(post.scheduledDate);
      return isSameDay(postDate, date);
    });
  };

  const getClientColor = (clientId: string) => {
    const client = clients.find(c => c.id === clientId);
    return client?.color || '#6366f1';
  };

  const previousMonth = () => setCurrentDate(subMonths(currentDate, 1));
  const nextMonth = () => setCurrentDate(addMonths(currentDate, 1));

  return (
    <div className="calendar-view">
      <div className="calendar-header">
        <h1 style={{ fontSize: '2rem', fontWeight: 800, color: 'var(--text-primary)' }}>Posting Calendar</h1>
        <div className="calendar-controls">
          <button onClick={previousMonth} className="calendar-nav-btn">
            <ChevronLeft size={20} />
          </button>
          <h2>{format(currentDate, 'MMMM yyyy')}</h2>
          <button onClick={nextMonth} className="calendar-nav-btn">
            <ChevronRight size={20} />
          </button>
        </div>
      </div>

      <div className="calendar-grid">
        <div className="calendar-weekdays">
          {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
            <div key={day} className="calendar-weekday">{day}</div>
          ))}
        </div>
        <div className="calendar-days">
          {daysInMonth.map(day => {
            const dayPosts = getPostsForDate(day);
            const isCurrentMonth = isSameMonth(day, currentDate);
            const isToday = isSameDay(day, new Date());

            return (
              <div
                key={day.toISOString()}
                className={`calendar-day ${!isCurrentMonth ? 'other-month' : ''} ${isToday ? 'today' : ''}`}
              >
                <div className="calendar-day-number">{format(day, 'd')}</div>
                <div className="calendar-day-posts">
                  {dayPosts.slice(0, 3).map(post => (
                    <div
                      key={post.id}
                      className="calendar-post-item"
                      style={{ backgroundColor: getClientColor(post.clientId) }}
                      onClick={() => onPostClick(post)}
                      title={`${clients.find(c => c.id === post.clientId)?.name || 'Unknown'}: ${post.content.substring(0, 30)}...`}
                    >
                      <span style={{ fontSize: '0.625rem', fontWeight: 700, opacity: 0.9 }}>
                        {format(new Date(post.scheduledDate), 'HH:mm')}
                      </span>
                      <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                        {post.content.substring(0, 20)}...
                      </span>
                    </div>
                  ))}
                  {dayPosts.length > 3 && (
                    <div style={{ padding: '0.25rem', textAlign: 'center', fontSize: '0.75rem', color: 'var(--text-tertiary)', fontWeight: 600 }}>
                      +{dayPosts.length - 3} more
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <div style={{ marginTop: '2rem', paddingTop: '2rem', borderTop: '1px solid var(--border)' }}>
        <h3 style={{ marginBottom: '1rem', fontSize: '1rem', fontWeight: 600, color: 'var(--text-primary)' }}>Clients</h3>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '1.5rem' }}>
          {clients.map(client => (
            <div key={client.id} style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
              <div style={{ width: '20px', height: '20px', borderRadius: 'var(--radius)', backgroundColor: client.color, boxShadow: 'var(--shadow)' }}></div>
              <span style={{ color: 'var(--text-secondary)' }}>{client.name}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

