import React, { useState, useMemo, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  LayoutDashboard, Users, HeartPulse, MessageSquare, IndianRupee,
  Bell, Search, Menu, X, LogOut, Eye, Trash2, CheckCircle2,
  TrendingUp, TrendingDown, ArrowUpRight, Calendar, FileText,
  ClipboardList, Settings, BarChart3, Activity, Package,
  ChevronLeft, ChevronRight, Filter, Download, MoreHorizontal,
  Clock, Mail, Phone, MapPin, UserCheck, AlertCircle, Home
} from 'lucide-react';
import './AdminPanel.css';

// ========== MOCK DATA ==========

const MOCK_INQUIRIES = [
  { id: 'INQ-001', firstName: 'Rahul', lastName: 'Sharma', email: 'rahul.sharma@gmail.com', phone: '+91 98765 43210', role: 'Volunteer', city: 'Hyderabad', message: 'I want to contribute to education programs in rural areas.', date: '2026-10-14', status: 'new', priority: 'high' },
  { id: 'INQ-002', firstName: 'Priya', lastName: 'Reddy', email: 'priya.reddy@yahoo.com', phone: '+91 87654 32109', role: 'Intern', city: 'Bangalore', message: 'Interested in the healthcare initiative internship.', date: '2026-10-13', status: 'in-progress', priority: 'medium' },
  { id: 'INQ-003', firstName: 'Arjun', lastName: 'Patel', email: 'arjun.p@outlook.com', phone: '+91 76543 21098', role: 'Partner', city: 'Mumbai', message: 'Our NGO wants to partner for women empowerment camps.', date: '2026-10-12', status: 'completed', priority: 'high' },
  { id: 'INQ-004', firstName: 'Sneha', lastName: 'Gupta', email: 'sneha.g@gmail.com', phone: '+91 65432 10987', role: 'Volunteer', city: 'Delhi', message: 'Looking to volunteer during weekends for elder care.', date: '2026-10-11', status: 'new', priority: 'low' },
  { id: 'INQ-005', firstName: 'Mohammed', lastName: 'Khan', email: 'mkhan@hotmail.com', phone: '+91 54321 09876', role: 'Donor', city: 'Chennai', message: 'Want to support the healthcare program regularly.', date: '2026-10-10', status: 'in-progress', priority: 'medium' },
];

const MOCK_BOOKINGS = [
  { id: 'BK-001', patientName: 'Lakshmi Devi', phone: '+91 91234 56789', package: 'Golden Profile – 1', amount: '₹2,500', date: '2026-10-14', collection: 'Home', area: 'Jubilee Hills', status: 'pending', prescription: true },
  { id: 'BK-002', patientName: 'Ramesh Kumar', phone: '+91 82345 67890', package: 'Golden Profile – 2', amount: '₹3,500', date: '2026-10-13', collection: 'Lab Visit', area: 'Banjara Hills', status: 'completed', prescription: false },
  { id: 'BK-003', patientName: 'Fatima Begum', phone: '+91 73456 78901', package: 'Golden Profile – 1', amount: '₹2,500', date: '2026-10-12', collection: 'Home', area: 'Tolichowki', status: 'in-progress', prescription: true },
  { id: 'BK-004', patientName: 'Suresh Babu', phone: '+91 64567 89012', package: 'Golden Profile – 3', amount: '₹4,200', date: '2026-10-11', collection: 'Lab Visit', area: 'Secunderabad', status: 'cancelled', prescription: false },
  { id: 'BK-005', patientName: 'Anita Rao', phone: '+91 55678 90123', package: 'Golden Profile – 1', amount: '₹2,500', date: '2026-10-10', collection: 'Home', area: 'Madhapur', status: 'completed', prescription: true },
];

const MOCK_DONATIONS = [
  { id: 'DN-001', name: 'Vikram Singh', email: 'vikram.s@gmail.com', phone: '+91 99887 76655', amount: '₹5,000', pan: 'ABCDE1234F', date: '2026-10-14', status: 'completed', method: 'UPI' },
  { id: 'DN-002', name: 'Kavitha Nair', email: 'kavitha.n@yahoo.com', phone: '+91 88776 65544', amount: '₹2,500', pan: 'FGHIJ5678K', date: '2026-10-13', status: 'completed', method: 'Card' },
  { id: 'DN-003', name: 'Deepak Joshi', email: 'deepak.j@outlook.com', phone: '+91 77665 54433', amount: '₹10,000', pan: 'LMNOP9012Q', date: '2026-10-12', status: 'pending', method: 'Bank Transfer' },
  { id: 'DN-004', name: 'Sunita Sharma', email: 'sunita.s@gmail.com', phone: '+91 66554 43322', amount: '₹1,000', pan: '—', date: '2026-10-11', status: 'completed', method: 'UPI' },
  { id: 'DN-005', name: 'Rajesh Mehta', email: 'rajesh.m@corp.com', phone: '+91 55443 32211', amount: '₹25,000', pan: 'RSTUV3456W', date: '2026-10-10', status: 'completed', method: 'Bank Transfer' },
];

