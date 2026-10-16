import React, { useState, useEffect } from 'react';
import { expensesApi, programsApi, uploadApi } from '../services/api';
import {
  ReceiptText,
  Search,
  Filter,
  Plus,
  Download,
  Edit,
  Trash2,
  Upload,
  RefreshCw,
  X,
  FileText,
  CheckCircle,
  AlertCircle
} from 'lucide-react';

const Expenses = () => {
  const [expenses, setExpenses] = useState([]);
  const [summary, setSummary] = useState({});
  const [programs, setPrograms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [pagination, setPagination] = useState({ page: 1, limit: 15, total: 0, totalPages: 1 });
  const [exporting, setExporting] = useState(false);

  // Modal
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedExpense, setSelectedExpense] = useState(null);
  const [formData, setFormData] = useState({
    title: '',
    category: 'Medical Camps',
    amount: '',
    expense_date: new Date().toISOString().split('T')[0],
    payment_method: 'Bank Transfer',
    vendor_recipient: '',
    program_id: '',
    description: '',
    receipt_file: ''
  });
  const [formError, setFormError] = useState('');
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [notification, setNotification] = useState('');

  const showNotification = (msg) => {
    setNotification(msg);
    setTimeout(() => setNotification(''), 4000);
  };

  const fetchExpenses = async (page = 1) => {
    try {
      setLoading(true);
      const res = await expensesApi.getAll({
        search,
        category: categoryFilter,
        startDate,
        endDate,
        page,
        limit: pagination.limit
      });
      if (res.success) {
        setExpenses(res.expenses || []);
        setSummary(res.summary || {});
        setPagination(res.pagination);
      }
    } catch (err) {
      console.error('Fetch expenses error:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      fetchExpenses(1);
    }, 250);
    return () => clearTimeout(timer);
  }, [search, categoryFilter, startDate, endDate]);

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
      await expensesApi.exportCsv({
        search,
        category: categoryFilter,
        startDate,
        endDate
      });
      showNotification('Expense report exported to CSV successfully.');
    } catch (err) {
      alert('Export failed: ' + err.message);
    } finally {
      setExporting(false);
    }
  };

  const handleOpenModal = (exp = null) => {
    setSelectedExpense(exp);
    setFormError('');

    if (!exp) {
      setFormData({
        title: '',
        category: 'Medical Camps',
        amount: '',
        expense_date: new Date().toISOString().split('T')[0],
        payment_method: 'Bank Transfer',
        vendor_recipient: '',
        program_id: programs.length > 0 ? programs[0].id : '',
        description: '',
        receipt_file: ''
      });
    } else {
      setFormData({
        title: exp.title || '',
        category: exp.category || 'Medical Camps',
        amount: exp.amount || '',
        expense_date: exp.expense_date ? exp.expense_date.split('T')[0] : '',
        payment_method: exp.payment_method || 'Bank Transfer',
        vendor_recipient: exp.vendor_recipient || '',
        program_id: exp.program_id || '',
        description: exp.description || '',
        receipt_file: exp.receipt_file || ''
      });
    }

    setIsModalOpen(true);
  };

  const handleReceiptUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    try {
      setUploading(true);
      const res = await uploadApi.uploadFile(file);
      if (res.success) {
        setFormData(prev => ({ ...prev, receipt_file: res.fileUrl }));
        showNotification('Receipt voucher uploaded.');
      }
    } catch (err) {
      alert('Upload failed: ' + err.message);
    } finally {
      setUploading(false);
    }
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    setFormError('');

    if (!formData.title || !formData.amount || Number(formData.amount) <= 0 || !formData.vendor_recipient) {
      setFormError('Title, Amount and Vendor/Recipient are required.');
      return;
    }

    try {
      setSaving(true);
      if (!selectedExpense) {
        const res = await expensesApi.create(formData);
        showNotification(`Expense voucher ${res.expenseId} created.`);
      } else {
        await expensesApi.update(selectedExpense.id, formData);
        showNotification(`Expense voucher updated.`);
      }
      setIsModalOpen(false);
      fetchExpenses(pagination.page);
    } catch (err) {
      setFormError(err.message || 'Operation failed.');
    } finally {
      setSaving(false);
    }
  };

  const handleArchive = async (exp) => {
    if (window.confirm(`Are you sure you want to archive expense ${exp.expense_id} (₹${exp.amount})?`)) {
      try {
        await expensesApi.delete(exp.id);
        showNotification('Expense voucher archived.');
        fetchExpenses(pagination.page);
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
            Expense & Disbursement Management
          </h1>
          <p style={{ color: '#64748b', fontSize: '0.85rem', margin: '2px 0 0 0' }}>
            Track and verify foundation disbursements, medicine purchases and operations
          </p>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', flexWrap: 'wrap' }}>
          <button onClick={handleExportCsv} disabled={exporting} style={btnSecondaryStyle}>
            <Download size={16} />
            <span>{exporting ? 'Exporting...' : 'Export Expenses CSV'}</span>
          </button>

          <button onClick={() => handleOpenModal(null)} style={btnPrimaryStyle}>
            <Plus size={16} />
            <span>Record Expense</span>
          </button>
        </div>
      </div>

      {/* KPI Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1rem' }}>
        <div style={kpiBoxStyle}>
          <span style={{ fontSize: '0.8rem', color: '#64748b', fontWeight: 600 }}>Total Disbursements</span>
          <div style={{ fontSize: '1.65rem', fontWeight: 800, color: '#dc2626', marginTop: '0.25rem' }}>
            ₹{Number(summary.totalAmount || 0).toLocaleString('en-IN')}
          </div>
          <span style={{ fontSize: '0.75rem', color: '#64748b' }}>
            {summary.totalCount || 0} vouchers in view
          </span>
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
        gap: '0.75rem',
        flexWrap: 'wrap'
      }}>
        <div style={{ flex: 1, minWidth: '220px', position: 'relative' }}>
          <Search size={17} style={{ position: 'absolute', left: '0.9rem', top: '50%', transform: 'translateY(-50%)', color: '#94a3b8' }} />
          <input
            type="text"
            placeholder="Search by title, vendor, category or ID..."
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
          value={categoryFilter}
          onChange={(e) => setCategoryFilter(e.target.value)}
          style={{ padding: '0.65rem 0.85rem', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '0.875rem', background: '#ffffff', outline: 'none' }}
        >
          <option value="all">All Categories</option>
          <option value="Medical Camps">Medical Camps</option>
          <option value="Education Supplies">Education Supplies</option>
          <option value="Food Distribution">Food Distribution</option>
          <option value="Office Rent">Office Rent</option>
          <option value="Travel & Logistics">Travel & Logistics</option>
          <option value="Utilities">Utilities</option>
          <option value="Other">Other</option>
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

        <button onClick={() => fetchExpenses(pagination.page)} style={{ ...btnSecondaryStyle, padding: '0.65rem 0.85rem' }} title="Refresh">
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
            <p>Loading expenses from MySQL...</p>
          </div>
        ) : expenses.length === 0 ? (
          <div style={{ padding: '4rem 1rem', textAlign: 'center', color: '#64748b' }}>
            <ReceiptText size={40} style={{ color: '#cbd5e1', margin: '0 auto 0.75rem auto' }} />
            <h3 style={{ fontSize: '1.1rem', fontWeight: 600, color: '#334155' }}>No expense records found</h3>
          </div>
        ) : (
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.875rem' }}>
              <thead>
                <tr style={{ background: '#f8fafc', borderBottom: '1px solid #e2e8f0', color: '#475569' }}>
                  <th style={{ padding: '0.85rem 1rem', fontWeight: 600 }}>Expense ID</th>
                  <th style={{ padding: '0.85rem 1rem', fontWeight: 600 }}>Title & Description</th>
                  <th style={{ padding: '0.85rem 1rem', fontWeight: 600 }}>Category</th>
                  <th style={{ padding: '0.85rem 1rem', fontWeight: 600 }}>Amount</th>
                  <th style={{ padding: '0.85rem 1rem', fontWeight: 600 }}>Date</th>
                  <th style={{ padding: '0.85rem 1rem', fontWeight: 600 }}>Vendor / Payee</th>
                  <th style={{ padding: '0.85rem 1rem', fontWeight: 600 }}>Receipt</th>
                  <th style={{ padding: '0.85rem 1rem', fontWeight: 600, textAlign: 'right' }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {expenses.map(exp => (
                  <tr key={exp.id} style={{ borderBottom: '1px solid #f1f5f9' }} className="table-row-hover">
                    <td style={{ padding: '0.85rem 1rem', fontWeight: 700, color: '#0b4b25' }}>
                      {exp.expense_id}
                    </td>
                    <td style={{ padding: '0.85rem 1rem', maxWidth: '240px' }}>
                      <div style={{ fontWeight: 600, color: '#0f172a' }}>{exp.title}</div>
                      {exp.description && (
                        <div style={{ fontSize: '0.75rem', color: '#64748b', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                          {exp.description}
                        </div>
                      )}
                    </td>
                    <td style={{ padding: '0.85rem 1rem' }}>
                      <span style={{
                        background: '#f1f5f9',
                        color: '#334155',
                        padding: '3px 8px',
                        borderRadius: '6px',
                        fontSize: '0.75rem',
                        fontWeight: 600
                      }}>
                        {exp.category}
                      </span>
                    </td>
                    <td style={{ padding: '0.85rem 1rem', fontWeight: 700, color: '#dc2626' }}>
                      ₹{Number(exp.amount).toLocaleString('en-IN')}
                    </td>
                    <td style={{ padding: '0.85rem 1rem', color: '#64748b', fontSize: '0.8rem' }}>
                      {exp.expense_date ? new Date(exp.expense_date).toLocaleDateString('en-IN') : '—'}
                    </td>
                    <td style={{ padding: '0.85rem 1rem', color: '#334155' }}>
                      {exp.vendor_recipient}
                    </td>
                    <td style={{ padding: '0.85rem 1rem' }}>
                      {exp.receipt_file ? (
                        <a
                          href={exp.receipt_file}
                          target="_blank"
                          rel="noopener noreferrer"
                          style={{
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: '0.25rem',
                            color: '#0b4b25',
                            fontSize: '0.75rem',
                            fontWeight: 600,
                            textDecoration: 'none'
                          }}
                        >
                          <FileText size={14} /> View
                        </a>
                      ) : (
                        <span style={{ color: '#94a3b8', fontSize: '0.75rem' }}>No file</span>
                      )}
                    </td>
                    <td style={{ padding: '0.85rem 1rem', textAlign: 'right' }}>
                      <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.35rem' }}>
                        <button
                          onClick={() => handleOpenModal(exp)}
                          style={{ ...iconBtnStyle, color: '#d97706', background: '#fef3c7' }}
                          title="Edit"
                        >
                          <Edit size={14} />
                        </button>
                        <button
                          onClick={() => handleArchive(exp)}
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
              Showing {expenses.length} of {pagination.total} records
            </div>
            <div style={{ display: 'flex', gap: '0.35rem' }}>
              <button
                disabled={pagination.page <= 1}
                onClick={() => fetchExpenses(pagination.page - 1)}
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
                onClick={() => fetchExpenses(pagination.page + 1)}
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

      {/* Modal: Record / Edit Expense */}
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
            maxWidth: '620px',
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

            <h2 style={{ fontSize: '1.35rem', fontWeight: 800, color: '#0f172a', marginBottom: '0.25rem' }}>
              {selectedExpense ? `Edit Expense: ${selectedExpense.expense_id}` : 'Record New Expense Voucher'}
            </h2>
            <p style={{ color: '#64748b', fontSize: '0.85rem', marginBottom: '1.5rem' }}>
              Disbursement documentation with receipts
            </p>

            {formError && (
              <div style={{ background: '#fee2e2', border: '1px solid #ef4444', color: '#991b1b', padding: '0.75rem', borderRadius: '8px', fontSize: '0.85rem', marginBottom: '1.25rem' }}>
                {formError}
              </div>
            )}

            <form onSubmit={handleFormSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div>
                <label style={labelStyle}>Expense Title / Purpose *</label>
                <input
                  type="text"
                  required
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  style={inputStyle}
                  placeholder="e.g. Purchase of Medical Antibiotics for Medak Camp"
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <div>
                  <label style={labelStyle}>Category *</label>
                  <select
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    style={inputStyle}
                  >
                    <option value="Medical Camps">Medical Camps</option>
                    <option value="Education Supplies">Education Supplies</option>
                    <option value="Food Distribution">Food Distribution</option>
                    <option value="Office Rent">Office Rent</option>
                    <option value="Travel & Logistics">Travel & Logistics</option>
                    <option value="Utilities">Utilities</option>
                    <option value="Other">Other</option>
                  </select>
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
                    placeholder="45000"
                  />
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <div>
                  <label style={labelStyle}>Expense Date *</label>
                  <input
                    type="date"
                    required
                    value={formData.expense_date}
                    onChange={(e) => setFormData({ ...formData, expense_date: e.target.value })}
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
                    <option value="UPI">UPI</option>
                    <option value="Cheque">Cheque</option>
                    <option value="Cash">Cash</option>
                  </select>
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <div>
                  <label style={labelStyle}>Vendor / Recipient *</label>
                  <input
                    type="text"
                    required
                    value={formData.vendor_recipient}
                    onChange={(e) => setFormData({ ...formData, vendor_recipient: e.target.value })}
                    style={inputStyle}
                    placeholder="e.g. MedPlus Wholesale Distributors"
                  />
                </div>
                <div>
                  <label style={labelStyle}>Related NGO Program</label>
                  <select
                    value={formData.program_id}
                    onChange={(e) => setFormData({ ...formData, program_id: e.target.value })}
                    style={inputStyle}
                  >
                    <option value="">General Foundation Operations</option>
                    {programs.map(p => (
                      <option key={p.id} value={p.id}>{p.title}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label style={labelStyle}>Description / Items List</label>
                <textarea
                  rows={2}
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  style={inputStyle}
                  placeholder="Details of goods, medicine batch numbers or service delivered..."
                />
              </div>

              <div>
                <label style={labelStyle}>Receipt / Invoice File</label>
                <div style={{ display: 'flex', gap: '0.5rem' }}>
                  <input
                    type="text"
                    value={formData.receipt_file}
                    onChange={(e) => setFormData({ ...formData, receipt_file: e.target.value })}
                    style={{ ...inputStyle, flex: 1 }}
                    placeholder="/uploads/receipt_xyz.pdf or url"
                  />
                  <label style={{ ...btnSecondaryStyle, padding: '0.65rem 1rem', cursor: uploading ? 'not-allowed' : 'pointer' }}>
                    <Upload size={14} />
                    <span>{uploading ? 'Uploading...' : 'Upload'}</span>
                    <input
                      type="file"
                      accept="image/*,application/pdf"
                      style={{ display: 'none' }}
                      onChange={handleReceiptUpload}
                      disabled={uploading}
                    />
                  </label>
                </div>
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', marginTop: '1rem' }}>
                <button type="button" onClick={() => setIsModalOpen(false)} style={btnSecondaryStyle}>
                  Cancel
                </button>
                <button type="submit" disabled={saving} style={btnPrimaryStyle}>
                  {saving ? 'Saving...' : selectedExpense ? 'Save Changes' : 'Record Expense'}
                </button>
              </div>
            </form>
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

export default Expenses;
