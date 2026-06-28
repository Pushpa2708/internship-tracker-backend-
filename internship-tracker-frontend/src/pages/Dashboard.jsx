import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../api/axios';

const STATUSES = ['Applied', 'Interview', 'Offer', 'Rejected'];

function Dashboard() {
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [newApp, setNewApp] = useState({ company: '', role: '', status: 'Applied', notes: '' });
  const [submitting, setSubmitting] = useState(false);

  const { user, logout } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
  const fetchApplications = async () => {
    try {
      const { data } = await api.get('/applications');
      setApplications(data.data);
    } catch {
      setError('Failed to load applications');
    } finally {
      setLoading(false);
    }
  };
  fetchApplications();
}, []);

  

  const handleCreate = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setError('');

    try {
      const { data } = await api.post('/applications', newApp);
      // Add new app to the top of the list without re-fetching everything
      setApplications([data.data, ...applications]);
      setNewApp({ company: '', role: '', status: 'Applied', notes: '' });
      setShowForm(false);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to create application');
    } finally {
      setSubmitting(false);
    }
  };

  const handleStatusUpdate = async (id, status) => {
    try {
      const { data } = await api.put(`/applications/${id}`, { status });
      // Replace the updated application in state without a full re-fetch
      setApplications(applications.map(app =>
        app._id === id ? data.data : app
      ));
    } catch  {
      setError('Failed to update status');
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this application?')) return;
    try {
      await api.delete(`/applications/${id}`);
      setApplications(applications.filter(app => app._id !== id));
    } catch  {
      setError('Failed to delete application');
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  if (loading) {
    return <div style={{ textAlign: 'center', marginTop: '4rem' }}>Loading your applications...</div>;
  }

  return (
    <div style={{ maxWidth: '800px', margin: '0 auto', padding: '2rem' }}>

      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <div>
          <h2 style={{ margin: 0 }}>Internship Tracker</h2>
          <p style={{ margin: '0.25rem 0 0', color: '#666' }}>Welcome, {user?.name}</p>
        </div>
        <button onClick={handleLogout} style={{ padding: '0.5rem 1rem' }}>
          Logout
        </button>
      </div>

      {/* Error message */}
      {error && (
        <p style={{ color: 'red', background: '#fff0f0', padding: '0.75rem', borderRadius: '4px', marginBottom: '1rem' }}>
          {error}
          <button onClick={() => setError('')} style={{ float: 'right', background: 'none', border: 'none', cursor: 'pointer' }}>✕</button>
        </p>
      )}

      {/* Add button */}
      <button
        onClick={() => setShowForm(!showForm)}
        style={{ marginBottom: '1rem', padding: '0.5rem 1rem' }}
      >
        {showForm ? '✕ Cancel' : '+ Add Application'}
      </button>

      {/* Add form */}
      {showForm && (
        <form onSubmit={handleCreate} style={{ border: '1px solid #ddd', borderRadius: '8px', padding: '1.5rem', marginBottom: '1.5rem' }}>
          <h3 style={{ marginTop: 0 }}>New Application</h3>
          <div style={{ display: 'grid', gap: '0.75rem' }}>
            <input
              placeholder="Company *"
              value={newApp.company}
              onChange={e => setNewApp({ ...newApp, company: e.target.value })}
              required
              style={{ padding: '0.5rem', width: '100%', boxSizing: 'border-box' }}
            />
            <input
              placeholder="Role *"
              value={newApp.role}
              onChange={e => setNewApp({ ...newApp, role: e.target.value })}
              required
              style={{ padding: '0.5rem', width: '100%', boxSizing: 'border-box' }}
            />
            <select
              value={newApp.status}
              onChange={e => setNewApp({ ...newApp, status: e.target.value })}
              style={{ padding: '0.5rem' }}
            >
              {STATUSES.map(s => <option key={s}>{s}</option>)}
            </select>
            <textarea
              placeholder="Notes (optional)"
              value={newApp.notes}
              onChange={e => setNewApp({ ...newApp, notes: e.target.value })}
              rows={3}
              style={{ padding: '0.5rem', resize: 'vertical' }}
            />
            <button type="submit" disabled={submitting} style={{ padding: '0.5rem' }}>
              {submitting ? 'Saving...' : 'Save Application'}
            </button>
          </div>
        </form>
      )}

      {/* Applications list */}
      <h3 style={{ marginBottom: '1rem' }}>
        My Applications ({applications.length})
      </h3>

      {applications.length === 0 ? (
        <div style={{ textAlign: 'center', color: '#888', padding: '3rem', border: '2px dashed #ddd', borderRadius: '8px' }}>
          <p>No applications yet.</p>
          <p>Click "Add Application" to track your first one.</p>
        </div>
      ) : (
        <div style={{ display: 'grid', gap: '0.75rem' }}>
          {applications.map(app => (
            <div
              key={app._id}
              style={{ border: '1px solid #ddd', borderRadius: '8px', padding: '1rem', background: '#fafafa' }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <div>
                  <strong style={{ fontSize: '1.1rem' }}>{app.company}</strong>
                  <span style={{ color: '#555' }}> — {app.role}</span>
                  {app.notes && <p style={{ margin: '0.25rem 0 0', color: '#666', fontSize: '0.9rem' }}>{app.notes}</p>}
                  <p style={{ margin: '0.25rem 0 0', fontSize: '0.8rem', color: '#999' }}>
                    Added {new Date(app.appliedDate).toLocaleDateString()}
                  </p>
                </div>
                <button
                  onClick={() => handleDelete(app._id)}
                  style={{ background: 'none', border: 'none', color: '#e55', cursor: 'pointer', fontSize: '1.2rem' }}
                  title="Delete"
                >
                  🗑
                </button>
              </div>

              <div style={{ marginTop: '0.75rem' }}>
                <select
                  value={app.status}
                  onChange={e => handleStatusUpdate(app._id, e.target.value)}
                  style={{
                    padding: '0.25rem 0.5rem',
                    borderRadius: '4px',
                    background: app.status === 'Offer' ? '#d4edda' : app.status === 'Rejected' ? '#f8d7da' : app.status === 'Interview' ? '#fff3cd' : '#e2e3e5',
                    border: '1px solid #ccc',
                    cursor: 'pointer'
                  }}
                >
                  {STATUSES.map(s => <option key={s}>{s}</option>)}
                </select>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default Dashboard;