const MOCK_CONTACTS = [
  { id: 'CT-001', name: 'Amrit Kaur', email: 'amrit.k@gmail.com', subject: 'Partnership Inquiry', message: 'We are a corporate wanting to sponsor rural health camps.', date: '2026-10-14', status: 'new' },
  { id: 'CT-002', name: 'Harish Yadav', email: 'harish.y@yahoo.com', subject: 'Volunteer Feedback', message: 'Great experience volunteering last weekend. Thanks!', date: '2026-10-13', status: 'completed' },
  { id: 'CT-003', name: 'Meena Kumari', email: 'meena.k@outlook.com', subject: 'Donation Receipt', message: 'I donated last month but havent received the 80G receipt.', date: '2026-10-12', status: 'in-progress' },
  { id: 'CT-004', name: 'Sanjay Gupta', email: 'sanjay.g@gmail.com', subject: 'Healthcare Camp Location', message: 'Can you organize a health camp in our colony in Karimnagar?', date: '2026-10-11', status: 'new' },
];

const MOCK_ACTIVITY = [
  { id: 1, text: '<strong>Rahul Sharma</strong> submitted a volunteer inquiry', time: '2 hours ago', color: 'emerald' },
  { id: 2, text: '<strong>₹5,000</strong> donation received from Vikram Singh', time: '4 hours ago', color: 'gold' },
  { id: 3, text: 'New healthcare booking by <strong>Lakshmi Devi</strong> (Golden Profile–1)', time: '5 hours ago', color: 'blue' },
  { id: 4, text: 'Contact message from <strong>Amrit Kaur</strong> about partnership', time: '6 hours ago', color: 'emerald' },
  { id: 5, text: 'Booking <strong>BK-004</strong> cancelled by Suresh Babu', time: '1 day ago', color: 'rose' },
  { id: 6, text: '<strong>₹25,000</strong> donation received from Rajesh Mehta', time: '1 day ago', color: 'gold' },
];

// ========== COMPONENT ==========

