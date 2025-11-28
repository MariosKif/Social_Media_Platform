import { useState } from 'react';
import { Upload, FileText, CheckCircle } from 'lucide-react';
import { Client, Post } from '../types';

interface DataImportProps {
  onImport: (clients: Client[], posts: Post[]) => void;
  onClose: () => void;
}

export default function DataImport({ onImport, onClose }: DataImportProps) {
  const [importMethod, setImportMethod] = useState<'csv' | 'manual'>('csv');
  const [csvData, setCsvData] = useState('');
  const [importStatus, setImportStatus] = useState<'idle' | 'processing' | 'success' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState('');

  const parseDate = (dateStr: string): Date | null => {
    if (!dateStr || dateStr.trim() === '' || dateStr === 'x' || dateStr === '?' || dateStr === 'paused') {
      return null;
    }

    // Try different date formats
    const formats = [
      /(\d{2})\/(\d{2})/g, // DD/MM
      /(\d{2})-(\d{2})/g,  // DD-MM
      /(\d{1,2})\/(\d{1,2})/g, // D/M or DD/MM
    ];

    for (const format of formats) {
      const match = dateStr.match(format);
      if (match) {
        const parts = match[0].split(/[\/-]/);
        const day = parseInt(parts[0], 10);
        const month = parseInt(parts[1], 10) - 1; // Month is 0-indexed
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

    // Skip header rows (first 3 rows typically)
    const dataRows = lines.slice(3);

    dataRows.forEach((line, rowIndex) => {
      // Split by tab or comma
      const columns = line.split(/\t|,(?=(?:[^"]*"[^"]*")*[^"]*$)/);
      
      if (columns.length < 4) return;

      // Column structure based on your sheet:
      // Column 1: ID/number
      // Column 2: Client Name
      // Column 3: Pack Name (Custom, Premium, etc.)
      // Column 4: Pack Contents (8 posts, 20 posts, etc.)
      // Columns 5+: Dates

      const clientName = columns[1]?.trim();
      const packName = columns[2]?.trim();
      const packContents = columns[3]?.trim();

      if (!clientName || clientName === '' || clientName.toLowerCase().includes('column')) {
        return;
      }

      // Create or find client
      let client = clients.find(c => c.name === clientName);
      if (!client) {
        client = {
          id: `client-${Date.now()}-${rowIndex}`,
          name: clientName,
          color: clientColors[clients.length % clientColors.length],
          platforms: ['Instagram', 'Facebook'], // Default, can be updated
          createdAt: new Date().toISOString()
        };
        clients.push(client);
      }

      // Parse dates from remaining columns (starting from column 5, index 4)
      for (let i = 4; i < columns.length; i++) {
        const dateValue = columns[i]?.trim();
        if (!dateValue || dateValue === '' || dateValue === 'x' || dateValue === '?' || dateValue === 'paused') {
          continue;
        }

        const date = parseDate(dateValue);
        if (date) {
          // Create a post for this date
          const post: Post = {
            id: `post-${Date.now()}-${rowIndex}-${i}`,
            clientId: client.id,
            content: `${packName || 'Post'} - ${packContents || 'Scheduled post'}`,
            scheduledDate: date.toISOString(),
            platform: 'Instagram', // Default, can be updated
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

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      const text = e.target?.result as string;
      setCsvData(text);
    };
    reader.readAsText(file);
  };

  const handlePaste = (event: React.ClipboardEvent<HTMLTextAreaElement>) => {
    const pastedText = event.clipboardData.getData('text');
    setCsvData(pastedText);
  };

  const handleImport = () => {
    if (!csvData.trim()) {
      setErrorMessage('Please paste or upload CSV data');
      setImportStatus('error');
      return;
    }

    setImportStatus('processing');
    setErrorMessage('');

    try {
      const { clients, posts } = parseCSV(csvData);
      
      if (clients.length === 0) {
        setErrorMessage('No valid clients found in the data. Please check the format.');
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
      <div className="modal-content import-modal" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2>Import Data from Google Sheets</h2>
          <button className="modal-close" onClick={onClose}>×</button>
        </div>

        <div className="import-content">
          <div className="import-method-selector">
            <button
              className={importMethod === 'csv' ? 'active' : ''}
              onClick={() => setImportMethod('csv')}
            >
              <FileText size={20} />
              CSV/TSV Import
            </button>
            <button
              className={importMethod === 'manual' ? 'active' : ''}
              onClick={() => setImportMethod('manual')}
            >
              <Upload size={20} />
              File Upload
            </button>
          </div>

          <div className="import-instructions">
            <h3>How to import:</h3>
            <ol>
              <li>Open your Google Sheet</li>
              <li>Select all data (Ctrl+A or Cmd+A)</li>
              <li>Copy (Ctrl+C or Cmd+C)</li>
              <li>Paste into the text area below</li>
            </ol>
            <p className="note">
              The import expects: Client Name (column 2), Pack Name (column 3), and dates in subsequent columns.
            </p>
          </div>

          <div className="form-group">
            <label>
              {importMethod === 'csv' ? 'Paste your spreadsheet data here:' : 'Upload CSV file:'}
            </label>
            {importMethod === 'csv' ? (
              <textarea
                value={csvData}
                onChange={(e) => setCsvData(e.target.value)}
                onPaste={handlePaste}
                placeholder="Paste your Google Sheets data here (Ctrl+V or Cmd+V)..."
                rows={10}
                className="import-textarea"
              />
            ) : (
              <div className="file-upload-area">
                <input
                  type="file"
                  accept=".csv,.tsv,.txt"
                  onChange={handleFileUpload}
                  id="file-upload"
                  style={{ display: 'none' }}
                />
                <label htmlFor="file-upload" className="file-upload-label">
                  <Upload size={24} />
                  <span>Click to upload or drag and drop</span>
                  <span className="file-upload-hint">CSV, TSV, or TXT files</span>
                </label>
                {csvData && (
                  <div className="file-preview">
                    <FileText size={16} />
                    <span>File loaded ({csvData.split('\n').length} lines)</span>
                  </div>
                )}
              </div>
            )}
          </div>

          {importStatus === 'error' && (
            <div className="import-error">
              {errorMessage}
            </div>
          )}

          {importStatus === 'success' && (
            <div className="import-success">
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

