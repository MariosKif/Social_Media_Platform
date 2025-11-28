import { useState } from 'react';
import { Upload, FileText, CheckCircle } from 'lucide-react';
import { Client, Post } from '../types';

interface DataImportProps {
  onImport: (clients: Client[], posts: Post[]) => void;
  onClose: () => void;
}

export default function DataImport({ onImport, onClose }: DataImportProps) {
  const [csvData, setCsvData] = useState('');
  const [importStatus, setImportStatus] = useState<'idle' | 'processing' | 'success' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState('');

  const parseDate = (dateStr: string): Date | null => {
    if (!dateStr || dateStr.trim() === '' || dateStr === 'x' || dateStr === '?' || dateStr === 'paused') {
      return null;
    }

    const formats = [
      /(\d{2})\/(\d{2})/g,
      /(\d{2})-(\d{2})/g,
      /(\d{1,2})\/(\d{1,2})/g,
    ];

    for (const format of formats) {
      const match = dateStr.match(format);
      if (match) {
        const parts = match[0].split(/[\/-]/);
        const day = parseInt(parts[0], 10);
        const month = parseInt(parts[1], 10) - 1;
        const currentYear = new Date().getFullYear();
        const date = new Date(currentYear, month, day);
        if (!isNaN(date.getTime())) {
          return date;
        }
      }
    }

    return null;
  };

  const parseCSV = (csv: string) => {
    const lines = csv.split('\n').filter(line => line.trim());
    const clients: Client[] = [];
    const posts: Post[] = [];
    const clientColors = [
      '#6366f1', '#8b5cf6', '#ec4899', '#f43f5e',
      '#ef4444', '#f59e0b', '#10b981', '#06b6d4',
      '#3b82f6', '#14b8a6', '#84cc16', '#f97316'
    ];

    const dataRows = lines.slice(3);

    dataRows.forEach((line, rowIndex) => {
      const columns = line.split(/\t|,(?=(?:[^"]*"[^"]*")*[^"]*$)/);
      
      if (columns.length < 4) return;

      const clientName = columns[1]?.trim();
      const packName = columns[2]?.trim();
      const packContents = columns[3]?.trim();

      if (!clientName || clientName === '' || clientName.toLowerCase().includes('column')) {
        return;
      }

      let client = clients.find(c => c.name === clientName);
      if (!client) {
        client = {
          id: `client-${Date.now()}-${rowIndex}`,
          name: clientName,
          color: clientColors[clients.length % clientColors.length],
          platforms: ['Instagram', 'Facebook'],
          createdAt: new Date().toISOString()
        };
        clients.push(client);
      }

      for (let i = 4; i < columns.length; i++) {
        const dateValue = columns[i]?.trim();
        if (!dateValue || dateValue === '' || dateValue === 'x' || dateValue === '?' || dateValue === 'paused') {
          continue;
        }

        const date = parseDate(dateValue);
        if (date) {
          const post: Post = {
            id: `post-${Date.now()}-${rowIndex}-${i}`,
            clientId: client.id,
            content: `${packName || 'Post'} - ${packContents || 'Scheduled post'}`,
            scheduledDate: date.toISOString(),
            platform: 'Instagram',
            status: dateValue === 'x' ? 'published' : 'scheduled',
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
          };
          posts.push(post);
        }
      }
    });

    return { clients, posts };
  };

  const handleImport = () => {
    if (!csvData.trim()) {
      setErrorMessage('Please paste CSV data');
      setImportStatus('error');
      return;
    }

    setImportStatus('processing');
    setErrorMessage('');

    try {
      const { clients, posts } = parseCSV(csvData);
      
      if (clients.length === 0) {
        setErrorMessage('No valid clients found');
        setImportStatus('error');
        return;
      }

      onImport(clients, posts);
      setImportStatus('success');
      
      setTimeout(() => {
        onClose();
      }, 1500);
    } catch (error) {
      setErrorMessage(`Import failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
      setImportStatus('error');
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()} style={{ maxWidth: '800px' }}>
        <div className="modal-header">
          <h2>Import Data from Google Sheets</h2>
          <button className="modal-close" onClick={onClose}>×</button>
        </div>

        <div style={{ padding: '2rem' }}>
          <div style={{ background: 'var(--bg-secondary)', padding: '1.5rem', borderRadius: 'var(--radius)', marginBottom: '1.5rem', border: '1px solid var(--border)' }}>
            <h3 style={{ fontSize: '1rem', fontWeight: 600, marginBottom: '1rem', color: 'var(--text-primary)' }}>How to import:</h3>
            <ol style={{ marginLeft: '1.5rem', marginBottom: '1rem', color: 'var(--text-secondary)' }}>
              <li>Open your Google Sheet</li>
              <li>Select all data (Ctrl+A or Cmd+A)</li>
              <li>Copy (Ctrl+C or Cmd+C)</li>
              <li>Paste into the text area below</li>
            </ol>
          </div>

          <div className="form-group">
            <label>Paste your spreadsheet data here:</label>
            <textarea
              value={csvData}
              onChange={(e) => setCsvData(e.target.value)}
              placeholder="Paste your Google Sheets data here..."
              rows={10}
              style={{ fontFamily: 'monospace', fontSize: '0.875rem', background: 'var(--bg-primary)', border: '1px solid var(--border)' }}
            />
          </div>

          {importStatus === 'error' && (
            <div style={{ padding: '1.25rem', background: 'rgba(239, 68, 68, 0.1)', border: '1px solid rgba(239, 68, 68, 0.3)', borderRadius: 'var(--radius)', color: '#f87171', marginBottom: '1rem', fontWeight: 500 }}>
              {errorMessage}
            </div>
          )}

          {importStatus === 'success' && (
            <div style={{ padding: '1.25rem', background: 'rgba(16, 185, 129, 0.1)', border: '1px solid rgba(16, 185, 129, 0.3)', borderRadius: 'var(--radius)', color: '#34d399', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.75rem', fontWeight: 600 }}>
              <CheckCircle size={20} />
              <span>Data imported successfully!</span>
            </div>
          )}

          <div className="form-actions">
            <button type="button" className="btn-secondary" onClick={onClose}>
              Cancel
            </button>
            <button
              type="button"
              className="btn-primary"
              onClick={handleImport}
              disabled={importStatus === 'processing' || !csvData.trim()}
            >
              {importStatus === 'processing' ? 'Importing...' : 'Import Data'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