const AdminPanel = () => {
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [activeSection, setActiveSection] = useState('dashboard');
  const [selectedItem, setSelectedItem] = useState(null);
  const [filterStatus, setFilterStatus] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');

  // ===== Auth Guard =====
  useEffect(() => {
    const auth = localStorage.getItem('togu_admin_auth');
    if (!auth) {
      navigate('/admin/login');
      return;
    }
    try {
      const parsed = JSON.parse(auth);
      if (!parsed.isAuthenticated) {
        navigate('/admin/login');
      }
    } catch {
      navigate('/admin/login');
    }
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem('togu_admin_auth');
    navigate('/admin/login');
  };

  // Computed counts
  const newInquiries = MOCK_INQUIRIES.filter(i => i.status === 'new').length;
  const pendingBookings = MOCK_BOOKINGS.filter(b => b.status === 'pending').length;
  const totalDonations = MOCK_DONATIONS.reduce((sum, d) => sum + parseInt(d.amount.replace(/[₹,]/g, '')), 0);
  const newContacts = MOCK_CONTACTS.filter(c => c.status === 'new').length;

  // Section titles map
  const sectionTitles = {
    dashboard: 'Dashboard Overview',
    inquiries: 'Volunteer Inquiries',
    bookings: 'Healthcare Bookings',
    donations: 'Donation Records',
    contacts: 'Contact Messages',
    settings: 'Settings',
  };

  // Navigation items
  const navItems = [
    { key: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { key: 'inquiries', label: 'Inquiries', icon: ClipboardList, badge: newInquiries },
    { key: 'bookings', label: 'Healthcare', icon: HeartPulse, badge: pendingBookings },
    { key: 'donations', label: 'Donations', icon: IndianRupee },
    { key: 'contacts', label: 'Messages', icon: MessageSquare, badge: newContacts },
  ];

  const handleStatusUpdate = (type, id, newStatus) => {
    // In a real app, this would update state/API
    alert(`Updated ${type} ${id} status to "${newStatus}"`);
  };

  const handleDelete = (type, id) => {
    if (window.confirm(`Are you sure you want to delete ${id}?`)) {
      alert(`Deleted ${type} ${id}`);
    }
  };

  // Filtered data helpers
  const getFilteredData = (data) => {
    let filtered = data;
    if (filterStatus !== 'all') {
      filtered = filtered.filter(item => item.status === filterStatus);
    }
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      filtered = filtered.filter(item =>
        Object.values(item).some(val =>
          String(val).toLowerCase().includes(q)
        )
      );
    }
    return filtered;
  };

  // ========== RENDER SECTIONS ==========

  const renderDashboard = () => (
    <>
      {/* Stats Grid */}
      <div className="stats-grid">
        <div className="stat-card emerald" onClick={() => setActiveSection('inquiries')} style={{ cursor: 'pointer' }}>
          <div className="stat-card-header">
            <div className="stat-card-icon"><ClipboardList size={22} /></div>
            <span className="stat-card-trend up"><TrendingUp size={12} /> +12%</span>
          </div>
          <div className="stat-card-value">{MOCK_INQUIRIES.length}</div>
          <div className="stat-card-label">Total Inquiries</div>
        </div>

        <div className="stat-card gold" onClick={() => setActiveSection('bookings')} style={{ cursor: 'pointer' }}>
          <div className="stat-card-header">
            <div className="stat-card-icon"><HeartPulse size={22} /></div>
            <span className="stat-card-trend up"><TrendingUp size={12} /> +8%</span>
          </div>
          <div className="stat-card-value">{MOCK_BOOKINGS.length}</div>
          <div className="stat-card-label">Healthcare Bookings</div>
        </div>

        <div className="stat-card teal" onClick={() => setActiveSection('donations')} style={{ cursor: 'pointer' }}>
          <div className="stat-card-header">
            <div className="stat-card-icon"><IndianRupee size={22} /></div>
            <span className="stat-card-trend up"><TrendingUp size={12} /> +24%</span>
          </div>
          <div className="stat-card-value">₹{totalDonations.toLocaleString()}</div>
          <div className="stat-card-label">Total Donations</div>
        </div>

        <div className="stat-card rose" onClick={() => setActiveSection('contacts')} style={{ cursor: 'pointer' }}>
          <div className="stat-card-header">
            <div className="stat-card-icon"><MessageSquare size={22} /></div>
            <span className="stat-card-trend down"><TrendingDown size={12} /> -3%</span>
          </div>
          <div className="stat-card-value">{MOCK_CONTACTS.length}</div>
          <div className="stat-card-label">Contact Messages</div>
        </div>
      </div>

      {/* Two Column Layout */}
      <div className="admin-grid-2">
        {/* Chart Section */}
        <div className="admin-panel">
          <div className="admin-panel-header">
            <div className="admin-panel-title">
              <BarChart3 size={18} className="panel-icon" />
              Monthly Overview
            </div>
            <div className="panel-actions">
              <button className="panel-action-btn ghost"><Filter size={14} /> Filter</button>
              <button className="panel-action-btn ghost"><Download size={14} /> Export</button>
            </div>
          </div>
          <div className="chart-container">
            <div className="chart-bars">
              {[
                { label: 'May', value: 28, color: 'rgba(74, 222, 128, 0.6)' },
                { label: 'Jun', value: 42, color: 'rgba(74, 222, 128, 0.7)' },
                { label: 'Jul', value: 35, color: 'rgba(74, 222, 128, 0.65)' },
                { label: 'Aug', value: 55, color: 'rgba(238, 163, 40, 0.6)' },
                { label: 'Sep', value: 48, color: 'rgba(238, 163, 40, 0.7)' },
                { label: 'Oct', value: 67, color: 'linear-gradient(180deg, #4ade80, #0b4b25)' },
              ].map((bar, i) => (
                <div key={i} className="chart-bar-group">
                  <div className="chart-bar-value">{bar.value}</div>
                  <div
                    className="chart-bar"
                    style={{
                      height: `${(bar.value / 70) * 160}px`,
                      background: bar.color,
                    }}
                  />
                  <div className="chart-bar-label">{bar.label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Activity Feed */}
        <div className="admin-panel">
          <div className="admin-panel-header">
            <div className="admin-panel-title">
              <Activity size={18} className="panel-icon" />
              Recent Activity
            </div>
            <button className="panel-action-btn ghost">View All</button>
          </div>
          <div className="activity-feed">
            {MOCK_ACTIVITY.map((act, i) => (
              <div key={act.id} className="activity-item">
                <div className="activity-dot-wrap">
                  <div className={`activity-dot ${act.color}`} />
                  {i < MOCK_ACTIVITY.length - 1 && <div className="activity-line" />}
                </div>
                <div className="activity-body">
                  <div className="activity-text" dangerouslySetInnerHTML={{ __html: act.text }} />
                  <div className="activity-time"><Clock size={11} style={{ marginRight: '4px', verticalAlign: 'middle' }} />{act.time}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Quick Recent Tables */}
      <div className="admin-grid-2">
        {/* Recent Inquiries Mini Table */}
        <div className="admin-panel">
          <div className="admin-panel-header">
            <div className="admin-panel-title">
              <ClipboardList size={18} className="panel-icon" />
              Latest Inquiries
            </div>
            <button className="panel-action-btn ghost" onClick={() => setActiveSection('inquiries')}>
              View All <ArrowUpRight size={14} />
            </button>
          </div>
          <div className="admin-table-wrap">
            <table className="admin-table">
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Role</th>
                  <th>Status</th>
                  <th>Date</th>
                </tr>
              </thead>
              <tbody>
                {MOCK_INQUIRIES.slice(0, 3).map(inq => (
                  <tr key={inq.id}>
                    <td>
                      <div className="name-cell">
                        <span className="name-primary">{inq.firstName} {inq.lastName}</span>
                        <span className="name-secondary">{inq.email}</span>
                      </div>
                    </td>
                    <td>{inq.role}</td>
                    <td><span className={`status-badge ${inq.status}`}>{inq.status.replace('-', ' ')}</span></td>
                    <td>{inq.date}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Recent Donations Mini Table */}
        <div className="admin-panel">
          <div className="admin-panel-header">
            <div className="admin-panel-title">
              <IndianRupee size={18} className="panel-icon" />
              Latest Donations
            </div>
            <button className="panel-action-btn ghost" onClick={() => setActiveSection('donations')}>
              View All <ArrowUpRight size={14} />
            </button>
          </div>
          <div className="admin-table-wrap">
            <table className="admin-table">
              <thead>
                <tr>
                  <th>Donor</th>
                  <th>Amount</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {MOCK_DONATIONS.slice(0, 3).map(don => (
                  <tr key={don.id}>
                    <td><span className="name-primary">{don.name}</span></td>
                    <td style={{ color: '#4ade80', fontWeight: 700 }}>{don.amount}</td>
                    <td><span className={`status-badge ${don.status}`}>{don.status}</span></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </>
  );

  const renderInquiries = () => {
    const filtered = getFilteredData(MOCK_INQUIRIES);
    return (
      <div className="admin-panel">
        <div className="admin-panel-header">
          <div className="admin-panel-title">
            <ClipboardList size={18} className="panel-icon" />
            All Volunteer / Partner Inquiries
          </div>
          <div className="panel-actions">
            <button className="panel-action-btn ghost"><Download size={14} /> Export CSV</button>
          </div>
        </div>
        <div className="filters-bar">
          <select className="filter-select" value={filterStatus} onChange={e => setFilterStatus(e.target.value)}>
            <option value="all">All Status</option>
            <option value="new">New</option>
            <option value="in-progress">In Progress</option>
            <option value="completed">Completed</option>
          </select>
          <div className="filter-search">
            <Search size={14} style={{ color: '#5a8c6b', flexShrink: 0 }} />
            <input placeholder="Search by name, email, role..." value={searchQuery} onChange={e => setSearchQuery(e.target.value)} />
          </div>
        </div>
        <div className="admin-table-wrap">
          <table className="admin-table">
            <thead>
              <tr>
                <th>ID</th>
                <th>Name</th>
                <th>Role</th>
                <th>Phone</th>
                <th>City</th>
                <th>Priority</th>
                <th>Status</th>
                <th>Date</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0 ? (
                <tr><td colSpan={9} style={{ textAlign: 'center', padding: '2rem', color: '#5a8c6b' }}>No inquiries found</td></tr>
              ) : filtered.map(inq => (
                <tr key={inq.id}>
                  <td style={{ color: '#eea328', fontWeight: 600 }}>{inq.id}</td>
                  <td>
                    <div className="name-cell">
                      <span className="name-primary">{inq.firstName} {inq.lastName}</span>
                      <span className="name-secondary">{inq.email}</span>
                    </div>
                  </td>
                  <td>{inq.role}</td>
                  <td>{inq.phone}</td>
                  <td>{inq.city}</td>
                  <td><span className={`priority-badge ${inq.priority}`}>{inq.priority}</span></td>
                  <td><span className={`status-badge ${inq.status}`}>{inq.status.replace('-', ' ')}</span></td>
                  <td>{inq.date}</td>
                  <td>
                    <button className="table-action-btn" title="View Details" onClick={() => setSelectedItem({ type: 'inquiry', data: inq })}><Eye size={14} /></button>
                    <button className="table-action-btn" title="Mark Complete" onClick={() => handleStatusUpdate('inquiry', inq.id, 'completed')}><CheckCircle2 size={14} /></button>
                    <button className="table-action-btn danger" title="Delete" onClick={() => handleDelete('inquiry', inq.id)}><Trash2 size={14} /></button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="pagination">
          <div className="pagination-info">Showing {filtered.length} of {MOCK_INQUIRIES.length} entries</div>
          <div className="pagination-buttons">
            <button className="page-btn"><ChevronLeft size={14} /></button>
            <button className="page-btn active">1</button>
            <button className="page-btn"><ChevronRight size={14} /></button>
          </div>
        </div>
      </div>
    );
  };

  const renderBookings = () => {
    const filtered = getFilteredData(MOCK_BOOKINGS);
    return (
      <div className="admin-panel">
        <div className="admin-panel-header">
          <div className="admin-panel-title">
            <HeartPulse size={18} className="panel-icon" />
            Healthcare Test Bookings
          </div>
          <div className="panel-actions">
            <button className="panel-action-btn ghost"><Download size={14} /> Export</button>
          </div>
        </div>
        <div className="filters-bar">
          <select className="filter-select" value={filterStatus} onChange={e => setFilterStatus(e.target.value)}>
            <option value="all">All Status</option>
            <option value="pending">Pending</option>
            <option value="in-progress">In Progress</option>
            <option value="completed">Completed</option>
            <option value="cancelled">Cancelled</option>
          </select>
          <div className="filter-search">
            <Search size={14} style={{ color: '#5a8c6b', flexShrink: 0 }} />
            <input placeholder="Search by patient, package..." value={searchQuery} onChange={e => setSearchQuery(e.target.value)} />
          </div>
        </div>
        <div className="admin-table-wrap">
          <table className="admin-table">
            <thead>
              <tr>
                <th>ID</th>
                <th>Patient</th>
                <th>Package</th>
                <th>Amount</th>
                <th>Collection</th>
                <th>Area</th>
                <th>Prescription</th>
                <th>Status</th>
                <th>Date</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0 ? (
                <tr><td colSpan={10} style={{ textAlign: 'center', padding: '2rem', color: '#5a8c6b' }}>No bookings found</td></tr>
              ) : filtered.map(bk => (
                <tr key={bk.id}>
                  <td style={{ color: '#eea328', fontWeight: 600 }}>{bk.id}</td>
                  <td>
                    <div className="name-cell">
                      <span className="name-primary">{bk.patientName}</span>
                      <span className="name-secondary">{bk.phone}</span>
                    </div>
                  </td>
                  <td>{bk.package}</td>
                  <td style={{ color: '#4ade80', fontWeight: 700 }}>{bk.amount}</td>
                  <td>
                    {bk.collection === 'Home' ? (
                      <span style={{ display: 'inline-flex', alignItems: 'center', gap: '4px', color: '#2dd4bf' }}><Home size={13} /> Home</span>
                    ) : (
                      <span style={{ display: 'inline-flex', alignItems: 'center', gap: '4px', color: '#8fac99' }}><MapPin size={13} /> Lab</span>
                    )}
                  </td>
                  <td>{bk.area}</td>
                  <td>
                    {bk.prescription ? (
                      <span style={{ color: '#4ade80' }}><FileText size={14} style={{ verticalAlign: 'middle' }} /> Uploaded</span>
                    ) : (
                      <span style={{ color: '#5a8c6b' }}>—</span>
                    )}
                  </td>
                  <td><span className={`status-badge ${bk.status}`}>{bk.status}</span></td>
                  <td>{bk.date}</td>
                  <td>
                    <button className="table-action-btn" title="View" onClick={() => setSelectedItem({ type: 'booking', data: bk })}><Eye size={14} /></button>
                    <button className="table-action-btn" title="Complete" onClick={() => handleStatusUpdate('booking', bk.id, 'completed')}><CheckCircle2 size={14} /></button>
                    <button className="table-action-btn danger" title="Cancel" onClick={() => handleStatusUpdate('booking', bk.id, 'cancelled')}><X size={14} /></button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="pagination">
          <div className="pagination-info">Showing {filtered.length} of {MOCK_BOOKINGS.length} entries</div>
          <div className="pagination-buttons">
            <button className="page-btn"><ChevronLeft size={14} /></button>
            <button className="page-btn active">1</button>
            <button className="page-btn"><ChevronRight size={14} /></button>
          </div>
        </div>
      </div>
    );
  };

  const renderDonations = () => {
    const filtered = getFilteredData(MOCK_DONATIONS);
    return (
      <>
        {/* Quick Stats */}
        <div className="quick-stats-row">
          <div className="quick-stat-item">
            <div className="quick-stat-icon" style={{ background: 'rgba(74, 222, 128, 0.1)', color: '#4ade80' }}><IndianRupee size={20} /></div>
            <div className="quick-stat-info">
              <span className="quick-stat-value">₹{totalDonations.toLocaleString()}</span>
              <span className="quick-stat-label">Total Collected</span>
            </div>
          </div>
          <div className="quick-stat-item">
            <div className="quick-stat-icon" style={{ background: 'rgba(238, 163, 40, 0.1)', color: '#eea328' }}><Users size={20} /></div>
            <div className="quick-stat-info">
              <span className="quick-stat-value">{MOCK_DONATIONS.length}</span>
              <span className="quick-stat-label">Total Donors</span>
            </div>
          </div>
          <div className="quick-stat-item">
            <div className="quick-stat-icon" style={{ background: 'rgba(45, 212, 191, 0.1)', color: '#2dd4bf' }}><TrendingUp size={20} /></div>
            <div className="quick-stat-info">
              <span className="quick-stat-value">₹{Math.round(totalDonations / MOCK_DONATIONS.length).toLocaleString()}</span>
              <span className="quick-stat-label">Average Donation</span>
            </div>
          </div>
        </div>

        <div className="admin-panel">
          <div className="admin-panel-header">
            <div className="admin-panel-title">
              <IndianRupee size={18} className="panel-icon" />
              All Donation Records
            </div>
            <div className="panel-actions">
              <button className="panel-action-btn ghost"><Download size={14} /> Export</button>
            </div>
          </div>
          <div className="filters-bar">
            <select className="filter-select" value={filterStatus} onChange={e => setFilterStatus(e.target.value)}>
              <option value="all">All Status</option>
              <option value="completed">Completed</option>
              <option value="pending">Pending</option>
            </select>
            <div className="filter-search">
              <Search size={14} style={{ color: '#5a8c6b', flexShrink: 0 }} />
              <input placeholder="Search donors..." value={searchQuery} onChange={e => setSearchQuery(e.target.value)} />
            </div>
          </div>
          <div className="admin-table-wrap">
            <table className="admin-table">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Donor</th>
                  <th>Amount</th>
                  <th>Method</th>
                  <th>PAN</th>
                  <th>Status</th>
                  <th>Date</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filtered.length === 0 ? (
                  <tr><td colSpan={8} style={{ textAlign: 'center', padding: '2rem', color: '#5a8c6b' }}>No donations found</td></tr>
                ) : filtered.map(don => (
                  <tr key={don.id}>
                    <td style={{ color: '#eea328', fontWeight: 600 }}>{don.id}</td>
                    <td>
                      <div className="name-cell">
                        <span className="name-primary">{don.name}</span>
                        <span className="name-secondary">{don.email}</span>
                      </div>
                    </td>
                    <td style={{ color: '#4ade80', fontWeight: 700, fontSize: '0.95rem' }}>{don.amount}</td>
                    <td>{don.method}</td>
                    <td style={{ fontFamily: 'monospace', letterSpacing: '0.5px' }}>{don.pan}</td>
                    <td><span className={`status-badge ${don.status}`}>{don.status}</span></td>
                    <td>{don.date}</td>
                    <td>
                      <button className="table-action-btn" title="View" onClick={() => setSelectedItem({ type: 'donation', data: don })}><Eye size={14} /></button>
                      <button className="table-action-btn danger" title="Delete" onClick={() => handleDelete('donation', don.id)}><Trash2 size={14} /></button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="pagination">
            <div className="pagination-info">Showing {filtered.length} of {MOCK_DONATIONS.length} entries</div>
            <div className="pagination-buttons">
              <button className="page-btn"><ChevronLeft size={14} /></button>
              <button className="page-btn active">1</button>
              <button className="page-btn"><ChevronRight size={14} /></button>
            </div>
          </div>
        </div>
      </>
    );
  };

  const renderContacts = () => {
    const filtered = getFilteredData(MOCK_CONTACTS);
    return (
      <div className="admin-panel">
        <div className="admin-panel-header">
          <div className="admin-panel-title">
            <MessageSquare size={18} className="panel-icon" />
            Contact Form Messages
          </div>
          <div className="panel-actions">
            <button className="panel-action-btn ghost"><Download size={14} /> Export</button>
          </div>
        </div>
        <div className="filters-bar">
          <select className="filter-select" value={filterStatus} onChange={e => setFilterStatus(e.target.value)}>
            <option value="all">All Status</option>
            <option value="new">New</option>
            <option value="in-progress">In Progress</option>
            <option value="completed">Resolved</option>
          </select>
          <div className="filter-search">
            <Search size={14} style={{ color: '#5a8c6b', flexShrink: 0 }} />
            <input placeholder="Search messages..." value={searchQuery} onChange={e => setSearchQuery(e.target.value)} />
          </div>
        </div>
        <div className="admin-table-wrap">
          <table className="admin-table">
            <thead>
              <tr>
                <th>ID</th>
                <th>Name</th>
                <th>Subject</th>
                <th>Message</th>
                <th>Status</th>
                <th>Date</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0 ? (
                <tr><td colSpan={7} style={{ textAlign: 'center', padding: '2rem', color: '#5a8c6b' }}>No messages found</td></tr>
              ) : filtered.map(ct => (
                <tr key={ct.id}>
                  <td style={{ color: '#eea328', fontWeight: 600 }}>{ct.id}</td>
                  <td>
                    <div className="name-cell">
                      <span className="name-primary">{ct.name}</span>
                      <span className="name-secondary">{ct.email}</span>
                    </div>
                  </td>
                  <td style={{ color: '#c5e4d2', fontWeight: 500 }}>{ct.subject}</td>
                  <td style={{ maxWidth: '250px', overflow: 'hidden', textOverflow: 'ellipsis' }}>{ct.message}</td>
                  <td><span className={`status-badge ${ct.status}`}>{ct.status === 'completed' ? 'resolved' : ct.status.replace('-', ' ')}</span></td>
                  <td>{ct.date}</td>
                  <td>
                    <button className="table-action-btn" title="View" onClick={() => setSelectedItem({ type: 'contact', data: ct })}><Eye size={14} /></button>
                    <button className="table-action-btn" title="Mark Resolved" onClick={() => handleStatusUpdate('contact', ct.id, 'completed')}><CheckCircle2 size={14} /></button>
                    <button className="table-action-btn danger" title="Delete" onClick={() => handleDelete('contact', ct.id)}><Trash2 size={14} /></button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="pagination">
          <div className="pagination-info">Showing {filtered.length} of {MOCK_CONTACTS.length} entries</div>
          <div className="pagination-buttons">
            <button className="page-btn"><ChevronLeft size={14} /></button>
            <button className="page-btn active">1</button>
            <button className="page-btn"><ChevronRight size={14} /></button>
          </div>
        </div>
      </div>
    );
  };

  const renderSettings = () => (
    <div className="admin-panel">
      <div className="admin-panel-header">
        <div className="admin-panel-title">
          <Settings size={18} className="panel-icon" />
          Admin Settings
        </div>
      </div>
      <div style={{ padding: '2rem' }}>
        <div style={{ display: 'grid', gap: '1.5rem', maxWidth: '600px' }}>
          <div>
            <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.85rem', fontWeight: 600, color: '#c5e4d2' }}>Admin Email</label>
            <input type="email" defaultValue="admin@togufoundation.org" style={{
              width: '100%', padding: '0.75rem 1rem', borderRadius: '10px',
              background: 'rgba(11, 38, 24, 0.5)', border: '1px solid rgba(74, 222, 128, 0.1)',
              color: '#e2f5e9', fontSize: '0.9rem', outline: 'none', fontFamily: 'var(--font-body)'
            }} />
          </div>
          <div>
            <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.85rem', fontWeight: 600, color: '#c5e4d2' }}>WhatsApp Contact Number</label>
            <input type="tel" defaultValue="+91 90102 15674" style={{
              width: '100%', padding: '0.75rem 1rem', borderRadius: '10px',
              background: 'rgba(11, 38, 24, 0.5)', border: '1px solid rgba(74, 222, 128, 0.1)',
              color: '#e2f5e9', fontSize: '0.9rem', outline: 'none', fontFamily: 'var(--font-body)'
            }} />
          </div>
          <div>
            <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.85rem', fontWeight: 600, color: '#c5e4d2' }}>Notification Preferences</label>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              {['Email notifications for new inquiries', 'SMS alerts for healthcare bookings', 'Daily donation summary report'].map((opt, i) => (
                <label key={i} style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', cursor: 'pointer', color: '#b5cfc0', fontSize: '0.85rem' }}>
                  <input type="checkbox" defaultChecked style={{ accentColor: '#4ade80', width: '16px', height: '16px' }} />
                  {opt}
                </label>
              ))}
            </div>
          </div>
          <button className="panel-action-btn primary" style={{ padding: '0.75rem 2rem', fontSize: '0.9rem', borderRadius: '10px', marginTop: '0.5rem', width: 'fit-content' }}>
            Save Changes
          </button>
        </div>
      </div>
    </div>
  );

  // ========== DETAIL MODAL ==========
  const renderDetailModal = () => {
    if (!selectedItem) return null;
    const { type, data } = selectedItem;

    let title = '';
    let rows = [];

    if (type === 'inquiry') {
      title = `Inquiry ${data.id}`;
      rows = [
        ['Full Name', `${data.firstName} ${data.lastName}`],
        ['Email', data.email],
        ['Phone', data.phone],
        ['Role Applied', data.role],
        ['City', data.city],
        ['Priority', data.priority],
        ['Status', data.status.replace('-', ' ')],
        ['Date', data.date],
        ['Message', data.message],
      ];
    } else if (type === 'booking') {
      title = `Booking ${data.id}`;
      rows = [
        ['Patient Name', data.patientName],
        ['Phone', data.phone],
        ['Package', data.package],
        ['Amount', data.amount],
        ['Collection Type', data.collection],
        ['Area', data.area],
        ['Prescription', data.prescription ? 'Uploaded ✓' : 'Not uploaded'],
        ['Status', data.status],
        ['Date', data.date],
      ];
    } else if (type === 'donation') {
      title = `Donation ${data.id}`;
      rows = [
        ['Donor Name', data.name],
        ['Email', data.email],
        ['Phone', data.phone],
        ['Amount', data.amount],
        ['Payment Method', data.method],
        ['PAN Number', data.pan],
        ['Status', data.status],
        ['Date', data.date],
      ];
    } else if (type === 'contact') {
      title = `Message ${data.id}`;
      rows = [
        ['Name', data.name],
        ['Email', data.email],
        ['Subject', data.subject],
        ['Status', data.status === 'completed' ? 'Resolved' : data.status.replace('-', ' ')],
        ['Date', data.date],
        ['Full Message', data.message],
      ];
    }

    return (
      <div className="admin-modal-overlay" onClick={() => setSelectedItem(null)}>
        <div className="admin-modal" onClick={e => e.stopPropagation()}>
          <div className="admin-modal-header">
            <span className="admin-modal-title">{title}</span>
            <button className="admin-modal-close" onClick={() => setSelectedItem(null)}><X size={16} /></button>
          </div>
          <div className="admin-modal-body">
            {rows.map(([label, value], i) => (
              <div key={i} className="detail-row">
                <span className="detail-label">{label}</span>
                <span className="detail-value">{value}</span>
              </div>
            ))}
          </div>
          <div className="admin-modal-footer">
            {(type === 'inquiry' || type === 'contact') && (
              <button className="panel-action-btn primary" onClick={() => { handleStatusUpdate(type, data.id, 'completed'); setSelectedItem(null); }}>
                <CheckCircle2 size={14} /> Mark as Resolved
              </button>
            )}
            {type === 'booking' && data.status !== 'completed' && (
              <button className="panel-action-btn primary" onClick={() => { handleStatusUpdate(type, data.id, 'completed'); setSelectedItem(null); }}>
                <CheckCircle2 size={14} /> Mark Complete
              </button>
            )}
            <button className="panel-action-btn ghost" onClick={() => setSelectedItem(null)}>Close</button>
          </div>
        </div>
      </div>
    );
  };

  // Reset filters on section change
  const handleSectionChange = (key) => {
    setActiveSection(key);
    setFilterStatus('all');
    setSearchQuery('');
  };

  // ========== MAIN RENDER ==========
  return (
    <div className="admin-layout">
      {/* Sidebar */}
      <aside className={`admin-sidebar ${sidebarOpen ? '' : 'collapsed'}`}>
        <div className="sidebar-header">
          <div className="sidebar-logo">TF</div>
          <div className="sidebar-brand">
            <span className="sidebar-brand-name">TOGU Foundation</span>
            <span className="sidebar-brand-sub">Admin Panel</span>
          </div>
        </div>

        <nav className="sidebar-nav">
          <div className="sidebar-section-label">Main Menu</div>
          {navItems.map(item => (
            <button
              key={item.key}
              className={`sidebar-nav-item ${activeSection === item.key ? 'active' : ''}`}
              onClick={() => handleSectionChange(item.key)}
            >
              <item.icon size={18} />
              {item.label}
              {item.badge > 0 && <span className="sidebar-nav-badge">{item.badge}</span>}
            </button>
          ))}

          <div className="sidebar-section-label" style={{ marginTop: '1rem' }}>System</div>
          <button
            className={`sidebar-nav-item ${activeSection === 'settings' ? 'active' : ''}`}
            onClick={() => handleSectionChange('settings')}
          >
            <Settings size={18} />
            Settings
          </button>
        </nav>

        <div className="sidebar-footer">
          <button className="sidebar-footer-btn" onClick={() => navigate('/')}>
            <Home size={18} />
            Back to Website
          </button>
          <button className="sidebar-footer-btn" style={{ marginTop: '0.25rem' }} onClick={handleLogout}>
            <LogOut size={18} />
            Logout
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <div className={`admin-main ${sidebarOpen ? '' : 'expanded'}`}>
        {/* Top Bar */}
        <header className="admin-topbar">
          <div className="topbar-left">
            <button className="topbar-toggle" onClick={() => setSidebarOpen(!sidebarOpen)}>
              {sidebarOpen ? <X size={18} /> : <Menu size={18} />}
            </button>
            <h1 className="topbar-title">{sectionTitles[activeSection]}</h1>
          </div>
          <div className="topbar-right">
            <div className="topbar-search">
              <Search size={16} />
              <input placeholder="Quick search..." />
            </div>
            <button className="topbar-icon-btn">
              <Bell size={18} />
              <span className="notif-dot"></span>
            </button>
            <div className="topbar-avatar">AD</div>
          </div>
        </header>

        {/* Content */}
        <div className="admin-content">
          {activeSection === 'dashboard' && renderDashboard()}
          {activeSection === 'inquiries' && renderInquiries()}
          {activeSection === 'bookings' && renderBookings()}
          {activeSection === 'donations' && renderDonations()}
          {activeSection === 'contacts' && renderContacts()}
          {activeSection === 'settings' && renderSettings()}
        </div>
      </div>

      {/* Detail Modal */}
      {renderDetailModal()}
    </div>
  );
};

export default AdminPanel;
