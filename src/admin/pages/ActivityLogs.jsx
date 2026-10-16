import React, { useState, useEffect } from 'react';
import { activityLogsApi } from '../services/api';
import {
  History,
  Search,
  Filter,
  RefreshCw,
  Clock,
  User,
  Shield,
  FileText
} from 'lucide-react';

const ActivityLogs = () => {
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [actionFilter, setActionFilter] = useState('all');
  const [recordTypeFilter, setRecordTypeFilter] = useState('all');
  const [pagination, setPagination] = useState({ page: 1, limit: 20, total: 0, totalPages: 1 });

  const fetchLogs = async (page = 1) => {
    try {
      setLoading(true);
      const res = await activityLogsApi.getAll({
        search,
        action: actionFilter,
        recordType: recordTypeFilter,
        page,
        limit: pagination.limit
      });
      if (res.success) {
        setLogs(res.logs || []);
        setPagination(res.pagination);
      }
    } catch (err) {
      console.error('Fetch activity logs error:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      fetchLogs(1);
    }, 250);
    return () => clearTimeout(timer);
  }, [search, actionFilter, recordTypeFilter]);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      {/* Header */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: '1rem'
      }}>
        <div>
          <h1 style={{ fontSize: '1.5rem', fontWeight: 800, margin: 0, color: '#0f172a' }}>
            System Activity & Audit Trail
          </h1>
          <p style={{ color: '#64748b', fontSize: '0.85rem', margin: '2px 0 0 0' }}>
            Tamper-evident logs of logins, record modifications, financial updates and deletions
          </p>
        </div>
      </div>

      {/* Toolbar */}
      <div style={{
        background: '#ffffff',
        borderRadius: '14px',
        padding: '1rem',
        border: '1px solid #e2e8f0',
        display: 'flex',
        alignItems: 'center',
        gap: '1rem',
        flexWrap: 'wrap'
      }}>
        <div style={{ flex: 1, minWidth: '220px', position: 'relative' }}>
          <Search size={17} style={{ position: 'absolute', left: '0.9rem', top: '50%', transform: 'translateY(-50%)', color: '#94a3b8' }} />
          <input
            type="text"
            placeholder="Search by actor, details or record ID..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            style={{
              width: '100%',
              padding: '0.65rem 1rem 0.65rem 2.5rem',
              borderRadius: '8px',
              border: '1px solid #cbd5e1',
              fontSize: '0.875rem',
              outline: 'none'
            }}
          />
        </div>

        <select
          value={actionFilter}
          onChange={(e) => setActionFilter(e.target.value)}
          style={{ padding: '0.65rem 0.85rem', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '0.875rem', background: '#ffffff', outline: 'none' }}
        >
          <option value="all">All Actions</option>
          <option value="CREATE">CREATE</option>
          <option value="UPDATE">UPDATE</option>
          <option value="ARCHIVE">ARCHIVE</option>
          <option value="DELETE">DELETE</option>
          <option value="LOGIN">LOGIN</option>
          <option value="LOGOUT">LOGOUT</option>
        </select>

        <select
          value={recordTypeFilter}
          onChange={(e) => setRecordTypeFilter(e.target.value)}
          style={{ padding: '0.65rem 0.85rem', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '0.875rem', background: '#ffffff', outline: 'none' }}
        >
          <option value="all">All Modules</option>
          <option value="DONATION">DONATION</option>
          <option value="EXPENSE">EXPENSE</option>
          <option value="VOLUNTEER">VOLUNTEER</option>
          <option value="ENQUIRY">ENQUIRY</option>
          <option value="MEMBER">MEMBER</option>
          <option value="PROGRAM">PROGRAM</option>
          <option value="EVENT">EVENT</option>
          <option value="CONTENT">CONTENT</option>
          <option value="ADMIN_USER">ADMIN_USER</option>
          <option value="AUTH">AUTH</option>
        </select>

        <button onClick={() => fetchLogs(pagination.page)} style={{ ...btnSecondaryStyle, padding: '0.65rem 0.85rem' }} title="Refresh">
          <RefreshCw size={16} />
        </button>
      </div>

      {/* Table */}
      <div style={{
        background: '#ffffff',
        borderRadius: '16px',
        border: '1px solid #e2e8f0',
        boxShadow: '0 2px 8px rgba(0,0,0,0.03)',
        overflow: 'hidden'
      }}>
        {loading ? (
          <div style={{ padding: '3rem', textAlign: 'center', color: '#64748b' }}>
            <RefreshCw size={28} className="animate-spin" style={{ color: '#0b4b25', margin: '0 auto 0.5rem auto' }} />
            <p>Loading activity logs from MySQL...</p>
          </div>
        ) : logs.length === 0 ? (
          <div style={{ padding: '4rem 1rem', textAlign: 'center', color: '#64748b' }}>
            <History size={40} style={{ color: '#cbd5e1', margin: '0 auto 0.75rem auto' }} />
            <h3 style={{ fontSize: '1.1rem', fontWeight: 600, color: '#334155' }}>No activity logs recorded</h3>
          </div>
        ) : (
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.875rem' }}>
              <thead>
                <tr style={{ background: '#f8fafc', borderBottom: '1px solid #e2e8f0', color: '#475569' }}>
                  <th style={{ padding: '0.85rem 1rem', fontWeight: 600 }}>Action</th>
                  <th style={{ padding: '0.85rem 1rem', fontWeight: 600 }}>Actor</th>
                  <th style={{ padding: '0.85rem 1rem', fontWeight: 600 }}>Target Module</th>
                  <th style={{ padding: '0.85rem 1rem', fontWeight: 600 }}>Details & Audit Notes</th>
                  <th style={{ padding: '0.85rem 1rem', fontWeight: 600 }}>IP Address</th>
                  <th style={{ padding: '0.85rem 1rem', fontWeight: 600, textAlign: 'right' }}>Timestamp</th>
                </tr>
              </thead>
              <tbody>
                {logs.map(lg => (
                  <tr key={lg.id} style={{ borderBottom: '1px solid #f1f5f9' }}>
                    <td style={{ padding: '0.85rem 1rem' }}>
                      <span style={getActionBadge(lg.action)}>
                        {lg.action}
                      </span>
                    </td>
                    <td style={{ padding: '0.85rem 1rem', fontWeight: 600, color: '#0f172a' }}>
                      {lg.actor_name}
                    </td>
                    <td style={{ padding: '0.85rem 1rem' }}>
                      <span style={{
                        background: '#f1f5f9',
                        color: '#334155',
                        padding: '2px 8px',
                        borderRadius: '6px',
                        fontSize: '0.75rem',
                        fontWeight: 600
                      }}>
                        {lg.record_type}
                      </span>
                      {lg.record_id && (
                        <span style={{ fontSize: '0.75rem', color: '#64748b', marginLeft: '6px', fontFamily: 'monospace' }}>
                          #{lg.record_id}
                        </span>
                      )}
                    </td>
                    <td style={{ padding: '0.85rem 1rem', color: '#334155', maxWidth: '350px' }}>
                      {lg.details || '—'}
                    </td>
                    <td style={{ padding: '0.85rem 1rem', color: '#94a3b8', fontSize: '0.8rem', fontFamily: 'monospace' }}>
                      {lg.ip_address || '127.0.0.1'}
                    </td>
                    <td style={{ padding: '0.85rem 1rem', textAlign: 'right', color: '#64748b', fontSize: '0.8rem', whiteSpace: 'nowrap' }}>
                      {new Date(lg.created_at).toLocaleString('en-IN')}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Pagination */}
        {pagination.totalPages > 1 && (
          <div style={{
            padding: '1rem',
            borderTop: '1px solid #e2e8f0',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            fontSize: '0.85rem',
            color: '#64748b'
          }}>
            <div>
              Showing {logs.length} of {pagination.total} audit records
            </div>
            <div style={{ display: 'flex', gap: '0.35rem' }}>
              <button
                disabled={pagination.page <= 1}
                onClick={() => fetchLogs(pagination.page - 1)}
                style={{
                  padding: '0.35rem 0.75rem',
                  borderRadius: '6px',
                  border: '1px solid #cbd5e1',
                  background: '#ffffff',
                  cursor: pagination.page <= 1 ? 'not-allowed' : 'pointer'
                }}
              >
                Previous
              </button>
              <span style={{ padding: '0.35rem 0.75rem', fontWeight: 600 }}>
                Page {pagination.page} of {pagination.totalPages}
              </span>
              <button
                disabled={pagination.page >= pagination.totalPages}
                onClick={() => fetchLogs(pagination.page + 1)}
                style={{
                  padding: '0.35rem 0.75rem',
                  borderRadius: '6px',
                  border: '1px solid #cbd5e1',
                  background: '#ffffff',
                  cursor: pagination.page >= pagination.totalPages ? 'not-allowed' : 'pointer'
                }}
              >
                Next
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

const btnSecondaryStyle = {
  display: 'inline-flex',
  alignItems: 'center',
  gap: '0.45rem',
  padding: '0.65rem 1.15rem',
  borderRadius: '10px',
  border: '1px solid #cbd5e1',
  background: '#ffffff',
  color: '#334155',
  fontSize: '0.85rem',
  fontWeight: 600,
  cursor: 'pointer'
};

function getActionBadge(action) {
  const base = { padding: '3px 8px', borderRadius: '6px', fontSize: '0.725rem', fontWeight: 700 };
  switch (action) {
    case 'CREATE':
      return { ...base, background: '#dcfce7', color: '#15803d' };
    case 'UPDATE':
      return { ...base, background: '#dbeafe', color: '#1d4ed8' };
    case 'DELETE':
    case 'ARCHIVE':
      return { ...base, background: '#fee2e2', color: '#b91c1c' };
    case 'LOGIN':
      return { ...base, background: '#fef3c7', color: '#b45309' };
    case 'LOGOUT':
      return { ...base, background: '#f1f5f9', color: '#64748b' };
    default:
      return { ...base, background: '#f1f5f9', color: '#475569' };
  }
}

export default ActivityLogs;
