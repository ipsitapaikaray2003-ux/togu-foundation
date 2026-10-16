import React, { useState, useEffect } from 'react';
import { donationsApi, programsApi } from '../services/api';
import {
  HeartHandshake,
  Search,
  Filter,
  Plus,
  Download,
  Edit,
  Trash2,
  Eye,
  CheckCircle,
  Clock,
  RefreshCw,
  X,
  Receipt,
  AlertTriangle,
  CreditCard
} from 'lucide-react';

const Donations = () => {
  const [donations, setDonations] = useState([]);
  const [summary, setSummary] = useState({});
  const [programs, setPrograms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [methodFilter, setMethodFilter] = useState('all');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [pagination, setPagination] = useState({ page: 1, limit: 15, total: 0, totalPages: 1 });
  const [exporting, setExporting] = useState(false);

  // Modal
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedDonation, setSelectedDonation] = useState(null);
  const [modalMode, setModalMode] = useState('create'); // 'create' | 'edit' | 'receipt'
  const [formData, setFormData] = useState({
    donor_name: '',
    donor_email: '',
    donor_phone: '',
    amount: '',
    currency: 'INR',
    donation_date: new Date().toISOString().split('T')[0],
    payment_method: 'Bank Transfer',
    transaction_id: '',
    payment_status: 'Successful',
    program_id: '',
    internal_notes: ''
  });
  const [formError, setFormError] = useState('');
  const [saving, setSaving] = useState(false);
  const [notification, setNotification] = useState('');

  const showNotification = (msg) => {
    setNotification(msg);
    setTimeout(() => setNotification(''), 4000);
  };

  const fetchDonations = async (page = 1) => {
    try {
      setLoading(true);
      const res = await donationsApi.getAll({
        search,
        status: statusFilter,
        method: methodFilter,
        startDate,
        endDate,
        page,
        limit: pagination.limit
      });
      if (res.success) {
        setDonations(res.donations || []);
        setSummary(res.summary || {});
        setPagination(res.pagination);
      }
    } catch (err) {
      console.error('Fetch donations error:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      fetchDonations(1);
    }, 250);
    return () => clearTimeout(timer);
  }, [search, statusFilter, methodFilter, startDate, endDate]);

  useEffect(() => {
    const loadPrograms = async () => {
      try {
        const res = await programsApi.getAll();
        if (res.success) setPrograms(res.programs || []);
      } catch {
        // quiet
      }
    };
    loadPrograms();
  }, []);

  const handleExportCsv = async () => {
    try {
      setExporting(true);
      await donationsApi.exportCsv({
        search,
        status: statusFilter,
        method: methodFilter,
        startDate,
        endDate
      });
      showNotification('Donation reports exported to CSV successfully.');
    } catch (err) {
      alert('Export failed: ' + err.message);
    } finally {
      setExporting(false);
    }
  };

  const handleOpenModal = (mode, don = null) => {
    setModalMode(mode);
    setSelectedDonation(don);
    setFormError('');

    if (mode === 'create') {
      setFormData({
        donor_name: '',
        donor_email: '',
        donor_phone: '',
        amount: '',
        currency: 'INR',
        donation_date: new Date().toISOString().split('T')[0],
        payment_method: 'Bank Transfer',
        transaction_id: '',
        payment_status: 'Successful',
        program_id: programs.length > 0 ? programs[0].id : '',
        internal_notes: ''
      });
    } else if (don) {
      setFormData({
        donor_name: don.donor_name || '',
        donor_email: don.donor_email || '',
        donor_phone: don.donor_phone || '',
        amount: don.amount || '',
        currency: don.currency || 'INR',
        donation_date: don.donation_date ? don.donation_date.split('T')[0] : '',
        payment_method: don.payment_method || 'Bank Transfer',
        transaction_id: don.transaction_id || '',
        payment_status: don.payment_status || 'Pending',
        program_id: don.program_id || '',
        internal_notes: don.internal_notes || ''
      });
    }

    setIsModalOpen(true);
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    setFormError('');

    if (!formData.donor_name || !formData.amount || Number(formData.amount) <= 0) {
      setFormError('Donor Name and a valid Amount greater than 0 are required.');
      return;
    }

    try {
      setSaving(true);
      if (modalMode === 'create') {
        const res = await donationsApi.create(formData);
        showNotification(`Donation recorded! Receipt: ${res.receiptNumber || 'Pending verification'}`);
      } else if (modalMode === 'edit') {
        await donationsApi.update(selectedDonation.id, formData);
        showNotification(`Donation record updated.`);
      }
      setIsModalOpen(false);
      fetchDonations(pagination.page);
    } catch (err) {
      setFormError(err.message || 'Operation failed.');
    } finally {
      setSaving(false);
    }
  };

  const handleArchive = async (don) => {
    if (window.confirm(`Are you sure you want to archive donation ${don.donation_id} (₹${don.amount})?`)) {
      try {
        await donationsApi.delete(don.id);
        showNotification('Donation archived.');
        fetchDonations(pagination.page);
      } catch (err) {
        alert('Failed: ' + err.message);
      }
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      {notification && (
        <div style={{
          position: 'fixed',
          top: '20px',
          right: '20px',
          background: '#062817',
          color: '#ffffff',
          padding: '0.85rem 1.25rem',
          borderRadius: '12px',
          boxShadow: '0 10px 25px rgba(0,0,0,0.3)',
          borderLeft: '4px solid #eea328',
          zIndex: 9999,
          display: 'flex',
          alignItems: 'center',
          gap: '0.5rem',
          fontWeight: 600,
          fontSize: '0.9rem'
        }}>
          <CheckCircle size={18} style={{ color: '#eea328' }} />
          <span>{notification}</span>
        </div>
      )}

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
            Donations & Financial Records
          </h1>
          <p style={{ color: '#64748b', fontSize: '0.85rem', margin: '2px 0 0 0' }}>
            Auditable records of contributions, receipts and bank verification
          </p>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', flexWrap: 'wrap' }}>
          <button onClick={handleExportCsv} disabled={exporting} style={btnSecondaryStyle}>
            <Download size={16} />
            <span>{exporting ? 'Exporting...' : 'Export Financial CSV'}</span>
          </button>

          <button onClick={() => handleOpenModal('create')} style={btnPrimaryStyle}>
            <Plus size={16} />
            <span>Record Donation</span>
          </button>
        </div>
      </div>

      {/* Financial Summary KPI Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1rem' }}>
        <div style={kpiBoxStyle}>
          <span style={{ fontSize: '0.8rem', color: '#64748b', fontWeight: 600 }}>Total Verified Funds</span>
          <div style={{ fontSize: '1.65rem', fontWeight: 800, color: '#059669', marginTop: '0.25rem' }}>
            ₹{Number(summary.verifiedTotal || 0).toLocaleString('en-IN')}
          </div>
          <span style={{ fontSize: '0.75rem', color: '#059669', fontWeight: 600 }}>
            {summary.verifiedCount || 0} Successful Transactions
          </span>
        </div>

        <div style={kpiBoxStyle}>
          <span style={{ fontSize: '0.8rem', color: '#64748b', fontWeight: 600 }}>Pending Verification</span>
          <div style={{ fontSize: '1.65rem', fontWeight: 800, color: '#d97706', marginTop: '0.25rem' }}>
            ₹{Number(summary.pendingTotal || 0).toLocaleString('en-IN')}
          </div>
          <span style={{ fontSize: '0.75rem', color: '#d97706', fontWeight: 600 }}>
            {summary.pendingCount || 0} Pledges Awaiting Bank Credit
          </span>
        </div>

        <div style={kpiBoxStyle}>
          <span style={{ fontSize: '0.8rem', color: '#64748b', fontWeight: 600 }}>Total Records Filtered</span>
          <div style={{ fontSize: '1.65rem', fontWeight: 800, color: '#0f172a', marginTop: '0.25rem' }}>
            {summary.totalCount || 0}
          </div>
          <span style={{ fontSize: '0.75rem', color: '#64748b' }}>
            All payment methods
          </span>
        </div>
      </div>

      {/* Toolbar & Filters */}
      <div style={{
        background: '#ffffff',
        borderRadius: '14px',
        padding: '1rem',
        border: '1px solid #e2e8f0',
        display: 'flex',
        alignItems: 'center',
        gap: '0.75rem',
        flexWrap: 'wrap'
      }}>
        <div style={{ flex: 1, minWidth: '220px', position: 'relative' }}>
          <Search size={17} style={{ position: 'absolute', left: '0.9rem', top: '50%', transform: 'translateY(-50%)', color: '#94a3b8' }} />
          <input
            type="text"
            placeholder="Search by donor, transaction ID, receipt, or ID..."
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
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          style={{ padding: '0.65rem 0.85rem', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '0.875rem', background: '#ffffff', outline: 'none' }}
        >
          <option value="all">All Payment Statuses</option>
          <option value="Successful">Successful</option>
          <option value="Pending">Pending Verification</option>
          <option value="Failed">Failed</option>
          <option value="Refunded">Refunded</option>
        </select>

        <select
          value={methodFilter}
          onChange={(e) => setMethodFilter(e.target.value)}
          style={{ padding: '0.65rem 0.85rem', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '0.875rem', background: '#ffffff', outline: 'none' }}
        >
          <option value="all">All Payment Methods</option>
          <option value="Bank Transfer">Bank Transfer (NEFT/RTGS)</option>
          <option value="UPI">UPI</option>
          <option value="Cheque">Cheque</option>
          <option value="Cash">Cash</option>
        </select>

        <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', fontSize: '0.8rem', color: '#64748b' }}>
          <span>From:</span>
          <input
            type="date"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
            style={{ padding: '0.55rem', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '0.8rem' }}
          />
          <span>To:</span>
          <input
            type="date"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
            style={{ padding: '0.55rem', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '0.8rem' }}
          />
        </div>

        <button onClick={() => fetchDonations(pagination.page)} style={{ ...btnSecondaryStyle, padding: '0.65rem 0.85rem' }} title="Refresh">
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
            <p>Loading donations from MySQL...</p>
          </div>
        ) : donations.length === 0 ? (
          <div style={{ padding: '4rem 1rem', textAlign: 'center', color: '#64748b' }}>
            <HeartHandshake size={40} style={{ color: '#cbd5e1', margin: '0 auto 0.75rem auto' }} />
            <h3 style={{ fontSize: '1.1rem', fontWeight: 600, color: '#334155' }}>No donations match the current filter</h3>
          </div>
        ) : (
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.875rem' }}>
              <thead>
                <tr style={{ background: '#f8fafc', borderBottom: '1px solid #e2e8f0', color: '#475569' }}>
                  <th style={{ padding: '0.85rem 1rem', fontWeight: 600 }}>Donation ID</th>
                  <th style={{ padding: '0.85rem 1rem', fontWeight: 600 }}>Donor Name</th>
                  <th style={{ padding: '0.85rem 1rem', fontWeight: 600 }}>Amount</th>
                  <th style={{ padding: '0.85rem 1rem', fontWeight: 600 }}>Date</th>
                  <th style={{ padding: '0.85rem 1rem', fontWeight: 600 }}>Payment Method</th>
                  <th style={{ padding: '0.85rem 1rem', fontWeight: 600 }}>Status</th>
                  <th style={{ padding: '0.85rem 1rem', fontWeight: 600 }}>Receipt No</th>
                  <th style={{ padding: '0.85rem 1rem', fontWeight: 600, textAlign: 'right' }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {donations.map(don => (
                  <tr key={don.id} style={{ borderBottom: '1px solid #f1f5f9' }} className="table-row-hover">
                    <td style={{ padding: '0.85rem 1rem', fontWeight: 700, color: '#0b4b25' }}>
                      {don.donation_id}
                    </td>
                    <td style={{ padding: '0.85rem 1rem' }}>
                      <div style={{ fontWeight: 600, color: '#0f172a' }}>{don.donor_name}</div>
                      {don.donor_email && <div style={{ fontSize: '0.75rem', color: '#64748b' }}>{don.donor_email}</div>}
                    </td>
                    <td style={{ padding: '0.85rem 1rem', fontWeight: 700, color: don.payment_status === 'Successful' ? '#059669' : '#0f172a' }}>
                      ₹{Number(don.amount).toLocaleString('en-IN')}
                    </td>
                    <td style={{ padding: '0.85rem 1rem', color: '#64748b', fontSize: '0.8rem' }}>
                      {don.donation_date ? new Date(don.donation_date).toLocaleDateString('en-IN') : '—'}
                    </td>
                    <td style={{ padding: '0.85rem 1rem' }}>
                      <div style={{ fontWeight: 500, color: '#334155' }}>{don.payment_method}</div>
                      {don.transaction_id && (
                        <div style={{ fontSize: '0.725rem', color: '#64748b', fontFamily: 'monospace' }}>
                          Ref: {don.transaction_id}
                        </div>
                      )}
                    </td>
                    <td style={{ padding: '0.85rem 1rem' }}>
                      <span style={getPaymentBadge(don.payment_status)}>
                        {don.payment_status}
                      </span>
                    </td>
                    <td style={{ padding: '0.85rem 1rem', fontSize: '0.8rem', fontFamily: 'monospace' }}>
                      {don.receipt_number || <span style={{ color: '#94a3b8' }}>Pending</span>}
                    </td>
                    <td style={{ padding: '0.85rem 1rem', textAlign: 'right' }}>
                      <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.35rem' }}>
                        <button
                          onClick={() => handleOpenModal('receipt', don)}
                          style={{ ...iconBtnStyle, color: '#0b4b25', background: '#e2efe8' }}
                          title="View Official Receipt"
                        >
                          <Receipt size={14} />
                        </button>
                        <button
                          onClick={() => handleOpenModal('edit', don)}
                          style={{ ...iconBtnStyle, color: '#d97706', background: '#fef3c7' }}
                          title="Edit"
                        >
                          <Edit size={14} />
                        </button>
                        <button
                          onClick={() => handleArchive(don)}
                          style={{ ...iconBtnStyle, color: '#dc2626', background: '#fee2e2' }}
                          title="Archive"
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>
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
              Showing {donations.length} of {pagination.total} records
            </div>
            <div style={{ display: 'flex', gap: '0.35rem' }}>
              <button
                disabled={pagination.page <= 1}
                onClick={() => fetchDonations(pagination.page - 1)}
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
                onClick={() => fetchDonations(pagination.page + 1)}
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

      {/* Modal: Record / Edit / Receipt */}
      {isModalOpen && (
        <div style={{
          position: 'fixed',
          inset: 0,
          background: 'rgba(0,0,0,0.5)',
          zIndex: 1000,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '1.5rem',
          backdropFilter: 'blur(3px)'
        }}>
          <div style={{
            background: '#ffffff',
            borderRadius: '20px',
            width: '100%',
            maxWidth: modalMode === 'receipt' ? '540px' : '620px',
            maxHeight: '90vh',
            overflowY: 'auto',
            padding: '2rem',
            boxShadow: '0 25px 60px rgba(0,0,0,0.3)',
            position: 'relative'
          }}>
            <button
              onClick={() => setIsModalOpen(false)}
              style={{
                position: 'absolute',
                top: '1.25rem',
                right: '1.25rem',
                background: 'transparent',
                border: 'none',
                cursor: 'pointer',
                color: '#94a3b8'
              }}
            >
              <X size={22} />
            </button>

            {modalMode === 'receipt' ? (
              <div>
                <div style={{
                  border: '2px solid #062817',
                  borderRadius: '16px',
                  padding: '1.5rem',
                  background: '#fdfbf7'
                }}>
                  {/* Receipt Header */}
                  <div style={{ textAlign: 'center', borderBottom: '2px dashed #cbd5e1', paddingBottom: '1rem', marginBottom: '1rem' }}>
                    <h3 style={{ margin: 0, fontSize: '1.25rem', fontWeight: 800, color: '#062817' }}>
                      TOGU FOUNDATION
                    </h3>
                    <p style={{ margin: '2px 0 0 0', fontSize: '0.75rem', color: '#64748b' }}>
                      Together for Good • United for Change
                    </p>
                    <div style={{
                      display: 'inline-block',
                      background: '#062817',
                      color: '#eea328',
                      padding: '2px 10px',
                      borderRadius: '4px',
                      fontSize: '0.75rem',
                      fontWeight: 700,
                      marginTop: '0.5rem'
                    }}>
                      DONATION RECEIPT
                    </div>
                  </div>

                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem', color: '#64748b', marginBottom: '1rem' }}>
                    <span>Receipt No: <strong>{selectedDonation?.receipt_number || 'PENDING'}</strong></span>
                    <span>Date: <strong>{new Date(selectedDonation?.donation_date).toLocaleDateString('en-IN')}</strong></span>
                  </div>

                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.65rem', fontSize: '0.875rem' }}>
                    <div>
                      <span style={{ color: '#64748b', fontSize: '0.75rem' }}>Received with thanks from:</span>
                      <div style={{ fontWeight: 700, fontSize: '1.05rem', color: '#0f172a' }}>{selectedDonation?.donor_name}</div>
                    </div>

                    <div style={{
                      background: '#e2efe8',
                      padding: '0.75rem 1rem',
                      borderRadius: '10px',
                      display: 'flex',
                      alignItems: 'baseline',
                      justifyContent: 'space-between'
                    }}>
                      <span style={{ fontWeight: 600, color: '#062817' }}>Amount Contributed:</span>
                      <span style={{ fontSize: '1.4rem', fontWeight: 800, color: '#0b4b25' }}>
                        ₹{Number(selectedDonation?.amount).toLocaleString('en-IN')}
                      </span>
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.5rem', fontSize: '0.8rem', color: '#475569', marginTop: '0.25rem' }}>
                      <div>Payment Mode: <strong>{selectedDonation?.payment_method}</strong></div>
                      <div>Ref / TXN ID: <strong>{selectedDonation?.transaction_id || 'N/A'}</strong></div>
                      <div>Program: <strong>{selectedDonation?.program_title || 'General Fund'}</strong></div>
                      <div>Status: <strong>{selectedDonation?.payment_status}</strong></div>
                    </div>

                    {selectedDonation?.internal_notes && (
                      <p style={{ fontSize: '0.75rem', color: '#64748b', margin: '0.5rem 0 0 0' }}>
                        Note: {selectedDonation.internal_notes}
                      </p>
                    )}
                  </div>

                  <div style={{
                    marginTop: '1.5rem',
                    paddingTop: '1rem',
                    borderTop: '1px solid #e2e8f0',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'flex-end',
                    fontSize: '0.75rem',
                    color: '#64748b'
                  }}>
                    <div>
                      <span>Authorized Signatory</span>
                      <div style={{ fontWeight: 700, color: '#062817', marginTop: '2px' }}>TOGU Foundation Trust</div>
                    </div>
                    <button
                      onClick={() => window.print()}
                      style={{
                        padding: '0.4rem 0.85rem',
                        borderRadius: '6px',
                        border: '1px solid #cbd5e1',
                        background: '#ffffff',
                        cursor: 'pointer',
                        fontWeight: 600
                      }}
                    >
                      Print Receipt
                    </button>
                  </div>
                </div>
              </div>
            ) : (
              <div>
                <h2 style={{ fontSize: '1.35rem', fontWeight: 800, color: '#0f172a', marginBottom: '0.25rem' }}>
                  {modalMode === 'create' ? 'Record Verified Donation' : `Edit Donation: ${selectedDonation?.donation_id}`}
                </h2>
                <p style={{ color: '#64748b', fontSize: '0.85rem', marginBottom: '1.5rem' }}>
                  Record direct bank transfers, UPI transactions, cheques or cash gifts
                </p>

                {formError && (
                  <div style={{ background: '#fee2e2', border: '1px solid #ef4444', color: '#991b1b', padding: '0.75rem', borderRadius: '8px', fontSize: '0.85rem', marginBottom: '1.25rem' }}>
                    {formError}
                  </div>
                )}

                <form onSubmit={handleFormSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                    <div>
                      <label style={labelStyle}>Donor Full Name *</label>
                      <input
                        type="text"
                        required
                        value={formData.donor_name}
                        onChange={(e) => setFormData({ ...formData, donor_name: e.target.value })}
                        style={inputStyle}
                        placeholder="e.g. Sunil Narang"
                      />
                    </div>
                    <div>
                      <label style={labelStyle}>Amount (INR) *</label>
                      <input
                        type="number"
                        min="1"
                        step="0.01"
                        required
                        value={formData.amount}
                        onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
                        style={inputStyle}
                        placeholder="5000"
                      />
                    </div>
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                    <div>
                      <label style={labelStyle}>Donor Email</label>
                      <input
                        type="email"
                        value={formData.donor_email}
                        onChange={(e) => setFormData({ ...formData, donor_email: e.target.value })}
                        style={inputStyle}
                        placeholder="donor@example.com"
                      />
                    </div>
                    <div>
                      <label style={labelStyle}>Donor Phone</label>
                      <input
                        type="tel"
                        value={formData.donor_phone}
                        onChange={(e) => setFormData({ ...formData, donor_phone: e.target.value })}
                        style={inputStyle}
                        placeholder="+91 98765 00000"
                      />
                    </div>
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                    <div>
                      <label style={labelStyle}>Donation Date</label>
                      <input
                        type="date"
                        value={formData.donation_date}
                        onChange={(e) => setFormData({ ...formData, donation_date: e.target.value })}
                        style={inputStyle}
                      />
                    </div>
                    <div>
                      <label style={labelStyle}>Payment Method</label>
                      <select
                        value={formData.payment_method}
                        onChange={(e) => setFormData({ ...formData, payment_method: e.target.value })}
                        style={inputStyle}
                      >
                        <option value="Bank Transfer">Bank Transfer (NEFT/RTGS)</option>
                        <option value="UPI">UPI (Google Pay / PhonePe / Paytm)</option>
                        <option value="Cheque">Cheque / Demand Draft</option>
                        <option value="Cash">Cash</option>
                      </select>
                    </div>
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                    <div>
                      <label style={labelStyle}>Transaction / Reference ID</label>
                      <input
                        type="text"
                        value={formData.transaction_id}
                        onChange={(e) => setFormData({ ...formData, transaction_id: e.target.value })}
                        style={inputStyle}
                        placeholder="e.g. UTR / UPI Ref / Cheque No"
                      />
                    </div>
                    <div>
                      <label style={labelStyle}>Payment Status *</label>
                      <select
                        value={formData.payment_status}
                        onChange={(e) => setFormData({ ...formData, payment_status: e.target.value })}
                        style={inputStyle}
                      >
                        <option value="Successful">Successful (Credit Verified)</option>
                        <option value="Pending">Pending Verification</option>
                        <option value="Failed">Failed</option>
                        <option value="Refunded">Refunded</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label style={labelStyle}>Allocated Program / Fund</label>
                    <select
                      value={formData.program_id}
                      onChange={(e) => setFormData({ ...formData, program_id: e.target.value })}
                      style={inputStyle}
                    >
                      <option value="">General Foundation Fund</option>
                      {programs.map(p => (
                        <option key={p.id} value={p.id}>{p.title}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label style={labelStyle}>Internal Notes</label>
                    <textarea
                      rows={2}
                      value={formData.internal_notes}
                      onChange={(e) => setFormData({ ...formData, internal_notes: e.target.value })}
                      style={inputStyle}
                      placeholder="Bank branch, confirmation remarks or purpose"
                    />
                  </div>

                  <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', marginTop: '1rem' }}>
                    <button type="button" onClick={() => setIsModalOpen(false)} style={btnSecondaryStyle}>
                      Cancel
                    </button>
                    <button type="submit" disabled={saving} style={btnPrimaryStyle}>
                      {saving ? 'Saving...' : modalMode === 'create' ? 'Record Donation' : 'Save Changes'}
                    </button>
                  </div>
                </form>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

const btnPrimaryStyle = {
  display: 'inline-flex',
  alignItems: 'center',
  gap: '0.45rem',
  padding: '0.65rem 1.25rem',
  borderRadius: '10px',
  border: 'none',
  background: '#062817',
  color: '#ffffff',
  fontSize: '0.85rem',
  fontWeight: 600,
  cursor: 'pointer'
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

const iconBtnStyle = {
  width: '32px',
  height: '32px',
  borderRadius: '6px',
  border: 'none',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  cursor: 'pointer'
};

const kpiBoxStyle = {
  background: '#ffffff',
  borderRadius: '14px',
  padding: '1.25rem',
  border: '1px solid #e2e8f0',
  boxShadow: '0 2px 8px rgba(0,0,0,0.03)'
};

const labelStyle = {
  display: 'block',
  fontSize: '0.8rem',
  fontWeight: 600,
  color: '#334155',
  marginBottom: '0.35rem'
};

const inputStyle = {
  width: '100%',
  padding: '0.65rem 0.85rem',
  borderRadius: '8px',
  border: '1px solid #cbd5e1',
  fontSize: '0.875rem',
  outline: 'none',
  background: '#ffffff'
};

function getPaymentBadge(status) {
  const base = { padding: '3px 8px', borderRadius: '12px', fontSize: '0.725rem', fontWeight: 700 };
  switch (status) {
    case 'Successful':
      return { ...base, background: '#dcfce7', color: '#15803d' };
    case 'Pending':
      return { ...base, background: '#fef3c7', color: '#b45309' };
    case 'Failed':
      return { ...base, background: '#fee2e2', color: '#b91c1c' };
    case 'Refunded':
      return { ...base, background: '#f1f5f9', color: '#64748b' };
    default:
      return { ...base, background: '#f1f5f9', color: '#64748b' };
  }
}

export default Donations;
